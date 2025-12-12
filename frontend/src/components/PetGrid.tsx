import { Heart, MapPin, Clock, MessageCircle, ChevronLeft, ChevronRight, Sparkles, Filter } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Pet, Match } from '../types';
import { useState } from 'react';

interface PetGridProps {
  lostPets: Pet[];
  foundPets: Pet[];
  onOpenChat: (match: Match) => void;
  onViewAllPets?: () => void;
  onViewPetDetail?: (pet: Pet) => void;
}

export function PetGrid({ lostPets, foundPets, onOpenChat, onViewAllPets,   onViewPetDetail }: PetGridProps) {
  const { theme } = useTheme();
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [filterSize, setFilterSize] = useState<string>('all');

  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900/50 backdrop-blur-xl border border-purple-500/20';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondaryClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const cardBgClass = theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800/50 border-purple-500/10';


  let allPets = [...lostPets, ...foundPets];

  // Apply filters
  if (filterType !== 'all') {
    allPets = allPets.filter(pet => pet.status === filterType);
  }
  if (filterSize !== 'all') {
    allPets = allPets.filter(pet => pet.size === filterSize);
  }

  const getTimeAgo = (timestamp: string) => {
    const hours = Math.round((Date.now() - new Date(timestamp).getTime()) / 3600000);
    if (hours < 1) return 'Hace menos de 1 hora';
    if (hours === 1) return 'Hace 1 hora';
    if (hours < 24) return `Hace ${hours} horas`;
    const days = Math.floor(hours / 24);
    return days === 1 ? 'Hace 1 día' : `Hace ${days} días`;
  };

return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className={`${bgClass} rounded-2xl shadow-xl p-8 transition-all duration-300`}>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className={`text-4xl mb-2 ${textClass}`}>Mascotas Buscando Hogar</h2>
              <p className={textSecondaryClass}>
                Reportes recientes de mascotas perdidas y encontradas en tu zona
              </p>
            </div>
            <div className="flex gap-2">
              <button className={`p-2 border rounded-full transition-all ${
                theme === 'light'
                  ? 'border-gray-300 hover:border-gray-900'
                  : 'border-purple-500/30 hover:border-purple-500'
              }`}>
                <ChevronLeft className={`w-5 h-5 ${textClass}`} />
              </button>
              <button className={`p-2 border rounded-full transition-all ${
                theme === 'light'
                  ? 'border-gray-300 hover:border-gray-900'
                  : 'border-purple-500/30 hover:border-purple-500'
              }`}>
                <ChevronRight className={`w-5 h-5 ${textClass}`} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-8 flex-wrap">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-full transition-all ${
                filterType === 'all'
                  ? theme === 'light'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : theme === 'light'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-800 text-gray-400'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('lost')}
              className={`px-4 py-2 rounded-full transition-all ${
                filterType === 'lost'
                  ? theme === 'light'
                    ? 'bg-red-600 text-white'
                    : 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/50'
                  : theme === 'light'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-800 text-gray-400'
              }`}
            >
              Perdidos
            </button>
            <button
              onClick={() => setFilterType('found')}
              className={`px-4 py-2 rounded-full transition-all ${
                filterType === 'found'
                  ? theme === 'light'
                    ? 'bg-green-600 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                  : theme === 'light'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-800 text-gray-400'
              }`}
            >
              Encontrados
            </button>
            
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className={`px-4 py-2 rounded-full transition-all ${
                theme === 'light'
                  ? 'bg-gray-100 text-gray-700 border border-gray-300'
                  : 'bg-gray-800 text-gray-400 border border-purple-500/30'
              }`}
            >
              <option value="all">Todos los tamaños</option>
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>

          {/* Pet Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allPets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => onViewPetDetail?.(pet)}
                className={`${cardBgClass} border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer ${ 
                  theme === 'dark' ? 'hover:border-purple-500/30 hover:shadow-purple-500/20' : ''
                }`}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={pet.photo_url}
                    alt={pet.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Status badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs text-white backdrop-blur-md ${
                    pet.status === 'lost' 
                      ? theme === 'light'
                        ? 'bg-red-600'
                        : 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/50'
                      : theme === 'light'
                        ? 'bg-green-600'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
                  }`}>
                    {pet.status === 'lost' ? 'PERDIDO' : 'ENCONTRADO'}
                  </div>

                  {/* AI Badge if recently added */}
                  {Date.now() - new Date(pet.timestamp).getTime() < 24 * 60 * 60 * 1000 && (
                    <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs flex items-center gap-1 backdrop-blur-md ${
                      theme === 'light'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                    }`}>
                      <Sparkles className="w-3 h-3" />
                      IA Activa
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className={`text-xl mb-2 ${textClass}`}>{pet.name}</h3>
                  <p className={`text-sm mb-3 ${textSecondaryClass}`}>{pet.breed}</p>
                  
                  <div className={`space-y-2 mb-4 text-sm ${textSecondaryClass}`}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{pet.location?.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeAgo(pet.timestamp)}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div>
                      <p className={textSecondaryClass}>Tamaño</p>
                      <p className={`${textClass} capitalize`}>{pet.size}</p>
                    </div>
                    <div>
                      <p className={textSecondaryClass}>Color</p>
                      <p className={textClass}>{pet.color}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {/*
          <div className="text-center mt-12">
            <button
              className={`border-2 px-8 py-3 rounded-full transition-all ${
                theme === 'light'
                  ? 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900'
                  : 'border-purple-500/30 text-purple-400 hover:border-purple-500 hover:text-purple-300'
              }`}
              onClick={onViewAllPets}
            >
              Ver Más Mascotas
            </button>
          </div>
*/}
        </div>
      </div>
    </section>
  );
}