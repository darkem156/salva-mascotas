import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabaseClient.js";
import { getVisionMatchScore } from "./visionService.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors(
  {
    origin: '*',
  }
));
app.use(express.json());

// Multer para manejar archivos (fotos)
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.json({ ok: true, message: "API Salva-Mascotas funcionando 🐾" });
});

// ---------- Helpers ----------
function parseNumber(value, fallback = null) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// ---------- Endpoints ----------

// Todas las mascotas perdidas
app.get("/api/pets/lost", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("lost_pets")
      .select("*")
      .order("last_seen_date", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error consultando mascotas perdidas" });
    }

    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Todas las mascotas encontradas
app.get("/api/pets/found", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("found_pets")
      .select("*")
      .order("found_date", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error consultando mascotas encontradas" });
    }

    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Mascota perdida
app.post(
  "/api/pets/lost",
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        name,
        ownerName,
        type,
        breed,
        color,
        size,
        description,
        last_seen_date,
        lat,
        lng,
        phone,
      } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "La foto es obligatoria" });
      }

      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `lost/${uuidv4()}.${fileExt}`;
      const contentType = req.file.mimetype || "image/jpeg";

      const { error: uploadError } = await supabase.storage
        .from("pets")
        .upload(fileName, req.file.buffer, {
          contentType,
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        return res.status(500).json({ error: "Error subiendo imagen" });
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("pets").getPublicUrl(fileName);

      const { data, error } = await supabase
        .from("lost_pets")
        .insert({
          name,
          ownerName,
          type,
          breed,
          color,
          size,
          description,
          phone,
          last_seen_date: last_seen_date || new Date().toISOString(),
          lat: parseNumber(lat),
          lng: parseNumber(lng),
          photo_url: publicUrl,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error guardando mascota perdida" });
      }
      // Revisar coincidencias con las mascotas encontradas (opcional)
      const { data: foundPets, error: foundError } = await supabase
        .from("found_pets")
        .select("*")
        .order("found_date", { ascending: false })
        .limit(50);

      if (foundError) {
        console.error(foundError);
        return;
      }

      for (const found of foundPets) {
        const score = await getVisionMatchScore(data.photo_url, found.photo_url);
        console.log(score)

        if (score >= 0.7) {
          const { error } = await supabase.from("matches").upsert({
            lost_pet_id: data.id,
            found_pet_id: found.id,
            score,
          });
          if (error) console.error("Error guardando match:", error);
        }
      }

      res.status(201).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error interno" });
    }
  }
);

// Mascota encontrada
app.post(
  "/api/pets/found",
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        reporterName,
        type,
        breed,
        color,
        size,
        description,
        found_date,
        lat,
        lng,
        phone,
      } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "La foto es obligatoria" });
      }

      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `found/${uuidv4()}.${fileExt}`;
      const contentType = req.file.mimetype || "image/jpeg";

      const { error: uploadError } = await supabase.storage
        .from("pets")
        .upload(fileName, req.file.buffer, {
          contentType,
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        return res.status(500).json({ error: "Error subiendo imagen" });
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("pets").getPublicUrl(fileName);

      const { data, error } = await supabase
        .from("found_pets")
        .insert({
          reporterName,
          type,
          breed,
          color,
          size,
          description,
          found_date: found_date || new Date().toISOString(),
          lat: parseNumber(lat),
          lng: parseNumber(lng),
          photo_url: publicUrl,
          phone,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Error guardando mascota encontrada" });
      }
      // Revisar coincidencias con las mascotas perdidas (opcional)
      const { data: lostPets, error: lostError } = await supabase
        .from("lost_pets")
        .select("*")
        .order("last_seen_date", { ascending: false })
        .limit(50);

      if (lostError) {
        console.error(lostError);
        return;
      }
      console.log(lostPets);

      for (const lost of lostPets) {
        const score = await getVisionMatchScore(lost.photo_url, data.photo_url);

        if (score >= 0.7) {
          const { error } = await supabase.from("matches").upsert({
            lost_pet_id: lost.id,
            found_pet_id: data.id,
            score,
          });
          if (error) console.error("Error guardando match:", error);
        }
      }

      res.status(201).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error interno" });
    }
  }
);

