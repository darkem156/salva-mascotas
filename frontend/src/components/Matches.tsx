import { Sparkles, MessageCircle, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { Match, Pet } from '../types';
import { on } from 'events';
import { API_URL } from '../config';

interface MatchesProps {
  matches: Match[];
  onOpenChat: (match: Match) => void;
  onViewPetDetail: (pet: Pet) => void;
}

export function Matches({ matches, onOpenChat, onViewPetDetail }: MatchesProps) {
  const { theme } = useTheme();
  const [pastMatches, setPastMatches] = useState<Match[]>([]);
  
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900/50 backdrop-blur-xl border border-purple-500/20';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondaryClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const cardBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/50 border border-purple-500/10';

  async function getPastMatches() {
    try {
      const response = await fetch(`${API_URL}/api/matches/validated`, {
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        setPastMatches(data);
      } else {
        console.error('Error fetching past matches');
      }
    } catch (error) {
      console.error('Error fetching past matches:', error);
    }
  }
  useEffect(() => {
    getPastMatches();
  }, []);

  const onConfirmMatch = async (matchId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/matches/${matchId}/confirm`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('La coincidencia ha sido marcada como válida.');
        location.reload();
      } else {
        alert('Error al confirmar la coincidencia.');
      }
    } catch (error) {
      console.error('Error confirming match:', error);
      alert('Error al confirmar la coincidencia.');
    }
  }

  const onDeleteMatch = async (matchId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/matches/${matchId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('La coincidencia ha sido eliminada.');
        location.reload();
      } else {
        alert('Error al eliminar la coincidencia.');
      }
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('Error al eliminar la coincidencia.');
    }
  }

  function pastMatchesComponent() {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-12">
        <h2 className={`text-2xl mb-4 ${textClass}`}>Coincidencias Validadas</h2>
        <div className="space-y-6">
          {pastMatches.map((match: Match) => (
            <div key={match.id} className={`${bgClass} rounded-2xl shadow-xl overflow-hidden transition-all duration-300`}>
              <div className={`p-4 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100'
                  : 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-b border-purple-500/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      theme === 'light' ? 'bg-white' : 'bg-gray-800'
                    }`}>
                      <Sparkles className={`w-5 h-5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                    </div>
                    <div>
                      <p className={`text-sm ${textSecondaryClass}`}>Coincidencia de IA</p>
                      <p className={`text-2xl ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>
                        {match.score * 100}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm ${textSecondaryClass}`}>
                      {new Date(match.found_pets.found_date).toLocaleDateString('es-MX')}
                    </p>
                    <p className={`text-xs ${textSecondaryClass}`}>
                      {new Date(match.found_pets.found_date).toLocaleTimeString('es-MX')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Lost Pet */}
                  <div onClick={() => onViewPetDetail(match.lost_pets)} className={`cursor-pointer rounded-xl p-4 border-2 ${
                    theme === 'light' ? 'border-orange-200' : 'border-orange-500/30 bg-gray-800/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        theme === 'light'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        Mascota Perdida
                      </div>
                    </div>
                    <img
                      src={match.lost_pets.photo_url}
                      alt={match.lost_pets.name}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h3 className={`text-xl mb-2 ${textClass}`}>{match.lost_pets.name}</h3>
                  </div>

                  {/* Found Pet */}
                  <div onClick={() => onViewPetDetail(match.found_pets)} className={`cursor-pointer rounded-xl p-4 border-2 ${
                    theme === 'light' ? 'border-green-200' : 'border-green-500/30 bg-gray-800/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        theme === 'light'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        Mascota Encontrada
                      </div>
                    </div>
                    <img
                      src={match.found_pets.photo_url}
                      alt="Mascota encontrada"
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                    <h3 className={`text-xl mb-2 ${textClass}`}>Mascota sin identificar</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`${bgClass} rounded-2xl shadow-xl p-12 text-center transition-all duration-300`}>
          <Sparkles className={`w-16 h-16 mx-auto mb-4 ${theme === 'light' ? 'text-purple-400' : 'text-purple-500'}`} />
          <h2 className={`text-2xl mb-2 ${textClass}`}>Sistema de IA Activo</h2>
          <p className={textSecondaryClass}>
            Cuando reportes una mascota, la IA analizará automáticamente:
          </p>
          <ul className={`mt-4 space-y-2 inline-block text-left ${textClass}`}>
            <li>✨ Patrones de manchas y pelaje</li>
            <li>👁️ Color y forma de ojos</li>
            <li>👂 Forma de orejas</li>
            <li>🎨 Distribución de colores</li>
            <li>📏 Proporciones faciales</li>
          </ul>
          <p className={`mt-6 text-sm ${textSecondaryClass}`}>
            Las coincidencias aparecerán aquí automáticamente
          </p>
        </div>
      </div>
      {pastMatches.length > 0 && pastMatchesComponent()}
      </>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className={`rounded-2xl shadow-xl p-6 mb-6 text-white transition-all duration-300 ${
        theme === 'light'
          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
          : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 shadow-purple-500/50'
      }`}>
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8" />
          <div>
            <h2 className="text-2xl">Coincidencias encontradas por IA</h2>
            <p className="text-white/90 text-sm">{matches.length} posibles coincidencias detectadas</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {matches.map((match: Match) => (
          <div key={match.id} className={`${bgClass} rounded-2xl shadow-xl overflow-hidden transition-all duration-300`}>
            <div className={`p-4 ${
              theme === 'light'
                ? 'bg-gradient-to-r from-purple-100 to-pink-100'
                : 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-b border-purple-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    theme === 'light' ? 'bg-white' : 'bg-gray-800'
                  }`}>
                    <Sparkles className={`w-5 h-5 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
                  </div>
                  <div>
                    <p className={`text-sm ${textSecondaryClass}`}>Coincidencia de IA</p>
                    <p className={`text-2xl ${theme === 'light' ? 'text-purple-700' : 'text-purple-400'}`}>
                      {match.score * 100}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${textSecondaryClass}`}>
                    {new Date(match.found_pets.found_date).toLocaleDateString('es-MX')}
                  </p>
                  <p className={`text-xs ${textSecondaryClass}`}>
                    {new Date(match.found_pets.found_date).toLocaleTimeString('es-MX')}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Lost Pet */}
                <div onClick={() => onViewPetDetail({...match.lost_pets, status: 'lost'})} className={`cursor-pointer rounded-xl p-4 border-2 ${
                  theme === 'light' ? 'border-orange-200' : 'border-orange-500/30 bg-gray-800/30'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'light'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      Mascota Perdida
                    </div>
                  </div>
                  <img
                    src={match.lost_pets.photo_url}
                    alt={match.lost_pets.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className={`text-xl mb-2 ${textClass}`}>{match.lost_pets.name}</h3>
                  <div className={`space-y-1 text-sm ${textSecondaryClass}`}>
                    <p>🐕 {match.lost_pets.breed}</p>
                    <p>🎨 {match.lost_pets.color}</p>
                    <p>📏 {match.lost_pets.size}</p>
                    <p>📍 Cerca de {match.lost_pets.lat}, {match.lost_pets.lng}</p>
                    <p>👤 {match.lost_pets.ownerName}</p>
                  </div>
                </div>

                {/* Found Pet */}
                <div onClick={() => onViewPetDetail({...match.found_pets})} className={`cursor-pointer rounded-xl p-4 border-2 ${
                  theme === 'light' ? 'border-green-200' : 'border-green-500/30 bg-gray-800/30'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'light'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      Mascota Encontrada
                    </div>
                  </div>
                  <img
                    src={match.found_pets.photo_url}
                    alt="Mascota encontrada"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className={`text-xl mb-2 ${textClass}`}>Mascota sin identificar</h3>
                  <div className={`space-y-1 text-sm ${textSecondaryClass}`}>
                    <p>🐕 {match.found_pets.breed || 'Desconocido'}</p>
                    <p>🎨 {match.found_pets.color}</p>
                    <p>📏 {match.found_pets.size}</p>
                    <p>📍 Cerca de {match.found_pets.lat}, {match.found_pets.lng}</p>
                    <p>👤 {match.found_pets.reporterName}</p>
                  </div>
                </div>
              </div>
              {/* Botones para marcar como valido y otro para borrar */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => onConfirmMatch(match.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    theme === 'light'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  Marcar como válido
                </button>
                <button
                  onClick={() => onDeleteMatch(match.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    theme === 'light'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  Borrar
                </button>
              </div>

              {/* Matched Features */}
              <div className={`hidden rounded-xl p-4 mb-4 ${
                theme === 'light' ? 'bg-purple-50' : 'bg-purple-500/10 border border-purple-500/20'
              }`}>
                <p className={`text-sm mb-2 ${textClass}`}>Características coincidentes:</p>
                <div className="flex flex-wrap gap-2">
                  {match.matchedFeatures?.map((feature, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                        theme === 'light'
                          ? 'bg-white border border-purple-200 text-purple-700'
                          : 'bg-purple-500/20 border border-purple-500/30 text-purple-400'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenChat(match)}
                className={`hidden w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  theme === 'light'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-xl hover:shadow-purple-500/50'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Abrir Chat Seguro
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}