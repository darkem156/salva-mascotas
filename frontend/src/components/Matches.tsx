import { Sparkles, MessageCircle, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Match } from '../types';

interface MatchesProps {
  matches: Match[];
  onOpenChat: (match: Match) => void;
}

export function Matches({ matches, onOpenChat }: MatchesProps) {
  const { theme } = useTheme();
  
  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900/50 backdrop-blur-xl border border-purple-500/20';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondaryClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const cardBgClass = theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/50 border border-purple-500/10';

  if (matches.length === 0) {
    return (
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
        {matches.map((match) => (
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
                      {match.similarity}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${textSecondaryClass}`}>
                    {new Date(match.timestamp).toLocaleDateString('es-MX')}
                  </p>
                  <p className={`text-xs ${textSecondaryClass}`}>
                    {new Date(match.timestamp).toLocaleTimeString('es-MX')}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Lost Pet */}
                <div className={`rounded-xl p-4 border-2 ${
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
                    src={match.lostPet.photo}
                    alt={match.lostPet.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className={`text-xl mb-2 ${textClass}`}>{match.lostPet.name}</h3>
                  <div className={`space-y-1 text-sm ${textSecondaryClass}`}>
                    <p>🐕 {match.lostPet.breed}</p>
                    <p>🎨 {match.lostPet.color}</p>
                    <p>📏 {match.lostPet.size}</p>
                    <p>📍 {match.lostPet.location.address}</p>
                    <p>👤 {match.lostPet.ownerName}</p>
                  </div>
                </div>

                {/* Found Pet */}
                <div className={`rounded-xl p-4 border-2 ${
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
                    src={match.foundPet.photo}
                    alt="Mascota encontrada"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className={`text-xl mb-2 ${textClass}`}>Mascota sin identificar</h3>
                  <div className={`space-y-1 text-sm ${textSecondaryClass}`}>
                    <p>🐕 {match.foundPet.breed || 'Desconocido'}</p>
                    <p>🎨 {match.foundPet.color}</p>
                    <p>📏 {match.foundPet.size}</p>
                    <p>📍 {match.foundPet.location.address}</p>
                    <p>👤 {match.foundPet.reporterName}</p>
                  </div>
                </div>
              </div>

              {/* Matched Features */}
              <div className={`rounded-xl p-4 mb-4 ${
                theme === 'light' ? 'bg-purple-50' : 'bg-purple-500/10 border border-purple-500/20'
              }`}>
                <p className={`text-sm mb-2 ${textClass}`}>Características coincidentes:</p>
                <div className="flex flex-wrap gap-2">
                  {match.matchedFeatures.map((feature, idx) => (
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
                className={`w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
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