// Mascotas cercanas (perdidas y encontradas)
app.get("/api/pets/near", async (req, res) => {
  try {
    const lat = parseNumber(req.query.lat);
    const lng = parseNumber(req.query.lng);
    const radiusKm = parseNumber(req.query.radiusKm, 5); // radio 5 km por defecto

    if (lat == null || lng == null) {
      return res.status(400).json({ error: "lat y lng son obligatorios" });
    }

    // Aproximación simple con bounding box
    const earthRadiusKm = 6371;
    const deltaLat = (radiusKm / earthRadiusKm) * (180 / Math.PI);
    const deltaLng =
      (radiusKm / earthRadiusKm) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180);

    const minLat = lat - deltaLat;
    const maxLat = lat + deltaLat;
    const minLng = lng - deltaLng;
    const maxLng = lng + deltaLng;

    const [lostRes, foundRes] = await Promise.all([
      supabase
        .from("lost_pets")
        .select("*")
        .gte("lat", minLat)
        .lte("lat", maxLat)
        .gte("lng", minLng)
        .lte("lng", maxLng),
      supabase
        .from("found_pets")
        .select("*")
        .gte("lat", minLat)
        .lte("lat", maxLat)
        .gte("lng", minLng)
        .lte("lng", maxLng),
    ]);

    if (lostRes.error || foundRes.error) {
      console.error(lostRes.error || foundRes.error);
      return res.status(500).json({ error: "Error consultando mascotas cercanas" });
    }

    res.json({
      lost: lostRes.data || [],
      found: foundRes.data || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Lanzar coincidencias IA para una mascota encontrada específica
app.post("/api/ai/match/:foundId", async (req, res) => {
  try {
    const foundId = req.params.foundId;

    const { data: foundPet, error: foundError } = await supabase
      .from("found_pets")
      .select("*")
      .eq("id", foundId)
      .single();

    if (foundError || !foundPet) {
      console.error(foundError);
      return res.status(404).json({ error: "Mascota encontrada no existe" });
    }

    // Traemos mascotas perdidas recientes (se puede optimizar con filtros)
    const { data: lostPets, error: lostError } = await supabase
      .from("lost_pets")
      .select("*")
      .order("last_seen_date", { ascending: false })
      .limit(50);

    if (lostError) {
      console.error(lostError);
      return res.status(500).json({ error: "Error consultando mascotas perdidas" });
    }

    const matches = [];

    for (const lost of lostPets) {
      const score = await getVisionMatchScore(lost.photo_url, foundPet.photo_url);

      if (score >= 0.7) {
        matches.push({
          lost_pet_id: lost.id,
          found_pet_id: foundPet.id,
          score,
        });
      }
    }

    // Guardamos coincidencias
    for (const m of matches) {
      const { error } = await supabase.from("matches").upsert(m);
      if (error) console.error("Error guardando match:", error);
    }

    res.json({ ok: true, matches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno en coincidencias IA" });
  }
});

// Obtener coincidencias de una mascota encontrada
app.get("/api/matches/found/:foundId", async (req, res) => {
  try {
    const foundId = req.params.foundId;
    console.log(foundId)

    const { data, error } = await supabase
      .from("matches")
      .select("*, lost_pets(*), found_pets(*)")
      .eq("found_pet_id", foundId)
      .order("score", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error consultando coincidencias" });
    }

    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Obtener coincidencias de una mascota perdida
app.get("/api/matches/lost/:lostId", async (req, res) => {
  try {
    const lostId = req.params.lostId;

    const { data, error } = await supabase
      .from("matches")
      .select("*, found_pets(*), lost_pets(*)")
      .eq("lost_pet_id", lostId)
      .order("score", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error consultando coincidencias" });
    }

    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Get all matches
app.get("/api/matches", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("matches")
      .select("*, lost_pets(*), found_pets(*)")
      .eq("validated", false)
      .order("score", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error consultando coincidencias" });
    }

    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Coincidencias ya validadas
app.get("/api/matches/validated", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("matches")
      .select("*, lost_pets(*), found_pets(*)")
      .eq("validated", true)
      .order("score", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error consultando coincidencias validadas" });
    }

    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Endpoint para cuando se edite la publicacion
app.put("/api/pets/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;
    const updates = req.body;
    console.log('Updating pet:', type, id, updates);

    const tableName = type === "lost" ? "lost_pets" : "found_pets";

    if (!tableName) {
      return res.status(400).json({ error: "Tipo de mascota inválido" });
    }

    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error actualizando mascota" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Endpoint para eliminar una mascota
app.delete("/api/pets/:type/:id", async (req, res) => {
  try {
    const { type, id } = req.params;

    const tableName = type === "lost" ? "lost_pets" : type === "found" ? "found_pets" : null;

    if (!tableName) {
      return res.status(400).json({ error: "Tipo de mascota inválido" });
    }

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error eliminando mascota" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Marcar match como valido
app.post("/api/matches/:id/confirm", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("matches")
      .update({ validated: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error confirmando match" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

// Borrar match
app.delete("/api/matches/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("matches")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error eliminando match" });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 API Salva-Mascotas escuchando en http://localhost:${port}`);
});