import { useState, useEffect } from 'react';
import { X, MapPin, Camera, Loader, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Pet } from '../types';

interface EditPetModalProps {
  pet: Pet;
  onClose: () => void;
  onSave: (updatedPet: Pet) => void;
}

export function EditPetModal({ pet, onClose, onSave }: EditPetModalProps) {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: pet.name,
    breed: pet.breed,
    size: pet.size,
    color: pet.color,
    description: pet.description,
    location: pet.location.address,
    phone: pet.phone || '',
    ownerName: pet.ownerName || '',
    reporterName: pet.reporterName || '',
    photo: pet.photo_url,
  });
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(pet.photo);

  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondaryClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const inputBgClass = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const inputBorderClass = theme === 'light' ? 'border-gray-300' : 'border-purple-500/30';
  const labelClass = theme === 'light' ? 'text-gray-700' : 'text-gray-300';

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setFormData({ ...formData, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    setLoadingLocation(true);
    setUseCurrentLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Simulate reverse geocoding
        const mockAddress = `Calle ${Math.floor(Math.random() * 100)}, Col. Centro, Ciudad de México`;
        setFormData({ ...formData, location: mockAddress });
        setLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('No se pudo obtener la ubicación. Por favor ingresa la dirección manualmente.');
        setLoadingLocation(false);
        setUseCurrentLocation(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.breed || !formData.location || !formData.description) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const updatedPet: Pet = {
      ...pet,
      name: formData.name,
      breed: formData.breed,
      size: formData.size,
      color: formData.color,
      description: formData.description,
      location: {
        address: formData.location,
        lat: pet.location.lat,
        lng: pet.location.lng,
      },
      phone: formData.phone,
      photo: formData.photo,
      ownerName: pet.status === 'lost' ? formData.ownerName : undefined,
      reporterName: pet.status === 'found' ? formData.reporterName : undefined,
    };

    onSave(updatedPet);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${bgClass} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
        {/* Header */}
        <div className={`sticky top-0 ${bgClass} border-b ${inputBorderClass} p-6 flex items-center justify-between z-10`}>
          <h2 className={`text-2xl ${textClass}`}>Editar Publicación</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-all ${
              theme === 'light'
                ? 'hover:bg-gray-100 text-gray-600'
                : 'hover:bg-gray-800 text-gray-400'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo */}
          <div>
            <label className={`block mb-2 ${labelClass}`}>
              Foto de la Mascota
            </label>
            <div className="flex items-start gap-4">
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <label
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
                    theme === 'light'
                      ? 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                      : 'border-purple-500/30 hover:border-purple-500 hover:bg-purple-500/10'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span className={textClass}>Cambiar Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                <p className={`text-sm mt-2 ${textSecondaryClass}`}>
                  Sube una foto clara de la mascota
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className={`block mb-2 ${labelClass}`}>
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${inputBorderClass} ${inputBgClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              required
            />
          </div>

          {/* Breed */}
          <div>
            <label htmlFor="breed" className={`block mb-2 ${labelClass}`}>
              Raza <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="breed"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border ${inputBorderClass} ${inputBgClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              required
            />
          </div>

          {/* Size and Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="size" className={`block mb-2 ${labelClass}`}>
                Tamaño <span className="text-red-500">*</span>
              </label>
              <select
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${inputBorderClass} ${inputBgClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              >
                <option value="pequeño">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </div>

            <div>
              <label htmlFor="color" className={`block mb-2 ${labelClass}`}>
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${inputBorderClass} ${inputBgClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={`block mb-2 ${labelClass}`}>
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border ${inputBorderClass} ${inputBgClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              required
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className={`block mb-2 ${labelClass}`}>
              Ubicación <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`flex-1 px-4 py-3 rounded-lg border ${inputBorderClass} ${inputBgClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Calle, colonia, ciudad"
                required
                disabled={loadingLocation}
              />
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={loadingLocation}
                className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                } disabled:opacity-50`}
              >
                {loadingLocation ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : useCurrentLocation ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactName" className={`block mb-2 ${labelClass}`}>
                {pet.status === 'lost' ? 'Nombre del Dueño' : 'Nombre de Quien Reporta'}
              </label>
              <input
                type="text"
                id="contactName"
                value={pet.status === 'lost' ? formData.ownerName : formData.reporterName}
                onChange={(e) => 
                  setFormData({ 
                    ...formData, 
                    ...(pet.status === 'lost' 
                      ? { ownerName: e.target.value } 
                      : { reporterName: e.target.value })
                  })
                }
                className={`w-full px-4 py-3 rounded-lg border ${inputBorderClass} ${inputBgClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>

            <div>
              <label htmlFor="phone" className={`block mb-2 ${labelClass}`}>
                Teléfono
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${inputBorderClass} ${inputBgClass} ${textClass} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="55 1234 5678"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-lg border transition-all ${
                theme === 'light'
                  ? 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  : 'border-purple-500/30 text-white hover:bg-gray-800'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 rounded-lg transition-all ${
                theme === 'light'
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
              }`}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
