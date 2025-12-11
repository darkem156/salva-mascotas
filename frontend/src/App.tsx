import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ReportLost } from './components/ReportLost';
import { ReportFound } from './components/ReportFound';
import { Matches } from './components/Matches';
import { MapView } from './components/MapView';
import { PetGrid } from './components/PetGrid';
import { ChatModal } from './components/ChatModal';
import { NotificationBanner } from './components/NotificationBanner';
import { Statistics } from './components/Statistics';
import { SuccessStories } from './components/SuccessStories';
import { HowItWorks } from './components/HowItWorks';
import { ScrollToTop } from './components/ScrollToTop';
import { Pet, Match, ChatRoom } from './types';
import { API_URL } from './config';
import { PetDetail } from './components/PetDetail';
import { EditPetModal } from './components/EditPetModal';

function AppContent() {
  const { theme } = useTheme();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'report-lost' | 'report-found' | 'matches' | 'map' | 'how-it-works'>('home');
  const [lostPets, setLostPets] = useState<Pet[]>([]);
  const [foundPets, setFoundPets] = useState<Pet[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMatch, setNotificationMatch] = useState<Match | null>(null);

  async function getLostAndFoundPets() {
    const responseLostPets = await fetch(`${API_URL}/api/pets/lost`);
    const lostPetsData = await responseLostPets.json();
    console.log('Lost Pets Data:', lostPetsData);
    const processedLostPets = lostPetsData.map((pet: Pet) => ({
      ...pet,
      // Get address based on coordinates (mocked for now)
      location: {
        address: `Cerca de (${pet.lat.toFixed(2)}, ${pet.lng.toFixed(2)})`,
      },
      photo: pet.photo_url,
      status: 'lost',
      timestamp: new Date(pet.last_seen_date).getTime()
    }));
    setLostPets(processedLostPets);

    const responseFoundPets = await fetch(`${API_URL}/api/pets/found`);
    const foundPetsData = await responseFoundPets.json();
    const processedFoundPets = foundPetsData.map((pet: Pet) => ({
      ...pet,
      location: {
        address: `Cerca de (${pet.lat.toFixed(2)}, ${pet.lng.toFixed(2)})`,
      },
      photo: pet.photo_url,
      timestamp: new Date(pet.found_date).getTime(),
    }));
    setFoundPets(processedFoundPets);
  }

  useEffect(() => {
    getLostAndFoundPets();
  }, []);


  const handleReportLost = (pet: Pet) => {
    setLostPets([pet, ...lostPets]);
    setActiveTab('home');
    // Simulate AI matching
    setTimeout(() => {
      checkForMatches(pet, 'lost');
    }, 2000);
  };

  const handleReportFound = (pet: Pet) => {
    setFoundPets([pet, ...foundPets]);
    setActiveTab('home');
    // Simulate AI matching
    setTimeout(() => {
      checkForMatches(pet, 'found');
    }, 2000);
  };

  const checkForMatches = (newPet: Pet, type: 'lost' | 'found') => {
    const petsToCheck = type === 'lost' ? foundPets : lostPets;
    
    // Simulate AI matching algorithm
    /*
    petsToCheck.forEach((pet) => {
      const similarity = Math.random();
      if (similarity > 0.7) {
        const newMatch: Match = {
          id: `match-${Date.now()}-${Math.random()}`,
          lostPet: type === 'lost' ? newPet : pet,
          foundPet: type === 'found' ? newPet : pet,
          similarity: Math.round(similarity * 100),
          matchedFeatures: ['Patrón de manchas', 'Color de ojos', 'Forma de orejas'],
          timestamp: new Date().toISOString(),
        };
        setMatches((prev) => [newMatch, ...prev]);
        setNotificationMatch(newMatch);
        setShowNotification(true);
      }
    });
    */
  };

  const handleOpenChat = (match: Match) => {
    const chatRoom: ChatRoom = {
      id: `chat-${match.id}`,
      matchId: match.id,
      participants: [
        { id: 'user1', name: match.lostPet.ownerName || 'Dueño' },
        { id: 'user2', name: match.found_pets.reporterName || 'Quien encontró' },
      ],
      messages: [
        {
          id: 'msg1',
          senderId: 'system',
          text: `Chat iniciado por coincidencia de ${match.similarity}% con ${match.lostPet.name}`,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setActiveChatRoom(chatRoom);
  };

  const handleViewPetDetail = (pet: Pet) => {
    setSelectedPet(pet);
    setActiveTab('pet-detail');
    window.scrollTo(0, 0);
  };

  const handleBackFromDetail = () => {
    setSelectedPet(null);
    setActiveTab('home');
  };

  // CRUD Functions
  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
  };

  const handleSaveEditPet = (updatedPet: Pet) => {
    if (updatedPet.status === 'lost') {
      setLostPets(lostPets.map(p => p.id === updatedPet.id ? updatedPet : p));
    } else {
      setFoundPets(foundPets.map(p => p.id === updatedPet.id ? updatedPet : p));
    }
    
    // Update selected pet if it's currently being viewed
    if (selectedPet?.id === updatedPet.id) {
      setSelectedPet(updatedPet);
    }
    
    setEditingPet(null);
    alert('¡Publicación actualizada exitosamente!');
  };

  const handleDeletePet = (pet: Pet) => {
    if (pet.status === 'lost') {
      setLostPets(lostPets.filter(p => p.id !== pet.id));
    } else {
      setFoundPets(foundPets.filter(p => p.id !== pet.id));
    }
    
    // Remove matches related to this pet
    setMatches(matches.filter(m => m.lostPet.id !== pet.id && m.foundPet.id !== pet.id));
    
    alert('Publicación eliminada exitosamente');
    handleBackFromDetail();
  };

  const handleMarkAsFound = (pet: Pet) => {
    if (confirm(`¿Confirmas que has encontrado a ${pet.name}? La publicación pasará de "Perdido" a "Encontrado".`)) {
      // Remove from lost pets
      setLostPets(lostPets.filter(p => p.id !== pet.id));
      
      // Create new found pet entry
      const foundVersion: Pet = {
        ...pet,
        status: 'found',
        timestamp: new Date().toISOString(),
        reporterName: pet.ownerName,
        ownerName: undefined,
      };
      
      setFoundPets([foundVersion, ...foundPets]);
      
      alert(`¡Excelente noticia! ${pet.name} ha sido marcado como encontrado. 🎉`);
      handleBackFromDetail();
    }
  };

  const bgClass = theme === 'light' 
    ? 'bg-gray-50' 
    : 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900';

return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-500`}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      {showNotification && notificationMatch && (
        <NotificationBanner
          match={notificationMatch}
          onClose={() => setShowNotification(false)}
          onOpenChat={() => {
            handleOpenChat(notificationMatch);
            setShowNotification(false);
          }}
        />
      )}

      {activeTab === 'home' && (
        <>
          <HeroBanner 
            onReportLost={() => setActiveTab('report-lost')}
            onHowItWorks={() => setActiveTab('how-it-works')}
          />
          <Statistics />
          <PetGrid 
            lostPets={lostPets} 
            foundPets={foundPets}
            onOpenChat={handleOpenChat}
            onViewAllPets={() => setActiveTab('map')}
            onViewPetDetail={handleViewPetDetail}
          />
          <SuccessStories onViewAllStories={() => setActiveTab('home')} />
        </>
      )}

      {activeTab === 'report-lost' && (
        <div className="py-12">
          <ReportLost onSubmit={handleReportLost} />
        </div>
      )}
      
      {activeTab === 'report-found' && (
        <div className="py-12">
          <ReportFound onSubmit={handleReportFound} />
        </div>
      )}
      
      {activeTab === 'matches' && (
        <div className="py-12">
          <Matches matches={matches} onOpenChat={handleOpenChat} />
        </div>
      )}
      
      {activeTab === 'map' && (
        <div className="py-12">
          <MapView lostPets={lostPets} foundPets={foundPets} />
        </div>
      )}

      {activeTab === 'how-it-works' && (
        <div className="py-12">
          <HowItWorks 
            onReportLost={() => setActiveTab('report-lost')}
            onReportFound={() => setActiveTab('report-found')}
          />
        </div>
      )}

      {activeTab === 'pet-detail' && selectedPet && (
        <PetDetail
          pet={selectedPet}
          matches={matches}
          onBack={handleBackFromDetail}
          onOpenChat={handleOpenChat}
          onViewMatch={handleViewPetDetail}
          onEdit={handleEditPet}
          onDelete={handleDeletePet}
          onMarkAsFound={handleMarkAsFound}
        />
      )}

      {editingPet && (
        <EditPetModal
          pet={editingPet}
          onClose={() => setEditingPet(null)}
          onSave={handleSaveEditPet}
        />
      )}

      {activeChatRoom && (
        <ChatModal
          chatRoom={activeChatRoom}
          onClose={() => setActiveChatRoom(null)}
        />
      )}
      <ScrollToTop />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}