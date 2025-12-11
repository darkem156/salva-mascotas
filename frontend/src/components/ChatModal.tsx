import { useState } from 'react';
import { X, Send, Shield } from 'lucide-react';
import { ChatRoom, ChatMessage } from '../types';

interface ChatModalProps {
  chatRoom: ChatRoom;
  onClose: () => void;
}

export function ChatModal({ chatRoom, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(chatRoom.messages);
  const [inputText, setInputText] = useState('');
  const currentUserId = 'user1'; // Simulating logged in user

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      text: inputText,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate response
    setTimeout(() => {
      const responseMessage: ChatMessage = {
        id: `msg-${Date.now()}-response`,
        senderId: currentUserId === 'user1' ? 'user2' : 'user1',
        text: '¡Gracias por contactarme! Sí, aún tengo a la mascota. ¿Podemos vernos?',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, responseMessage]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5" />
              <h3 className="text-lg">Chat Seguro</h3>
            </div>
            <p className="text-sm text-white/90">
              {chatRoom.participants.find((p) => p.id !== currentUserId)?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId;
            const isSystem = message.senderId === 'system';

            if (isSystem) {
              return (
                <div key={message.id} className="text-center">
                  <p className="text-xs text-gray-500 bg-gray-100 inline-block px-4 py-2 rounded-full">
                    {message.text}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrentUser ? 'text-white/70' : 'text-gray-500'
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString('es-MX', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:shadow-lg transition-shadow"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            🔒 Chat protegido - Tu información personal está segura
          </p>
        </div>
      </div>
    </div>
  );
}
