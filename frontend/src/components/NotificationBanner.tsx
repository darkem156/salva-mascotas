import { Sparkles, X, MessageCircle } from 'lucide-react';
import { Match } from '../types';

interface NotificationBannerProps {
  match: Match;
  onClose: () => void;
  onOpenChat: () => void;
}

export function NotificationBanner({ match, onClose, onOpenChat }: NotificationBannerProps) {
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-bounce">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="mb-1">¡Coincidencia encontrada!</h4>
            <p className="text-sm text-white/90 mb-3">
              La IA encontró una coincidencia de {match.similarity}% con {match.lostPet.name}
            </p>
            <button
              onClick={onOpenChat}
              className="w-full bg-white text-purple-600 py-2 rounded-lg hover:bg-white/90 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Abrir Chat Ahora
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
