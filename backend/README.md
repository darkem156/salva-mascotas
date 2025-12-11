# 🐾 Backend Salva-Mascotas

Backend en **Node.js + Express** con:

- **Supabase** (PostgreSQL + Storage)
- **OpenAI Vision (GPT-4.1-mini)** para coincidencias de mascotas
- Endpoints para:
  - Subir mascotas perdidas
  - Subir mascotas encontradas
  - Ver mascotas cercanas en el mapa
  - Lanzar coincidencias IA
  - Consultar coincidencias

## 🚀 Cómo usar

1. Ve a la carpeta:

```bash
cd backend-salva-mascotas
```

2. Instala dependencias:

```bash
npm install
```

3. Copia el archivo `.env.example` a `.env` y rellena tus datos:

```bash
cp .env.example .env
```

Edita:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` o `SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

4. Crea en Supabase:

- Un bucket de storage llamado `pets`
- Tabla `lost_pets` con columnas mínimas:
  - `id` (uuid, pk, default uuid_generate_v4())
  - `name` (text)
  - `type` (text)
  - `breed` (text)
  - `color` (text)
  - `size` (text)
  - `description` (text)
  - `last_seen_date` (timestamptz)
  - `lat` (double precision)
  - `lng` (double precision)
  - `user_id` (uuid, nullable)
  - `photo_url` (text)

- Tabla `found_pets` (mismas columnas excepto `name`, opcional)

- Tabla `matches`:
  - `lost_pet_id` (uuid, fk a `lost_pets.id`)
  - `found_pet_id` (uuid, fk a `found_pets.id`)
  - `score` (double precision)

5. Arranca el servidor:

```bash
npm run dev
```

La API escuchará en:

```
http://localhost:4000
```

## 🔗 Endpoints principales

### `POST /api/pets/lost`

Subir mascota perdida (`multipart/form-data`):

- `photo` (file)
- `name`
- `type`
- `breed`
- `color`
- `size`
- `description`
- `last_seen_date` (opcional, ISO string)
- `lat`
- `lng`
- `user_id` (opcional)

### `POST /api/pets/found`

Subir mascota encontrada (`multipart/form-data`):

- `photo` (file)
- `type`
- `breed`
- `color`
- `size`
- `description`
- `found_date` (opcional)
- `lat`
- `lng`
- `user_id` (opcional)

### `GET /api/pets/near?lat=..&lng=..&radiusKm=5`

Devuelve:

```json
{
  "lost": [ ... ],
  "found": [ ... ]
}
```

### `POST /api/ai/match/:foundId`

Lanza IA para comparar una mascota encontrada contra las últimas 50 perdidas,
guarda coincidencias en `matches` y retorna los matches con `score >= 0.7`.

### `GET /api/matches/:foundId`

Devuelve las coincidencias para una mascota encontrada, con información de la
mascota perdida asociada.

---

Conecta tu frontend de React/Vite a estos endpoints usando `fetch` o `axios` y ya
tienes tu app **Salva-Mascotas** funcionando con **base de datos + mapa + IA** 🐶✨
