import { useState } from 'react';
import { Upload, MapPin, CheckCircle } from 'lucide-react';
import { API_URL } from '../config';
import { Pet } from '../types';

interface ReportFoundProps {
  onSubmit: (pet: Pet) => void;
}

export function ReportFound({ onSubmit }: ReportFoundProps) {
  const [formData, setFormData] = useState({
    breed: '',
    size: 'mediano' as 'pequeño' | 'mediano' | 'grande',
    color: '',
    address: '',
    description: '',
    reporterName: '',
    phone: '',
    lat: null as number | null,
    lng: null as number | null,
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setFormData(prev => ({
          ...prev,
          lat,
          lng,
        }));
        
        // Obtener dirección usando reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(res => res.json())
          .then(data => {
            const address = data.display_name || `${lat?.toFixed(4)}, ${lng?.toFixed(4)}`;
            setFormData(prev => ({
              ...prev,
              address: address.split(',').slice(0, 3).join(','),
            }));
          })
          .catch(() => {
            setFormData(prev => ({
              ...prev,
              address: `Lat: ${lat?.toFixed(4)}, Lng: ${lng?.toFixed(4)}`,
            }));
          })
          .finally(() => {
            setGettingLocation(false);
          });
      },
      (error) => {
        setGettingLocation(false);
        let errorMessage = 'No se pudo obtener tu ubicación. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Por favor, permite el acceso a tu ubicación en la configuración del navegador.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'La información de ubicación no está disponible.';
            break;
          case error.TIMEOUT:
            errorMessage += 'La solicitud para obtener tu ubicación ha expirado.';
            break;
          default:
            errorMessage += 'Ocurrió un error desconocido.';
        }
        
        console.error('Error getting location:', error);
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Preparar datos para enviar al servidor
    const formDataToSend = new FormData();
    formDataToSend.append('name', 'Desconocido');
    formDataToSend.append('breed', formData.breed);
    formDataToSend.append('size', formData.size);
    formDataToSend.append('color', formData.color);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('reporterName', formData.reporterName);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('lat', formData.lat?.toString() || '');
    formDataToSend.append('lng', formData.lng?.toString() || '');
    formDataToSend.append('status', 'found');
    
    if (photoFile) {
      formDataToSend.append('photo', photoFile);
    }


    // Enviar al backend real (API Salva-Mascotas)
    let savedPetFromApi: any = null;
    try {
      const response = await fetch(`${API_URL}/api/pets/found`, {
        method: 'POST',
        body: formDataToSend,
      });
      if (!response.ok) {
        console.error('Error del servidor al reportar mascota encontrada');
      } else {
        savedPetFromApi = await response.json();
        console.log('Respuesta del servidor (found):', savedPetFromApi);
        // Lanzar coincidencias IA en el backend (no esperamos la respuesta)
        try {
          if (savedPetFromApi?.id) {
            fetch(`${API_URL}/api/ai/match/${savedPetFromApi.id}`, {
              method: 'POST',
            }).catch((err) => console.error('Error lanzando IA:', err));
          }
        } catch (e) {
          console.error('Error al llamar IA:', e);
        }
      }
    } catch (error) {
      console.error('Error al conectar con el backend (found):', error);
    }

    // TODO: Enviar al servidor cuando esté configurado
    // try {
    //   const response = await fetch('TU_URL_DEL_SERVIDOR/api/report-found', {
    //     method: 'POST',
    //     body: formDataToSend,
    //   });
    //   const data = await response.json();
    //   console.log('Respuesta del servidor:', data);
    // } catch (error) {
    //   console.error('Error al enviar:', error);
    // }

// Por ahora, mostrar en consola para debugging
console.log('Datos a enviar al servidor:', {
  name: 'Desconocido',
  breed: formData.breed,
  size: formData.size,
  color: formData.color,
  address: formData.address,
  description: formData.description,
  reporterName: formData.reporterName,
  phone: formData.phone,
  lat: formData.lat,
  lng: formData.lng,
  photo: photoFile?.name || 'No photo',
});

// Construir el objeto Pet para la UI usando la respuesta del backend si existe
const pet: Pet = {
  id: savedPetFromApi?.id || `found-${Date.now()}`,
  name: savedPetFromApi?.name || 'Desconocido',
  breed: savedPetFromApi?.breed || formData.breed,
  size: (savedPetFromApi?.size as any) || formData.size,
  color: savedPetFromApi?.color || formData.color,
  description: savedPetFromApi?.description || formData.description,
  reporterName: formData.reporterName,
  phone: formData.phone,
  photo: savedPetFromApi?.photo_url || photoPreview || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb',
  location: {
    address: formData.address || 'Cerca de ti',
    lat: savedPetFromApi?.lat ?? formData.lat ?? 19.4326 + (Math.random() - 0.5) * 0.1,
    lng: savedPetFromApi?.lng ?? formData.lng ?? -99.1332 + (Math.random() - 0.5) * 0.1,
  },
  timestamp: savedPetFromApi?.found_date || new Date().toISOString(),
  status: 'found',
};

onSubmit(pet);
    
    // Reset form
    setFormData({
      breed: '',
      size: 'mediano',
      color: '',
      address: '',
      description: '',
      reporterName: '',
      phone: '',
      lat: null,
      lng: null,
    });
    setPhotoPreview(null);
    setPhotoFile(null);
    
    alert('¡Reporte enviado! La IA buscará coincidencias automáticamente.');
    location.reload()
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white px-8 py-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8" />
            <div>
              <h2 className="text-2xl mb-1">Reportar Mascota Encontrada</h2>
              <p className="text-green-100 text-sm">Ayuda a reunir una familia</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-gray-700 mb-3">Foto de la mascota encontrada *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors bg-gray-50">
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="Preview" className="max-h-80 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Cambiar Foto
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="w-16 h-16 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-700 mb-2">Haz clic para subir foto</p>
                    <p className="text-gray-500 text-sm">La IA comparará con mascotas perdidas</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Pet Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Raza aproximada</label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Mestizo, Pastor"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Tamaño *</label>
                <select
                  required
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="pequeño">Pequeño</option>
                  <option value="mediano">Mediano</option>
                  <option value="grande">Grande</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Color(es) *</label>
                <input
                  type="text"
                  required
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Negro con manchas blancas"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Ubicación donde se encontró *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Parque México, Col. Condesa"
              />
              <button
                type="button"
                onClick={handleGetLocation}
                className="mt-2 w-full bg-green-100 text-green-700 py-3 px-4 rounded-md hover:bg-green-200 transition-colors flex items-center justify-center gap-2 border border-green-300"
                disabled={gettingLocation}
              >
                <MapPin className="w-4 h-4" />
                {gettingLocation ? 'Obteniendo ubicación...' : '📌 Usar mi ubicación actual'}
              </button>
              {formData.lat && formData.lng && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Ubicación guardada: {formData.lat?.toFixed(4)}, {formData.lng?.toFixed(4)}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 mb-2">Detalles adicionales *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ej: Collar azul, muy asustado, estaba cerca del mercado..."
              />
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Tu nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="55 1234 5678"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-4 rounded-md hover:bg-green-700 transition-colors shadow-lg"
            >
              Publicar Reporte y Activar IA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}