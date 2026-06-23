# Follow Property

Newspaper-style NCR real estate press release site for **Delhi, Gurgaon and Noida**.

## Tech stack

| Layer | Tool |
|-------|------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS + custom newspaper CSS |
| Fonts | UnifrakturMaguntia, Playfair Display, IM Fell English |
| Database | MongoDB Atlas |
| ORM | Mongoose |
| API | Next.js API routes (`/api/news`) |
| Deploy | Vercel |

## Quick start

```bash
npm install
cp .env.example .env.local
# Add your MongoDB Atlas URI to .env.local
npm run seed   # optional — populates sample articles
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Without MongoDB

The site runs with built-in fallback articles if `MONGODB_URI` is not set — useful for local UI development.

## API

- `GET /api/news` — all articles (`?city=Gurgaon&type=Metro&limit=20`)
- `GET /api/news/[id]` — single article
- `POST /api/news` — publish article (header: `x-api-key: YOUR_ADMIN_API_KEY`)

## Admin desk

Visit `/admin` to submit press releases through the browser form.

Set `ADMIN_API_KEY` in `.env.local` — the same key is sent as `x-api-key` on POST.

## Tag-based content model

Each article carries multiple tags: city, type, topic, audience. Filters on the homepage map to MongoDB queries without rigid category boxes.

## Deploy

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set `MONGODB_URI` environment variable
4. Run `npm run seed` once against production DB (or add articles via your backend)
