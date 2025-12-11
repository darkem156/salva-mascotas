export interface Pet {
  id: string;
  name: string;
  photo_url: string;
  breed: string;
  size: 'pequeño' | 'mediano' | 'grande';
  color: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  description: string;
  ownerName?: string;
  reporterName?: string;
  phone?: string;
  timestamp: string;
  status: 'lost' | 'found' | 'reunited';
}

export interface Match {
  id: string;
  lostPet: Pet;
  found_pets: Pet;
  similarity: number;
  matchedFeatures: string[];
  timestamp: string;
  status?: 'pending' | 'contacted' | 'reunited';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  matchId: string;
  participants: Array<{ id: string; name: string }>;
  messages: ChatMessage[];
}
