## Smart IoT QR & Barcode Authentication

Implementasi awal PRD sudah mencakup login admin, dashboard, generator QR dan barcode, endpoint validasi token, serta struktur layered architecture di `src/`.

## Environment

Salin `.env.example` ke `.env.local`.

- `JWT_SECRET` untuk signing JWT
- `NEXT_PUBLIC_BASE_URL` untuk payload URL QR/barcode
- `CORS_ALLOWED_ORIGINS` daftar origin client yang boleh akses API, pisahkan dengan koma
- `SEED_ADMIN_EMAIL` dan `SEED_ADMIN_PASSWORD` untuk admin lokal
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` untuk persistensi Firestore via service account

Jika kredensial Firebase belum diisi, repository akan fallback ke penyimpanan in-memory agar pengembangan lokal tetap jalan.

Format `FIREBASE_PRIVATE_KEY` di `.env` harus satu baris dengan `\n`, misalnya:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC...\n-----END PRIVATE KEY-----\n"
```

Saat Firestore aktif, admin seed default akan otomatis dibuat ke collection `admins` saat login pertama jika email `SEED_ADMIN_EMAIL` belum ada.

## Getting Started

Jalankan server development:

```bash
npm install
npm run dev
```

Login default lokal:

- `admin@example.com`
- `admin123`

## Notes

- App Router dipindah ke `src/app`.
- API yang tersedia: `/api/auth/login`, `/api/auth/logout`, `/api/qr`, `/api/barcode`, `/api/validate`.
- Pada environment agent saat pengerjaan, binary `node` Linux tidak tersedia, jadi `npm install`, lint, dan build belum bisa diverifikasi langsung dari sini.
# iot_barcode
