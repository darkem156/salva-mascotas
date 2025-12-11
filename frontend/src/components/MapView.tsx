import { useState, useEffect } from 'react';
import { MapPin, Search, Filter, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { API_URL } from '../config';
import { Pet } from '../types';

interface MapViewProps {
  lostPets: Pet[];
  foundPets: Pet[];
}

export function MapView({ lostPets, foundPets }: MapViewProps) {
  const { theme } = useTheme();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [filters, setFilters] = useState({
    breed: '',
    size: '',
    color: '',
    radius: 5,
    showLost: true,
    showFound: true,
  });


const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
const [backendLostPets, setBackendLostPets] = useState<Pet[]>([]);
const [backendFoundPets, setBackendFoundPets] = useState<Pet[]>([]);

useEffect(() => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    },
    (err) => {
      console.error('No se pudo obtener ubicación para el mapa:', err);
    }
  );
}, []);

useEffect(() => {
  if (!userLocation) return;

  const fetchNearbyPets = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/pets/near?lat=${userLocation.lat}&lng=${userLocation.lng}&radiusKm=${filters.radius}`
      );
      if (!res.ok) {
        console.error('Error al cargar mascotas cercanas');
        return;
      }
      const data = await res.json();

      const mapToPet = (p: any, status: 'lost' | 'found'): Pet => ({
        id: p.id,
        name: p.name || (status === 'lost' ? 'Mascota perdida' : 'Mascota encontrada'),
        photo:
          p.photo_url ||
          'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
        breed: p.breed || '',
        size: (p.size as any) || 'mediano',
        color: p.color || '',
        location: {
          address: p.address || 'Cerca de ti',
          lat: p.lat ?? userLocation.lat,
          lng: p.lng ?? userLocation.lng,
        },
        description: p.description || '',
        ownerName: p.ownerName,
        reporterName: p.reporterName,
        phone: p.phone,
        timestamp: p.last_seen_date || p.found_date || new Date().toISOString(),
        status,
      });

      setBackendLostPets((data.lost || []).map((p: any) => mapToPet(p, 'lost')));
      setBackendFoundPets((data.found || []).map((p: any) => mapToPet(p, 'found')));
    } catch (e) {
      console.error('Error al solicitar mascotas cercanas:', e);
    }
  };

  fetchNearbyPets();
}, [userLocation, filters.radius]);

  // Mock data for demonstration
  const mockLostPets: Pet[] = [
    {
      id: 'mock-lost-1',
      name: 'Max',
      photo: 'https://images.unsplash.com/photo-1689185083033-fd8512790d29',
      breed: 'Golden Retriever',
      size: 'grande',
      color: 'Dorado',
      location: { address: 'Col. Roma Norte, CDMX', lat: 19.4186, lng: -99.1599 },
      description: 'Collar rojo, muy amigable',
      ownerName: 'María García',
      phone: '55 1234 5678',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: 'lost',
    },
    {
      id: 'mock-lost-2',
      name: 'Luna',
      photo: 'https://images.unsplash.com/photo-1758385339088-945fe697ca1c',
      breed: 'Gato Siamés',
      size: 'pequeño',
      color: 'Crema y negro',
      location: { address: 'Col. Condesa, CDMX', lat: 19.4102, lng: -99.1716 },
      description: 'Collar con cascabel',
      ownerName: 'Carlos Ruiz',
      phone: '55 2345 6789',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      status: 'lost',
    },
  ];

  const mockFoundPets: Pet[] = [
    {
      id: 'mock-found-1',
      name: 'Desconocido',
      photo: 'https://images.unsplash.com/photo-1685387714439-edef4bd70ef5',
      breed: 'Beagle',
      size: 'mediano',
      color: 'Tricolor',
      location: { address: 'Parque México, CDMX', lat: 19.4119, lng: -99.1695 },
      description: 'Encontrado cerca del lago',
      reporterName: 'Ana López',
      phone: '55 3456 7890',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: 'found',
    },
  ];

  let allLostPets = [...mockLostPets, ...lostPets, ...backendLostPets];
  let allFoundPets = [...mockFoundPets, ...foundPets, ...backendFoundPets];

  // Apply filters
  if (filters.breed) {
    allLostPets = allLostPets.filter(pet => 
      pet.breed.toLowerCase().includes(filters.breed.toLowerCase())
    );
    allFoundPets = allFoundPets.filter(pet => 
      pet.breed.toLowerCase().includes(filters.breed.toLowerCase())
    );
  }
  if (filters.size) {
    allLostPets = allLostPets.filter(pet => pet.size === filters.size);
    allFoundPets = allFoundPets.filter(pet => pet.size === filters.size);
  }
  if (filters.color) {
    allLostPets = allLostPets.filter(pet => 
      pet.color.toLowerCase().includes(filters.color.toLowerCase())
    );
    allFoundPets = allFoundPets.filter(pet => 
      pet.color.toLowerCase().includes(filters.color.toLowerCase())
    );
  }

  const displayedLostPets = filters.showLost ? allLostPets : [];
  const displayedFoundPets = filters.showFound ? allFoundPets : [];

  const getTimeAgo = (timestamp: string) => {
    const hours = Math.round((Date.now() - new Date(timestamp).getTime()) / 3600000);
    if (hours < 1) return 'menos de 1 hora';
    if (hours === 1) return '1 hora';
    if (hours < 24) return `${hours} horas`;
    const days = Math.floor(hours / 24);
    return days === 1 ? '1 día' : `${days} días`;
  };

  const clearFilters = () => {
    setFilters({
      breed: '',
      size: '',
      color: '',
      radius: 5,
      showLost: true,
      showFound: true,
    });
  };

  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900/50 backdrop-blur-xl border border-purple-500/20';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondaryClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className={`${bgClass} rounded-2xl shadow-xl overflow-hidden transition-all duration-300`}>
        {/* Filters */}
        <div className={`p-4 ${
          theme === 'light'
            ? 'bg-gradient-to-r from-blue-500 to-purple-500'
            : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
        } text-white`}>
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-6 h-6" />
            <div className="flex-1">
              <h2 className="text-xl">Mapa en Tiempo Real</h2>
              <p className="text-sm text-white/90">
                {displayedLostPets.length} perdidos • {displayedFoundPets.length} encontrados
              </p>
            </div>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Buscar por raza..."
              value={filters.breed}
              onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
              className="px-4 py-2 rounded-lg text-gray-800"
            />
            <select
              value={filters.size}
              onChange={(e) => setFilters({ ...filters, size: e.target.value })}
              className="px-4 py-2 rounded-lg text-gray-800"
            >
              <option value="">Todos los tamaños</option>
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
            <input
              type="text"
              placeholder="Color..."
              value={filters.color}
              onChange={(e) => setFilters({ ...filters, color: e.target.value })}
              className="px-4 py-2 rounded-lg text-gray-800"
            />
            
            <label className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 cursor-pointer hover:bg-white/30 transition-colors">
              <input
                type="checkbox"
                checked={filters.showLost}
                onChange={(e) => setFilters({ ...filters, showLost: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Perdidos</span>
            </label>
            
            <label className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 cursor-pointer hover:bg-white/30 transition-colors">
              <input
                type="checkbox"
                checked={filters.showFound}
                onChange={(e) => setFilters({ ...filters, showFound: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Encontrados</span>
            </label>
          </div>
          
          <div className="mt-3">
            <label className="text-sm mb-2 block">Radio de búsqueda: {filters.radius}km</label>
            <input
              type="range"
              min="1"
              max="20"
              value={filters.radius}
              onChange={(e) => setFilters({ ...filters, radius: Number(e.target.value) })}
              className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Map Visualization */}
        <div className={`relative h-96 ${
          theme === 'light'
            ? 'bg-gradient-to-br from-blue-50 to-purple-50'
            : 'bg-gradient-to-br from-gray-900 to-purple-900/30'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className={`w-16 h-16 mx-auto mb-2 ${
                theme === 'light' ? 'text-blue-400' : 'text-purple-400'
              }`} />
              <p className={textSecondaryClass}>Mapa Interactivo</p>
              <p className={`text-sm ${textSecondaryClass}`}>(Visualización simulada)</p>
            </div>
          </div>

          {/* Simulated markers for lost pets */}
          {displayedLostPets.map((pet, idx) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPet(pet)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform animate-bounce"
              style={{
                left: `${30 + idx * 15}%`,
                top: `${40 + idx * 10}%`,
                animationDelay: `${idx * 0.2}s`,
              }}
            >
              <div className="relative">
                <MapPin className={`w-8 h-8 fill-orange-500 drop-shadow-lg ${
                  theme === 'light' ? 'text-orange-500' : 'text-orange-400'
                }`} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
              </div>
            </button>
          ))}

          {/* Simulated markers for found pets */}
          {displayedFoundPets.map((pet, idx) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPet(pet)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
              style={{
                left: `${50 + idx * 15}%`,
                top: `${30 + idx * 15}%`,
              }}
            >
              <MapPin className={`w-8 h-8 fill-green-500 drop-shadow-lg ${
                theme === 'light' ? 'text-green-500' : 'text-green-400'
              }`} />
            </button>
          ))}
        </div>

        {/* Selected Pet Info */}
        {selectedPet && (
          <div className={`p-4 border-t-2 ${
            theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800/50 border-purple-500/20'
          }`}>
            <div className="flex gap-4">
              <img
                src={selectedPet.photo}
                alt={selectedPet.name}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`text-lg ${textClass}`}>{selectedPet.name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedPet.status === 'lost'
                        ? theme === 'light'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : theme === 'light'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}
                  >
                    {selectedPet.status === 'lost' ? 'Perdido' : 'Encontrado'}
                  </span>
                </div>
                <p className={`text-sm mb-1 ${textSecondaryClass}`}>
                  🐕 {selectedPet.breed} • 📏 {selectedPet.size} • 🎨 {selectedPet.color}
                </p>
                <p className={`text-sm mb-2 ${textSecondaryClass}`}>📍 {selectedPet.location.address}</p>
                <p className={`text-xs ${textSecondaryClass}`}>
                  Reportado hace {getTimeAgo(selectedPet.timestamp)}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button className={`px-4 py-2 rounded-lg transition-all text-sm ${
                  theme === 'light'
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                }`}>
                  Ver Detalles
                </button>
                <button 
                  onClick={() => setSelectedPet(null)}
                  className={`px-4 py-2 border rounded-lg transition-colors text-sm ${
                    theme === 'light'
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      : 'border-purple-500/30 text-purple-400 hover:bg-gray-800'
                  }`}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className={`p-4 border-t flex items-center justify-between ${
          theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-gray-800/30 border-purple-500/20'
        }`}>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span className={textClass}>Mascota Perdida ({displayedLostPets.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500 fill-green-500" />
              <span className={textClass}>Mascota Encontrada ({displayedFoundPets.length})</span>
            </div>
          </div>
          <p className={`text-sm ${textSecondaryClass}`}>
            Radio de búsqueda: {filters.radius}km
          </p>
        </div>
      </div>
    </div>
  );
}