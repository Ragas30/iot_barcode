# Software Design Document (SDD)

# Smart IoT QR & Barcode Authentication System

**Version:** 1.0

---

# 1. Architecture

Sistem menggunakan **Layered Architecture** agar mudah dikembangkan, diuji, dan dipelihara.

```
Client (Browser)
        │
        ▼
Next.js App Router
        │
        ▼
Route Handler (API)
        │
        ▼
Controller
        │
        ▼
Service
        │
        ▼
Repository
        │
        ▼
Firebase Firestore
```

### Architecture Pattern

- Layered Architecture
- Repository Pattern
- Service Pattern
- DTO Pattern
- Middleware Authentication
- Centralized Error Handler

---

# 2. Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- TailwindCSS
- shadcn/ui
- React Hook Form
- Zod

## Backend

- Next.js Route Handler

## Database

- Firebase Firestore

## Authentication

- JWT
- HttpOnly Cookie
- bcrypt

## QR & Barcode

- qrcode
- bwip-js

---

# 3. Folder Structure

```text
src/
│
├── app/
│   ├── (auth)/
│   │   └── login/
│   │
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── qr/
│   │   └── barcode/
│   │
│   ├── api/
│   │   ├── auth/
│   │   ├── qr/
│   │   ├── barcode/
│   │   └── validate/
│   │
│   └── layout.tsx
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── forms/
│   └── common/
│
├── services/
│
├── repositories/
│
├── validators/
│
├── middleware/
│
├── hooks/
│
├── types/
│
├── utils/
│
├── lib/
│   ├── firebase.ts
│   ├── jwt.ts
│   ├── bcrypt.ts
│   ├── logger.ts
│   └── response.ts
│
└── constants/
```

---

# 4. Layer Responsibility

## Route Handler

Bertugas menerima HTTP Request.

Tidak boleh terdapat business logic.

Hanya:

- Parse Request
- Call Controller
- Return Response

---

## Controller

Bertugas

- menerima request
- validasi awal
- memanggil service
- mengembalikan response

---

## Service

Berisi seluruh business logic.

Contoh

- Generate Token
- Generate QR
- Generate Barcode
- Login
- Validasi Expired
- Validasi JWT

---

## Repository

Hanya berkomunikasi dengan Firestore.

Contoh

- Create
- Update
- Delete
- Find
- FindByToken

Tidak boleh ada business logic.

---

# 5. Authentication Flow

```
Login

↓

Validate Request

↓

Cari Admin

↓

Compare Password

↓

Generate JWT

↓

Store HttpOnly Cookie

↓

Redirect Dashboard
```

---

# 6. Middleware Flow

```
Request

↓

Middleware

↓

JWT Valid?

↓

YA

↓

Continue

↓

TIDAK

↓

Redirect Login
```

---

# 7. QR Generation Flow

```
Klik Generate

↓

Generate UUID

↓

Generate Random Token

↓

ExpiredAt = Now + 1 Minute

↓

Save Firestore

↓

Generate QR Image

↓

Return Client
```

QR Image **tidak disimpan** ke Firestore.

Yang disimpan hanya metadata.

---

# 8. Barcode Generation Flow

Sama seperti QR.

Output menggunakan barcode.

---

# 9. IoT Validation Flow

```
IoT Scan

↓

GET /api/validate

↓

Cari Token

↓

Tidak Ada

↓

404

↓

Ada

↓

Expired?

↓

YA

↓

410 Gone

↓

Belum

↓

200 Success
```

---

# 10. Firestore Structure

## Collection

### admins

| Field | Type |
|---------|------|
| id | string |
| name | string |
| email | string |
| password | string |
| createdAt | timestamp |

---

### tokens

| Field | Type |
|---------|------|
| id | string |
| name | string |
| token | string |
| type | qr/barcode |
| status | active/expired |
| createdAt | timestamp |
| expiredAt | timestamp |

---

# 11. Coding Standard

Semua developer wajib mengikuti aturan berikut.

## Wajib

- TypeScript Strict
- ESLint
- Prettier
- Async Await
- Zod Validation
- Repository Pattern
- Service Pattern

---

## Dilarang

- Business Logic di Route Handler
- Query Firestore langsung dari UI
- Hardcode Secret
- Return Error mentah dari Firebase

---

# 12. API Response Standard

## Success

```json
{
  "success": true,
  "message": "QR berhasil dibuat.",
  "data": {}
}
```

---

## Error

```json
{
  "success": false,
  "message": "Terjadi kesalahan.",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

---

# 13. Error Handling

Semua endpoint menggunakan Global Error Handler.

Hierarchy

```
AppError

│

├── ValidationError

├── AuthenticationError

├── AuthorizationError

├── NotFoundError

├── ConflictError

├── DatabaseError

└── InternalServerError
```

---

# 14. HTTP Status

| Code | Description |
|------|-------------|
|200|Success|
|201|Created|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|410|Expired|
|422|Validation Error|
|429|Too Many Request|
|500|Internal Server Error|

---

# 15. Logging

Semua error dicatat.

Minimal

- Timestamp
- Request ID
- Endpoint
- Method
- User
- Error Code
- Status
- Stack Trace (Development)

---

# 16. UI Components

Reusable Components

- Sidebar
- Navbar
- Dashboard Card
- Data Table
- QR Card
- Barcode Card
- Modal
- Dialog
- Confirm Delete
- Loading
- Empty State
- Error State
- Toast
- Pagination
- Search Bar

---

# 17. Security

- Password menggunakan bcrypt
- JWT HttpOnly Cookie
- Middleware Authentication
- Rate Limiting
- Input Validation (Zod)
- Firebase Rules
- Environment Variable
- Server Side Validation

---

# 18. Development Roadmap

## Phase 1

- Project Setup
- Firebase
- Authentication
- Seed Admin

---

## Phase 2

- Dashboard
- QR CRUD
- Barcode CRUD

---

## Phase 3

- Validate API
- Middleware
- Global Error Handler

---

## Phase 4

- Responsive UI
- Testing
- Documentation

---

# 19. Definition of Done (DoD)

Project dianggap selesai apabila:

- Login berjalan dengan JWT
- Middleware aktif
- Dashboard selesai
- Generate QR berhasil
- Generate Barcode berhasil
- Token otomatis expired setelah 1 menit
- API Validate berjalan
- Error Handling terstandarisasi
- Logging aktif
- Seed Admin otomatis
- Build tanpa TypeScript Error
- Lulus pengujian manual dan API
- Tampilan Sudah Responsive di semua platfom
