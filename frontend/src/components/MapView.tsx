import { useState, useEffect } from "react";
import { MapPin, Filter, X } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { API_URL } from "../config";
import { Pet } from "../types";

// React Leaflet imports
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Fix Leaflet icon bug (REQUIRED for Vite/React) ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapViewProps {
  lostPets: Pet[];
  foundPets: Pet[];
}

export function MapView({ lostPets, foundPets }: MapViewProps) {
  const { theme } = useTheme();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [backendLostPets, setBackendLostPets] = useState<Pet[]>([]);
  const [backendFoundPets, setBackendFoundPets] = useState<Pet[]>([]);

  console.log(backendFoundPets)
  console.log(backendLostPets)

  const [filters, setFilters] = useState({
    breed: "",
    size: "",
    color: "",
    radius: 5,
    showLost: true,
    showFound: true,
  });

  // --- Obtener ubicación ---
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => console.error("Ubicación denegada:", err)
    );
  }, []);

  // --- Cargar mascotas cercanas ---
  useEffect(() => {
    if (!userLocation) return;

    const fetchNearbyPets = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/pets/near?lat=${userLocation.lat}&lng=${userLocation.lng}&radiusKm=${filters.radius}`
        );
        if (!res.ok) return;

        const data = await res.json();

        const mapToPet = (p: any, status: "lost" | "found"): Pet => ({
          id: p.id,
          name: p.name || (status === "lost" ? "Mascota perdida" : "Mascota encontrada"),
          photo:
            p.photo_url ||
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
          breed: p.breed || "",
          size: p.size || "mediano",
          color: p.color || "",
          location: {
            address: p.address || "Cerca de ti",
            lat: p.lat ?? userLocation.lat,
            lng: p.lng ?? userLocation.lng,
          },
          description: p.description || "",
          ownerName: p.ownerName,
          reporterName: p.reporterName,
          phone: p.phone,
          timestamp: p.last_seen_date || p.found_date || new Date().toISOString(),
          status,
        });

        setBackendLostPets((data.lost || []).map((p: any) => mapToPet(p, "lost")));
        setBackendFoundPets((data.found || []).map((p: any) => mapToPet(p, "found")));
      } catch (e) {
        console.error("Error al obtener mascotas cercanas:", e);
      }
    };

    fetchNearbyPets();
  }, [userLocation, filters.radius]);

  // --- Merge mascotas front + backend ---
  let allLostPets = [...lostPets, ...backendLostPets];
  let allFoundPets = [...foundPets, ...backendFoundPets];

  // --- Aplicar filtros ---
  if (filters.breed) {
    allLostPets = allLostPets.filter((p) =>
      p.breed.toLowerCase().includes(filters.breed.toLowerCase())
    );
    allFoundPets = allFoundPets.filter((p) =>
      p.breed.toLowerCase().includes(filters.breed.toLowerCase())
    );
  }

  if (filters.size) {
    allLostPets = allLostPets.filter((p) => p.size === filters.size);
    allFoundPets = allFoundPets.filter((p) => p.size === filters.size);
  }

  if (filters.color) {
    allLostPets = allLostPets.filter((p) =>
      p.color.toLowerCase().includes(filters.color.toLowerCase())
    );
    allFoundPets = allFoundPets.filter((p) =>
      p.color.toLowerCase().includes(filters.color.toLowerCase())
    );
  }

  const displayedLostPets = filters.showLost ? allLostPets : [];
  const displayedFoundPets = filters.showFound ? allFoundPets : [];

  // --- Helpers ---
  const getTimeAgo = (timestamp: string) => {
    const hours = Math.round(
      (Date.now() - new Date(timestamp).getTime()) / 3600000
    );
    if (hours < 1) return "menos de 1 hora";
    if (hours === 1) return "1 hora";
    if (hours < 24) return `${hours} horas`;
    const days = Math.floor(hours / 24);
    return days === 1 ? "1 día" : `${days} días`;
  };

  const clearFilters = () =>
    setFilters({
      breed: "",
      size: "",
      color: "",
      radius: 5,
      showLost: true,
      showFound: true,
    });

  const textClass = theme === "light" ? "text-gray-900" : "text-white";
  const textSecondaryClass =
    theme === "light" ? "text-gray-600" : "text-gray-400";
  const bgClass =
    theme === "light"
      ? "bg-white"
      : "bg-gray-900/50 backdrop-blur-xl border border-purple-500/20";

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className={`${bgClass} rounded-2xl shadow-xl overflow-hidden`}>

        {/* ------------------- FILTROS ------------------- */}
        <div
          className={`p-4 ${
            theme === "light"
              ? "bg-gradient-to-r from-blue-500 to-purple-500"
              : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          } text-white`}
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-6 h-6" />
            <div className="flex-1">
              <h2 className="text-xl">Mapa en Tiempo Real</h2>
              <p className="text-sm text-white/90">
                {displayedLostPets.length} perdidos • {displayedFoundPets.length} encontrados
              </p>
            </div>

            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Buscar por raza..."
              value={filters.breed}
              onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
              className="px-4 py-2 rounded-lg text-gray-800"
            />

            <select
              value={filters.size}
              onChange={(e) =>
                setFilters({ ...filters, size: e.target.value })
              }
              className="px-4 py-2 rounded-lg text-gray-800"
            >
              <option value="">Todos los tamaños</option>
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>

            <input
              type="text"
              placeholder="Color..."
              value={filters.color}
              onChange={(e) =>
                setFilters({ ...filters, color: e.target.value })
              }
              className="px-4 py-2 rounded-lg text-gray-800"
            />

            <label className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showLost}
                onChange={(e) =>
                  setFilters({ ...filters, showLost: e.target.checked })
                }
              />
              <span className="text-sm">Perdidos</span>
            </label>

            <label className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showFound}
                onChange={(e) =>
                  setFilters({ ...filters, showFound: e.target.checked })
                }
              />
              <span className="text-sm">Encontrados</span>
            </label>
          </div>

          <div className="mt-3">
            <label className="text-sm mb-1 block">
              Radio de búsqueda: {filters.radius}km
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={filters.radius}
              onChange={(e) =>
                setFilters({ ...filters, radius: Number(e.target.value) })
              }
              className="w-full"
            />
          </div>
        </div>

        {/* ------------------- MAPA REAL ------------------- */}
        <div className="relative h-[500px] w-full z-0">
          {userLocation ? (
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={14}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* Círculo de radio */}
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={filters.radius * 1000}
                pathOptions={{
                  color: theme === "light" ? "#4f46e5" : "#c084fc",
                  fillOpacity: 0.1,
                }}
              />

              {/* Marcador del usuario */}
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>Tu ubicación</Popup>
              </Marker>

              {/* Perdidos */}
              {displayedLostPets.map((pet) => (
                <Marker
                  key={`lost-${pet.id}`}
                  position={[pet.location.lat, pet.location.lng]}
                  eventHandlers={{
                    click: () => setSelectedPet(pet),
                  }}
                >
                  <Popup>
                    <b>{pet.name}</b>
                    <br />🐕 {pet.breed}
                    <br />📍 {pet.location.address}
                  </Popup>
                </Marker>
              ))}

              {/* Encontrados */}
              {displayedFoundPets.map((pet) => (
                <Marker
                  key={`found-${pet.id}`}
                  position={[pet.location.lat, pet.location.lng]}
                  eventHandlers={{
                    click: () => setSelectedPet(pet),
                  }}
                >
                  <Popup>
                    <b>{pet.name}</b>
                    <br />🐕 {pet.breed}
                    <br />📍 {pet.location.address}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className={textSecondaryClass}>Obteniendo ubicación...</p>
            </div>
          )}
        </div>

        {/* ------------------- PANEL DE DETALLE ------------------- */}
        {selectedPet && (
          <div
            className={`p-4 border-t ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-gray-900/50 border-purple-500/20"
            }`}
          >
            <div className="flex gap-4">
              <img
                src={selectedPet.photo}
                alt={selectedPet.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className={`text-lg ${textClass}`}>{selectedPet.name}</h3>

                <p className={`text-sm ${textSecondaryClass}`}>
                  🐕 {selectedPet.breed} • 📏 {selectedPet.size} • 🎨 {selectedPet.color}
                </p>

                <p className={`text-sm ${textSecondaryClass}`}>
                  📍 {selectedPet.location.address}
                </p>

                <p className={`text-xs mt-1 ${textSecondaryClass}`}>
                  Reportado hace {getTimeAgo(selectedPet.timestamp)}
                </p>
              </div>

              <button
                onClick={() => setSelectedPet(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* ------------------- LEYENDA ------------------- */}
        <div
          className={`p-4 border-t flex justify-between ${
            theme === "light"
              ? "bg-gray-50 border-gray-200"
              : "bg-gray-800/30 border-purple-500/20"
          }`}
        >
          <div className="flex gap-4 text-sm">
            <div className="flex gap-1 items-center">
              <MapPin className="w-4 h-4 text-orange-500" />
              Perdidos ({displayedLostPets.length})
            </div>

            <div className="flex gap-1 items-center">
              <MapPin className="w-4 h-4 text-green-500" />
              Encontrados ({displayedFoundPets.length})
            </div>
          </div>

          <p className={`text-sm ${textSecondaryClass}`}>
            Radio: {filters.radius}km
          </p>
        </div>
      </div>
    </div>
  );
}
