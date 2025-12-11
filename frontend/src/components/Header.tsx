import { Heart, PawPrint, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: 'home' | 'report-lost' | 'report-found' | 'matches' | 'map' | 'how-it-works') => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'how-it-works', label: 'Cómo Funciona' },
    { id: 'report-lost', label: 'Reportar Perdido' },
    { id: 'report-found', label: 'Reportar Encontrado' },
    { id: 'matches', label: 'Coincidencias IA' },
    //{ id: 'map', label: 'Mapa' },
  ];

  const bgClass = theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-purple-500/20';
  const topBarClass = theme === 'light' ? 'bg-gray-900' : 'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondaryClass = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const hoverClass = theme === 'light' ? 'hover:text-gray-900' : 'hover:text-purple-400';

  return (
    <header className={`${bgClass} border-b transition-all duration-300`}>
      {/* Top bar */}
      <div className={`${topBarClass} text-white py-2`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <span>📞 Línea de emergencia: 55-PELUDITO</span>
            <span className="hidden md:inline">✉️ ayuda@dondeestaspeludito.com</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="hover:opacity-80 transition-opacity flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Modo Noche</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Modo Claro</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <button 
            onClick={() => onTabChange('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                theme === 'light' 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
                  : 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 shadow-lg shadow-purple-500/50'
              }`}>
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              {theme === 'dark' && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 blur-md opacity-50 animate-pulse" />
              )}
            </div>
            <div className="text-left">
              <h1 className={`text-xl tracking-wider ${textClass}`}>DONDE ESTAS PELUDITO</h1>
              <p className={`text-xs ${textSecondaryClass}`}>Reuniendo familias con IA</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id as any)}
                className={`text-sm transition-all relative py-2 ${
                  activeTab === item.id
                    ? theme === 'light'
                      ? 'text-gray-900'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400'
                    : `${textSecondaryClass} ${hoverClass}`
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    theme === 'light'
                      ? 'bg-gray-900'
                      : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500'
                  }`} />
                )}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onTabChange('report-lost')}
              className={`hidden md:block px-6 py-2 rounded-full transition-all ${
                theme === 'light'
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
              } text-sm`}
            >
              Reportar Ahora
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 overflow-x-auto">
        <div className="flex gap-2 px-4 py-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as any)}
              className={`text-sm whitespace-nowrap px-4 py-2 rounded-full transition-all ${
                activeTab === item.id
                  ? theme === 'light'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                  : theme === 'light'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-gray-800 text-gray-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}