import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Pet, Match } from '../types';
import { 
  ArrowLeft, MapPin, Clock, Heart, Share2, Phone, MessageCircle, 
  Sparkles, CheckCircle, AlertCircle, Mail, User, Calendar,
  Eye, Ear, Footprints, Palette, Ruler,
  Trash2,
  CheckSquare,
  Edit,
  Download
} from 'lucide-react';
import { API_URL } from '../config';

interface PetDetailProps {
  pet: Pet;
  matches: Match[];
  onBack: () => void;
  onOpenChat: (match: Match) => void;
  onViewMatch: (pet: Pet) => void;
  onEdit?: (pet: Pet) => void;
  onDelete?: (pet: Pet) => void;
  onMarkAsFound?: (pet: Pet) => void;
}

export function PetDetail({ pet, matches, onBack, onOpenChat, onViewMatch, onEdit, onDelete, onMarkAsFound }: PetDetailProps) {
  const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
L.Marker.prototype.options.icon = DefaultIcon;
  console.log('Rendering PetDetail for pet:', pet, matches);
  const { theme } = useTheme();
  const [fetchedMatches, setFetchedMatches] = useState<Match[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const bgClass = theme === 'light' 
    ? 'bg-gray-50' 
    : 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900';
  const cardBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900/50 backdrop-blur-xl border border-purple-500/20';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondaryClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const borderClass = theme === 'light' ? 'border-gray-200' : 'border-purple-500/20';

  // Filter matches related to this pet
  const relatedMatches = matches.filter(
    match => match.lost_pets.id === pet.id || match.found_pets.id === pet.id
  );

  async function fetchMatches() {
    const response = await fetch(`${API_URL}/api/matches/${pet.status === 'lost' ? 'lost' : 'found'}/${pet.id}`);
    const data = await response.json();
    console.log('Fetched Matches Data:', data);
    const structuredData: Match[] = data.map((match: any) => ({
      ...match,
      similarity: match.score * 100,
      found_pets: {
        ...match.found_pets,
        name: (pet.status === 'lost' ? match.found_pets.name : 'Desconocido'),
      }
    }));
    setFetchedMatches(structuredData);
  }


  useEffect(() => {
    fetchMatches();
  }, []);


  const allMatches = [...fetchedMatches];

  const getTimeAgo = (timestamp: string) => {
    const hours = Math.round((Date.now() - new Date(timestamp).getTime()) / 3600000);
    if (hours < 1) return 'Hace menos de 1 hora';
    if (hours === 1) return 'Hace 1 hora';
    if (hours < 24) return `Hace ${hours} horas`;
    const days = Math.floor(hours / 24);
    return days === 1 ? 'Hace 1 día' : `Hace ${days} días`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pet.status === 'lost' ? 'Mascota Perdida' : 'Mascota Encontrada'}: ${pet.name}`,
          text: `${pet.description} - Cerca de ${pet.lat}, ${pet.lng}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleDownload = async () => {
    try {
      // Crear un canvas para generar la imagen con información
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Configurar el tamaño del canvas
      canvas.width = 800;
      canvas.height = 1000;

      // Cargar la imagen
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = pet.photo_url;

      img.onload = () => {
        // Dibujar fondo
        ctx.fillStyle = theme === 'light' ? '#ffffff' : '#1f2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar la imagen principal
        ctx.drawImage(img, 0, 0, canvas.width, 600);

        // Dibujar badge de estado
        const statusText = pet.status === 'lost' ? '🔴 PERDIDO' : '✅ ENCONTRADO';
        const statusColor = pet.status === 'lost' ? '#dc2626' : '#16a34a';
        
        ctx.fillStyle = statusColor;
        ctx.fillRect(20, 20, 200, 50);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(statusText, 35, 52);

        // Dibujar información principal
        ctx.fillStyle = theme === 'light' ? '#000000' : '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(pet.name, 40, 680);

        ctx.font = '24px Arial';
        ctx.fillText(pet.breed, 40, 720);

        ctx.font = '20px Arial';
        ctx.fillStyle = theme === 'light' ? '#666666' : '#9ca3af';
        
        // Descripción
        const words = pet.description.split(' ');
        let line = '';
        let y = 760;
        const maxWidth = 720;
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, 40, y);
            line = words[i] + ' ';
            y += 28;
            if (y > 850) break; // Limitar altura
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 40, y);

        // Información adicional
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = theme === 'light' ? '#000000' : '#ffffff';
        ctx.fillText(`📍 Cerca de ${pet.lat}, ${pet.lng}`, 40, y + 50);

        ctx.font = '18px Arial';
        ctx.fillStyle = theme === 'light' ? '#8b5cf6' : '#a78bfa';
        ctx.fillText(`Color: ${pet.color} | Tamaño: ${pet.size} | ${pet.phone || 'Ver contacto en app'}`, 40, y + 80);

        ctx.font = 'bold 16px Arial';
        ctx.fillText('DONDE ESTAS PELUDITO - Encuentra a tu mascota con IA', 40, 970);

        // Descargar la imagen
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${pet.status}-${pet.name.toLowerCase()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
        });
      };

      img.onerror = () => {
        // Fallback: solo descargar la imagen original
        const link = document.createElement('a');
        link.download = `${pet.name.toLowerCase()}.jpg`;
        link.href = pet.photo_url;
        link.target = '_blank';
        link.click();
      };
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('No se pudo descargar la imagen');
    }
  };

  return (
    <div className={`min-h-screen ${bgClass} py-8`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-full transition-all ${
            theme === 'light'
              ? 'bg-white text-gray-900 hover:bg-gray-100'
              : 'bg-gray-800/50 text-white hover:bg-gray-800 border border-purple-500/20'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className={`${cardBgClass} rounded-2xl overflow-hidden shadow-xl`}>
              <div className="relative">
                <img
                  src={pet.photo_url}
                  alt={pet.name}
                  className="w-full h-96 object-cover"
                />
                
                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-white backdrop-blur-md ${
                  pet.status === 'lost' 
                    ? theme === 'light'
                      ? 'bg-red-600'
                      : 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/50'
                    : theme === 'light'
                      ? 'bg-green-600'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
                }`}>
                  {pet.status === 'lost' ? '🔴 PERDIDO' : '✅ ENCONTRADO'}
                </div>

                {/* AI Active Badge */}
                {Date.now() - new Date(pet.timestamp).getTime() < 48 * 60 * 60 * 1000 && (
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md ${
                    theme === 'light'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                    IA Buscando Activamente
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button
                    onClick={handleDownload}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      theme === 'light'
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-gray-900/80 backdrop-blur-sm text-white hover:bg-gray-800'
                    }`}
                  >
                    <Download className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleShare}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      theme === 'light'
                        ? 'bg-white text-gray-900 hover:bg-gray-100'
                        : 'bg-gray-900/80 backdrop-blur-sm text-white hover:bg-gray-800'
                    }`}
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h1 className={`text-4xl mb-2 ${textClass}`}>{pet.name}</h1>
                <p className={`text-xl mb-4 ${textSecondaryClass}`}>{pet.breed}</p>

                {/* Quick Info */}
                <div className={`flex flex-wrap gap-4 mb-6 pb-6 border-b ${borderClass}`}>
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-5 h-5 ${textSecondaryClass}`} />
                    <span className={textClass}>Cerca de {pet.lat}, {pet.lng}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className={`w-5 h-5 ${textSecondaryClass}`} />
                    <span className={textClass}>{getTimeAgo(pet.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className={`w-5 h-5 ${textSecondaryClass}`} />
                    <span className={textClass}>{new Date(pet.timestamp).toLocaleDateString('es-MX', { 
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className={`text-xl mb-3 ${textClass}`}>Descripción</h3>
                  <p className={textSecondaryClass}>{pet.description}</p>
                </div>

                {/* Physical Characteristics */}
                <div>
                  <h3 className={`text-xl mb-4 ${textClass}`}>Características Físicas</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${
                      theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Ruler className={`w-5 h-5 ${textSecondaryClass}`} />
                        <span className={textSecondaryClass}>Tamaño</span>
                      </div>
                      <p className={`${textClass} capitalize`}>{pet.size}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Palette className={`w-5 h-5 ${textSecondaryClass}`} />
                        <span className={textSecondaryClass}>Color</span>
                      </div>
                      <p className={textClass}>{pet.color}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Footprints className={`w-5 h-5 ${textSecondaryClass}`} />
                        <span className={textSecondaryClass}>Raza</span>
                      </div>
                      <p className={textClass}>{pet.breed}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Matches Section */}
            {allMatches.length > 0 && (
              <div className={`${cardBgClass} rounded-2xl shadow-xl p-6`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === 'light'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  }`}>
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className={`text-2xl ${textClass}`}>
                      {allMatches.length} {allMatches.length === 1 ? 'Coincidencia Encontrada' : 'Coincidencias Encontradas'}
                    </h2>
                    <p className={textSecondaryClass}>
                      Nuestro sistema de IA ha encontrado estas posibles coincidencias
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {allMatches.map((match: Match) => {
                    const matchedPet = pet.status === 'lost' ? match.found_pets : match.lost_pets;
                    console.log('Rendering match:', match, 'for pet:', matchedPet, pet.status);
                    return (
                      <div
                        key={match.id}
                        className={`border rounded-xl p-4 transition-all cursor-pointer ${
                          theme === 'light'
                            ? 'border-gray-200 hover:border-purple-500 hover:shadow-lg'
                            : 'border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/20'
                        }`}
                        onClick={() => onViewMatch({...matchedPet, status: pet.status === 'lost' ? 'found' : 'lost'})}
                      >
                        <div className="flex gap-4">
                          {/* Match Image */}
                          <img
                            src={matchedPet.photo_url}
                            alt={matchedPet.name}
                            className="w-24 h-24 object-cover rounded-lg"
                          />

                          {/* Match Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className={`text-lg ${textClass}`}>{matchedPet.name}</h3>
                                <p className={`text-sm ${textSecondaryClass}`}>{matchedPet.breed}</p>
                              </div>
                              <div className={`px-3 py-1 rounded-full ${
                                match.similarity >= 85
                                  ? theme === 'light'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-green-500/20 text-green-400'
                                  : match.similarity >= 70
                                    ? theme === 'light'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-yellow-500/20 text-yellow-400'
                                    : theme === 'light'
                                      ? 'bg-orange-100 text-orange-700'
                                      : 'bg-orange-500/20 text-orange-400'
                              }`}>
                                {match.similarity}% Match
                              </div>
                            </div>

                            {/* Matched Features */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {match.matchedFeatures?.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                                    theme === 'light'
                                      ? 'bg-purple-100 text-purple-700'
                                      : 'bg-purple-500/20 text-purple-400'
                                  }`}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  {feature}
                                </span>
                              ))}
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className={`w-4 h-4 ${textSecondaryClass}`} />
                              <span className={`text-sm ${textSecondaryClass}`}>Cerca de {matchedPet.lat}, {matchedPet.lng}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Action Buttons Card */}
            {(onEdit || onDelete || (onMarkAsFound && pet.status === 'lost')) && (
              <div className={`${cardBgClass} rounded-2xl shadow-xl p-6`}>
                <h3 className={`text-xl mb-4 ${textClass}`}>Gestionar Publicación</h3>
                <div className="space-y-3">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(pet)}
                      className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                        theme === 'light'
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/50'
                      }`}
                    >
                      <Edit className="w-5 h-5" />
                      Editar Publicación
                    </button>
                  )}

                  {/*onMarkAsFound && pet.status === 'lost' && (
                    <button
                      onClick={() => onMarkAsFound(pet)}
                      className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                        theme === 'light'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50'
                      }`}
                    >
                      <CheckSquare className="w-5 h-5" />
                      Marcar como Encontrado
                    </button>
                  )*/}

                  {onDelete && (
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.')) {
                          onDelete(pet);
                        }
                      }}
                      className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all border ${
                        theme === 'light'
                          ? 'border-red-300 text-red-700 hover:bg-red-50'
                          : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      <Trash2 className="w-5 h-5" />
                      Eliminar Publicación
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Contact Card */}
            <div className={`${cardBgClass} rounded-2xl shadow-xl p-6`}>
              <h3 className={`text-xl mb-4 ${textClass}`}>Información de Contacto</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <User className={`w-5 h-5 mt-1 ${textSecondaryClass}`} />
                  <div>
                    <p className={`text-sm ${textSecondaryClass}`}>
                      {pet.status === 'lost' ? 'Dueño' : 'Reportado por'}
                    </p>
                    <p className={textClass}>
                      {pet.ownerName || pet.reporterName || 'No especificado'}
                    </p>
                  </div>
                </div>

                {pet.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className={`w-5 h-5 mt-1 ${textSecondaryClass}`} />
                    <div>
                      <p className={`text-sm ${textSecondaryClass}`}>Teléfono</p>
                      <a 
                        href={`tel:${pet.phone}`}
                        className={`${theme === 'light' ? 'text-purple-600' : 'text-purple-400'} hover:underline`}
                      >
                        {pet.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">

                {pet.phone && (
                  <a
                    href={`tel:${pet.phone}`}
                    className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all border ${
                      theme === 'light'
                        ? 'border-gray-300 text-gray-900 hover:border-gray-900'
                        : 'border-purple-500/30 text-white hover:border-purple-500'
                    }`}
                  >
                    <Phone className="w-5 h-5" />
                    Llamar
                  </a>
                )}
              </div>
            </div>

            {/* Location Card */}
            <div className={`${cardBgClass} rounded-2xl shadow-xl p-6`}>
              <h3 className={`text-xl mb-4 ${textClass}`}>Ubicación</h3>
              
              <div className="mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className={`w-5 h-5 mt-1 ${textSecondaryClass}`} />
                  <p className={textClass}>Cerca de {pet.lat}, {pet.lng}</p>
                </div>
              </div>

              {/* Map Placeholder */}
    <div className="w-full h-48 rounded-lg overflow-hidden relative">
      {pet &&
      <MapContainer
        center={[pet.lat || pet.location.lat, pet.lng || pet.location.lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          url={
            theme === "light"
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          }
        />

        <Marker position={[pet.lat || pet.location.lat, pet.lng || pet.location.lng]}>
          <Popup>
            Ubicación aproximada <br /> de la mascota.
          </Popup>
        </Marker>
      </MapContainer>
}
    </div>

{/*
              <button
                className={`w-full mt-4 px-4 py-2 rounded-lg transition-all border ${
                  theme === 'light'
                    ? 'border-gray-300 text-gray-900 hover:border-gray-900'
                    : 'border-purple-500/30 text-white hover:border-purple-500'
                }`}
              >
                Ver en Mapa Grande
              </button>
*/}
            </div>

            {/* Safety Tips */}
            <div className={`${cardBgClass} rounded-2xl shadow-xl p-6`}>
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className={`w-5 h-5 mt-1 ${
                  theme === 'light' ? 'text-orange-600' : 'text-orange-400'
                }`} />
                <div>
                  <h3 className={`mb-2 ${textClass}`}>Consejos de Seguridad</h3>
                  <ul className={`text-sm space-y-2 ${textSecondaryClass}`}>
                    <li>• Reúnete en lugares públicos</li>
                    <li>• Verifica la identidad cuidadosamente</li>
                    <li>• No compartas información personal sensible</li>
                    <li>• Lleva a alguien contigo si es posible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
