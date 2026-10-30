# Challange_Pemweb_C-15

Backend API untuk Challenge Pemrograman Web C-15 menggunakan Express.js, TypeScript, Prisma ORM, dan PostgreSQL (Neon).

---

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma Client & Prisma Migrate
- **Database**: PostgreSQL (Neon Serverless)

---

## 🚀 Setup & Instalasi

1. **Clone repositori**:
   ```bash
   git clone https://github.com/akdnhapiz-netizen/Challange_Pemweb_C-15.git
   cd Challange_Pemweb_C-15
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment**:
   Salin file `.env.example` menjadi `.env`, lalu masukkan connection string PostgreSQL / Neon database:
   ```env
   DATABASE_URL="postgresql://<user>:<password>@<neon-host>/<database>?sslmode=require"
   PORT=3000
   ```

4. **Jalankan Migrasi Database**:
   ```bash
   npx prisma migrate dev --name add-comment
   npx prisma generate
   ```

5. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Server akan berjalan di `http://localhost:3000`.

6. **Build & Start Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📦 Skema Prisma (`prisma/schema.prisma`)

### Model `Comment`
- `id`: Int (Primary Key, autoincrement)
- `content`: String
- `postId`: Int (Foreign Key ke `Post`)
- `authorId`: Int (Foreign Key ke `User`)
- `createdAt`: DateTime (default now)
- **Relasi Cascade**:
  - `post`: `relation(fields: [postId], references: [id], onDelete: Cascade)`
  - `author`: `relation(fields: [authorId], references: [id], onDelete: Cascade)`

### Relasi Balik pada `User` dan `Post`
- `User.comments`: `Comment[]`
- `Post.comments`: `Comment[]`

---

## 📡 Daftar Endpoint CRUD Comment (`/api/comments`)

| Method | Endpoint | Deskripsi | Status Code |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/comments` | Membuat komentar baru (`content`, `postId`, `authorId`). Validasi input dan foreign key handling (P2003). | `201 Created` / `400 Bad Request` / `404 Not Found` |
| **GET** | `/api/comments` | Mengambil seluruh komentar diurutkan `createdAt` descending, termasuk info minimal author (`id`, `name`) dan post (`id`, `title`). | `200 OK` |
| **GET** | `/api/comments/:id` | Mengambil detail komentar berdasarkan ID. | `200 OK` / `404 Not Found` |
| **PUT** | `/api/comments/:id` | Mengupdate isi komentar (`content`). | `200 OK` / `400 Bad Request` / `404 Not Found` |
| **DELETE** | `/api/comments/:id` | Menghapus komentar berdasarkan ID. | `200 OK` / `404 Not Found` |

---

## 🧪 Pengujian Cascade Delete
Untuk menguji penghapusan bertingkat (*cascade delete*) di mana saat sebuah `Post` dihapus maka semua `Comment` terkait otomatis ikut terhapus dari database:
```bash
npm run test:cascade
```
