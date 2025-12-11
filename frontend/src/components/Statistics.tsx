import { TrendingUp, Users, Zap, Heart, Target, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Statistics() {
  const { theme } = useTheme();

  const stats = [
    { 
      icon: Heart, 
      value: '1,247', 
      label: 'Mascotas Reunidas',
      trend: '+23% este mes',
      color: 'from-pink-500 to-rose-500'
    },
    { 
      icon: Zap, 
      value: '89%', 
      label: 'Precisión IA',
      trend: 'Análisis en tiempo real',
      color: 'from-purple-500 to-indigo-500'
    },
    { 
      icon: Users, 
      value: '3,456', 
      label: 'Usuarios Activos',
      trend: '+156 hoy',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Target, 
      value: '94%', 
      label: 'Tasa de Éxito',
      trend: 'En primeras 48h',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: Clock, 
      value: '24/7', 
      label: 'Monitoreo Activo',
      trend: 'Sistema automático',
      color: 'from-orange-500 to-amber-500'
    },
    { 
      icon: TrendingUp, 
      value: '2.3h', 
      label: 'Tiempo Promedio',
      trend: 'Primera coincidencia',
      color: 'from-red-500 to-pink-500'
    },
  ];

  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900/50 backdrop-blur-xl border border-purple-500/20';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondaryClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className={`${bgClass} rounded-2xl shadow-xl p-8 transition-all duration-300`}>
          <div className="text-center mb-12">
            <h2 className={`text-3xl mb-3 ${textClass}`}>Estadísticas en Tiempo Real</h2>
            <p className={textSecondaryClass}>Nuestra IA trabaja 24/7 para reunir familias</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 ${
                    theme === 'light'
                      ? 'bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg'
                      : 'bg-gray-800/50 hover:bg-gray-800 border border-purple-500/10 hover:border-purple-500/30'
                  }`}
                >
                  {theme === 'dark' && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  )}
                  
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br ${stat.color} ${
                    theme === 'dark' ? 'shadow-lg' : ''
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <p className={`text-2xl mb-1 ${textClass}`}>{stat.value}</p>
                  <p className={`text-sm mb-2 ${textSecondaryClass}`}>{stat.label}</p>
                  <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-purple-400'}`}>
                    {stat.trend}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
