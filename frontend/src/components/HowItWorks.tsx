import { Camera, Sparkles, MessageCircle, MapPin, Bell, CheckCircle, Upload, Search, Users, Heart, Shield, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HowItWorksProps {
  onReportLost?: () => void;
  onReportFound?: () => void;
}

export function HowItWorks({ onReportLost, onReportFound }: HowItWorksProps) {
  const { theme } = useTheme();

  const steps = [
    {
      number: '01',
      icon: Upload,
      title: 'Sube una Foto',
      description: 'Toma o sube una foto clara de tu mascota perdida o encontrada. Entre más visible sean las características, mejor.',
      details: ['Foto de frente preferiblemente', 'Buena iluminación', 'Enfoque en rasgos únicos'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      number: '02',
      icon: Camera,
      title: 'Completa el Reporte',
      description: 'Proporciona información como raza, tamaño, color, ubicación y cualquier detalle distintivo de tu mascota.',
      details: ['Nombre de la mascota', 'Última ubicación vista', 'Características especiales'],
      color: 'from-purple-500 to-pink-500',
    },
    {
      number: '03',
      icon: Sparkles,
      title: 'IA Analiza Características',
      description: 'Nuestro sistema de inteligencia artificial analiza patrones únicos: manchas, color de ojos, forma de orejas y más.',
      details: ['Análisis de patrones de pelaje', 'Reconocimiento facial', 'Comparación con base de datos'],
      color: 'from-orange-500 to-red-500',
    },
    {
      number: '04',
      icon: Bell,
      title: 'Recibe Coincidencias',
      description: 'Si la IA encuentra una coincidencia, te notificamos inmediatamente con el porcentaje de similitud.',
      details: ['Notificaciones en tiempo real', 'Alertas push', 'Coincidencias del 70% o más'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      number: '05',
      icon: MessageCircle,
      title: 'Conecta de Forma Segura',
      description: 'Abre un chat seguro con la persona que reportó la coincidencia para coordinar el reencuentro.',
      details: ['Chat privado y seguro', 'Intercambio de información', 'Coordinación de reunión'],
      color: 'from-pink-500 to-rose-500',
    },
    {
      number: '06',
      icon: Heart,
      title: '¡Reencuentro Exitoso!',
      description: 'Coordina el lugar y hora para reunirte con tu mascota. ¡Comparte tu historia de éxito con la comunidad!',
      details: ['Verifica la identidad', 'Lugar seguro y público', 'Comparte tu experiencia'],
      color: 'from-purple-500 to-indigo-500',
    },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'IA Avanzada',
      description: 'Algoritmos de reconocimiento visual que identifican patrones únicos en mascotas.',
      color: 'purple',
    },
    {
      icon: MapPin,
      title: 'Búsqueda Geolocalizada',
      description: 'Filtra reportes por ubicación y recibe alertas de mascotas cerca de ti.',
      color: 'blue',
    },
    {
      icon: Shield,
      title: 'Seguridad Garantizada',
      description: 'Chat encriptado y protección de datos personales en todo momento.',
      color: 'green',
    },
    {
      icon: Zap,
      title: 'Respuesta Rápida',
      description: 'Sistema automático que trabaja 24/7 analizando y comparando reportes.',
      color: 'orange',
    },
    {
      icon: Users,
      title: 'Comunidad Activa',
      description: 'Miles de usuarios ayudando a reunir familias con sus mascotas.',
      color: 'pink',
    },
    {
      icon: CheckCircle,
      title: '89% de Éxito',
      description: 'Alta tasa de mascotas reunidas gracias a nuestra tecnología de IA.',
      color: 'emerald',
    },
  ];

  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900/50 backdrop-blur-xl border border-purple-500/20';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondaryClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';
  const cardBgClass = theme === 'light' ? 'bg-gradient-to-br from-gray-50 to-gray-100' : 'bg-gray-800/50 border border-purple-500/10';

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <div className={`inline-block px-6 py-2 rounded-full mb-4 ${
          theme === 'light'
            ? 'bg-gray-900 text-white'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
        }`}>
          ¿CÓMO FUNCIONA?
        </div>
        <h1 className={`text-5xl mb-4 ${textClass}`}>
          Reunimos Familias con{' '}
          <span className={theme === 'light' 
            ? 'text-gray-900' 
            : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400'
          }>
            Inteligencia Artificial
          </span>
        </h1>
        <p className={`text-xl max-w-3xl mx-auto ${textSecondaryClass}`}>
          Nuestro sistema utiliza tecnología de vanguardia para analizar características únicas 
          de cada mascota y encontrar coincidencias en tiempo real.
        </p>
      </div>

      {/* Steps */}
      <div className={`${bgClass} rounded-2xl shadow-xl p-8 mb-16 transition-all duration-300`}>
        <h2 className={`text-3xl mb-8 text-center ${textClass}`}>Proceso Paso a Paso</h2>
        <div className="space-y-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className={`${cardBgClass} rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                  theme === 'dark' ? 'hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10' : 'hover:shadow-lg'
                }`}
              >
                <div className="flex gap-6 items-start">
                  {/* Number */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${step.color} text-white text-xl ${
                    theme === 'dark' ? 'shadow-lg' : ''
                  }`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${step.color} ${
                    theme === 'dark' ? 'shadow-lg shadow-purple-500/30' : ''
                  }`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`text-2xl mb-2 ${textClass}`}>{step.title}</h3>
                    <p className={`mb-4 ${textSecondaryClass}`}>{step.description}</p>
                    <ul className="space-y-2">
                      {step.details.map((detail, detailIdx) => (
                        <li key={detailIdx} className={`flex items-center gap-2 text-sm ${textSecondaryClass}`}>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Grid */}
      <div className={`${bgClass} rounded-2xl shadow-xl p-8 mb-16 transition-all duration-300`}>
        <h2 className={`text-3xl mb-8 text-center ${textClass}`}>Características Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const colorMap = {
              purple: 'from-purple-500 to-pink-500',
              blue: 'from-blue-500 to-cyan-500',
              green: 'from-green-500 to-emerald-500',
              orange: 'from-orange-500 to-red-500',
              pink: 'from-pink-500 to-rose-500',
              emerald: 'from-emerald-500 to-teal-500',
            };
            
            return (
              <div 
                key={idx}
                className={`${cardBgClass} rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' ? 'hover:border-purple-500/30' : ''
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br ${colorMap[feature.color as keyof typeof colorMap]} mb-4 ${
                  theme === 'dark' ? 'shadow-lg' : ''
                }`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-xl mb-2 ${textClass}`}>{feature.title}</h3>
                <p className={`text-sm ${textSecondaryClass}`}>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className={`rounded-2xl shadow-xl p-12 text-center transition-all duration-300 ${
        theme === 'light'
          ? 'bg-gradient-to-r from-purple-500 to-pink-500'
          : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 shadow-purple-500/50'
      } text-white`}>
        <h2 className="text-4xl mb-4">¿Perdiste a tu Mascota?</h2>
        <p className="text-xl mb-8 text-white/90">
          Cada segundo cuenta. Reporta ahora y deja que nuestra IA trabaje para ti.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="px-8 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg" onClick={onReportLost}>
            <Upload className="w-5 h-5" />
            Reportar Mascota Perdida
          </button>
          <button className="px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white/10 transition-colors flex items-center gap-2" onClick={onReportFound}>
            <Search className="w-5 h-5" />
            Reportar Mascota Encontrada
          </button>
        </div>
      </div>
    </div>
  );
}