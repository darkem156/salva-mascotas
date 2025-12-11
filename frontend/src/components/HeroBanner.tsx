import { ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeroBannerProps {
  onReportLost: () => void;
  onHowItWorks: () => void;
}

export function HeroBanner({ onReportLost, onHowItWorks }: HeroBannerProps) {
  const { theme } = useTheme();
  
  const bgClass = theme === 'light' 
    ? 'bg-gradient-to-r from-gray-100 to-gray-200' 
    : 'bg-gradient-to-r from-gray-900 via-purple-900/30 to-gray-900';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondaryClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const badgeBgClass = theme === 'light' 
    ? 'bg-gray-900 text-white' 
    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50';

  return (
    <div className={`relative ${bgClass} overflow-hidden transition-all duration-500`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[500px]">
          {/* Left Content */}
          <div className="px-4 lg:px-8 py-12 lg:py-0 relative z-10">
            <div className={`inline-block px-4 py-2 ${badgeBgClass} rounded-full text-sm mb-4`}>
              BIENVENIDO A DONDE ESTAS PELUDITO
            </div>
            <h1 className={`text-5xl lg:text-6xl mb-4 leading-tight ${textClass}`}>
              Te ayudamos a <br />
              <span className={theme === 'light' 
                ? 'text-gray-900' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400'
              }>
                encontrar a tu mascota
              </span>
            </h1>
            <p className={`text-lg mb-8 leading-relaxed ${textSecondaryClass}`}>
              Utilizamos inteligencia artificial para analizar características únicas de tu mascota: 
              patrones de pelaje, color de ojos, manchas y más. Conectamos personas de forma segura.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onReportLost}
                className={`px-8 py-4 rounded-full transition-all flex items-center gap-2 ${
                  theme === 'light'
                    ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:shadow-xl hover:shadow-purple-500/50'
                }`}
              >
                Reportar Ahora
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onHowItWorks}
                className={`border-2 px-8 py-4 rounded-full transition-all flex items-center gap-2 ${
                  theme === 'light'
                    ? 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900'
                    : 'border-purple-500/50 text-purple-400 hover:border-purple-400 hover:text-purple-300'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                Ver Cómo Funciona
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-300 dark:border-purple-500/20">
              <div>
                <p className={`text-3xl mb-1 ${textClass}`}>1,247</p>
                <p className={`text-sm ${textSecondaryClass}`}>Mascotas Reunidas</p>
              </div>
              <div>
                <p className={`text-3xl mb-1 ${textClass}`}>89%</p>
                <p className={`text-sm ${textSecondaryClass}`}>Tasa de Éxito IA</p>
              </div>
              <div>
                <p className={`text-3xl mb-1 ${textClass}`}>24/7</p>
                <p className={`text-sm ${textSecondaryClass}`}>Análisis Activo</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-full min-h-[500px] lg:min-h-[600px]">
            <img
              src="https://images.unsplash.com/photo-1558788353-f76d92427f16"
              alt="Perro feliz"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${
              theme === 'light'
                ? 'bg-gradient-to-l from-transparent to-gray-200/50'
                : 'bg-gradient-to-l from-transparent via-purple-900/20 to-gray-900/80'
            }`} />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      {theme === 'dark' && (
        <>
          <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-500 rounded-full opacity-20 blur-3xl animate-pulse" />
        </>
      )}
    </div>
  );
}