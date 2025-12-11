import { Heart, Sparkles, Clock, Share2, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

interface SuccessStoriesProps {
  onViewAllStories?: () => void;
}

export function SuccessStories({ onViewAllStories }: SuccessStoriesProps) {
  const { theme } = useTheme();
  const [currentStory, setCurrentStory] = useState(0);
  const [showAllStories, setShowAllStories] = useState(false);

  const stories = [
    {
      id: 1,
      name: 'Rocky',
      photo: 'https://images.unsplash.com/photo-1754272753654-a56d01215e05',
      breed: 'Husky Siberiano',
      story: '¡Reunido después de 3 días gracias a la IA! El sistema detectó el patrón único de sus ojos azules y manchas. Su familia estaba devastada y la app los conectó en menos de 2 horas.',
      timeAgo: 'Hace 2 días',
      similarity: 94,
      location: 'Col. Condesa, CDMX',
      owner: 'María G.',
    },
    {
      id: 2,
      name: 'Bella',
      photo: 'https://images.unsplash.com/photo-1668028741891-13070d3414ad',
      breed: 'Labrador Retriever',
      story: 'Encontrada a 5km de casa. La persona que la encontró subió la foto y la IA hizo match inmediato con el reporte. El chat seguro facilitó el reencuentro.',
      timeAgo: 'Hace 1 semana',
      similarity: 89,
      location: 'Col. Roma Norte, CDMX',
      owner: 'Carlos R.',
    },
    {
      id: 3,
      name: 'Simba',
      photo: 'https://images.unsplash.com/photo-1702337446616-b48157bfc165',
      breed: 'Pastor Alemán',
      story: 'Las notificaciones automáticas fueron clave. Usuarios cercanos recibieron la alerta y lo encontraron en un parque. ¡Gracias a la comunidad!',
      timeAgo: 'Hace 2 semanas',
      similarity: 91,
      location: 'Col. Polanco, CDMX',
      owner: 'Ana L.',
    },
    {
      id: 4,
      name: 'Luna',
      photo: 'https://images.unsplash.com/photo-1758385339088-945fe697ca1c',
      breed: 'Gato Siamés',
      story: 'Perdida por 5 días. Un vecino a 3 calles la encontró y gracias al reconocimiento de patrones únicos, la IA hizo match perfecto. ¡Estamos eternamente agradecidos!',
      timeAgo: 'Hace 3 semanas',
      similarity: 92,
      location: 'Col. Del Valle, CDMX',
      owner: 'Pedro S.',
    },
    {
      id: 5,
      name: 'Max',
      photo: 'https://images.unsplash.com/photo-1689185083033-fd8512790d29',
      breed: 'Golden Retriever',
      story: 'Se escapó durante una tormenta. Alguien lo rescató y subió su foto. El match fue del 96%! Nunca pensé que lo volvería a ver.',
      timeAgo: 'Hace 1 mes',
      similarity: 96,
      location: 'Col. Coyoacán, CDMX',
      owner: 'Laura M.',
    },
    {
      id: 6,
      name: 'Coco',
      photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb',
      breed: 'Chihuahua',
      story: 'Pequeño pero valiente. Se perdió en el parque y una familia lo cuidó. La IA identificó sus manchas únicas y nos reunió en horas.',
      timeAgo: 'Hace 1 mes',
      similarity: 88,
      location: 'Col. Narvarte, CDMX',
      owner: 'Jorge T.',
    },
  ];

  const displayedStories = showAllStories ? stories : stories.slice(0, 3);

  const bgClass = theme === 'light' ? 'bg-white' : 'bg-gray-900/50 backdrop-blur-xl border border-purple-500/20';
  const cardBgClass = theme === 'light' ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/20';
  const textClass = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondaryClass = theme === 'light' ? 'text-gray-600' : 'text-gray-400';

  const handleShare = async (story: typeof stories[0]) => {
    const shareData = {
      title: `Historia de éxito: ${story.name}`,
      text: `${story.story} - ${story.location}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error al compartir:', err);
      }
    } else {
      // Fallback: copiar al portapapeles
      const shareText = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      navigator.clipboard.writeText(shareText);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const handleDownload = async (story: typeof stories[0]) => {
    try {
      // Crear un canvas para generar la imagen con información
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Configurar el tamaño del canvas
      canvas.width = 800;
      canvas.height = 1000;

      // Cargar la imagen
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = story.photo;

      img.onload = () => {
        // Dibujar fondo
        ctx.fillStyle = theme === 'light' ? '#ffffff' : '#1f2937';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dibujar la imagen
        ctx.drawImage(img, 0, 0, canvas.width, 600);

        // Dibujar información
        ctx.fillStyle = theme === 'light' ? '#000000' : '#ffffff';
        ctx.font = 'bold 32px Arial';
        ctx.fillText(`✓ ${story.name} - REUNIDO`, 40, 680);

        ctx.font = '24px Arial';
        ctx.fillText(story.breed, 40, 720);

        ctx.font = '20px Arial';
        ctx.fillStyle = theme === 'light' ? '#666666' : '#9ca3af';
        
        // Wrap text for story
        const words = story.story.split(' ');
        let line = '';
        let y = 760;
        const maxWidth = 720;
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && i > 0) {
            ctx.fillText(line, 40, y);
            line = words[i] + ' ';
            y += 28;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 40, y);

        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = theme === 'light' ? '#8b5cf6' : '#a78bfa';
        ctx.fillText(`Match IA: ${story.similarity}% | ${story.location}`, 40, y + 50);

        // Descargar la imagen
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `historia-exito-${story.name.toLowerCase()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
          }
        });
      };

      img.onerror = () => {
        // Fallback: solo descargar la imagen original
        const link = document.createElement('a');
        link.download = `historia-exito-${story.name.toLowerCase()}.jpg`;
        link.href = story.photo;
        link.target = '_blank';
        link.click();
      };
    } catch (error) {
      console.error('Error al descargar:', error);
      alert('No se pudo descargar la imagen');
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className={`${bgClass} rounded-2xl shadow-xl p-8 transition-all duration-300`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500 ${
                theme === 'dark' ? 'shadow-lg shadow-green-500/50' : ''
              }`}>
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h2 className={`text-3xl ${textClass}`}>Historias de Éxito</h2>
                <p className={textSecondaryClass}>Familias felices gracias a nuestra comunidad e IA</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {displayedStories.map((story) => (
              <div
                key={story.id}
                className={`${cardBgClass} rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  theme === 'dark' ? 'hover:shadow-xl hover:shadow-green-500/20' : 'hover:shadow-xl'
                }`}
              >
                <div className="relative">
                  <img
                    src={story.photo}
                    alt={story.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button 
                      onClick={() => handleShare(story)}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                      theme === 'light'
                        ? 'bg-white/90 hover:bg-white'
                        : 'bg-gray-900/90 hover:bg-gray-800 border border-green-500/30'
                    }`}>
                      <Share2 className={`w-4 h-4 ${textClass}`} />
                    </button>
                    <button 
                      onClick={() => handleDownload(story)}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                      theme === 'light'
                        ? 'bg-white/90 hover:bg-white'
                        : 'bg-gray-900/90 hover:bg-gray-800 border border-green-500/30'
                    }`}>
                      <Download className={`w-4 h-4 ${textClass}`} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs text-white backdrop-blur-md ${
                      theme === 'light'
                        ? 'bg-green-600/90'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
                    }`}>
                      ✓ REUNIDO
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-xl ${textClass}`}>{story.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
                      theme === 'light'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      <Sparkles className="w-3 h-3" />
                      {story.similarity}% IA
                    </div>
                  </div>

                  <p className={`text-sm mb-3 ${textSecondaryClass}`}>{story.breed}</p>
                  <p className={`text-sm mb-4 leading-relaxed ${textClass}`}>{story.story}</p>

                  <div className={`pt-4 border-t ${theme === 'light' ? 'border-green-200' : 'border-green-500/20'} space-y-2 text-sm ${textSecondaryClass}`}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{story.timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      📍 <span>{story.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      👤 <span>Reportado por {story.owner}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className={`px-8 py-3 rounded-full transition-all ${
              theme === 'light'
                ? 'border-2 border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600'
                : 'border-2 border-purple-500/30 text-purple-400 hover:border-green-500 hover:text-green-400 hover:shadow-lg hover:shadow-green-500/20'
            }`} onClick={() => setShowAllStories(!showAllStories)}>
              {showAllStories ? 'Ver Menos' : 'Ver Más Historias de Éxito'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
