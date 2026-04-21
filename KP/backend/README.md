# Backend STIESNU

Backend ini adalah server Node.js sederhana yang terhubung ke MySQL/MariaDB. Backend menyediakan endpoint untuk login serta data `admin`, `staf`, dan `mahasiswa`.

## Setup

1. Instal dependencies:

```bash
cd backend
npm install
```

2. Salin file `.env.example` menjadi `.env` dan sesuaikan pengaturan database.

```bash
copy .env.example .env
```

3. Buat database di Laragon dan impor schema:

- Buka `http://localhost/phpmyadmin`
- Jalankan `backend/schema.sql`

4. Jalankan backend:

```bash
npm start
```

5. Backend akan tersedia di `http://localhost:3000`

## Endpoint

- `POST /api/login` - login dengan `username` dan `password`
- `GET /api/mahasiswa` - daftar data mahasiswa
- `GET /api/staf` - daftar data staf
- `GET /api/admin` - daftar data admin
- `GET /api/health` - status service

## Laragon

Jika menggunakan Laragon, pastikan MySQL berjalan dan database `kp_system` sudah dibuat. Default credential Laragon biasanya:

- Host: `127.0.0.1`
- Port: `3306`
- User: `root`
- Password: kosong

Jika Anda menggunakan Laragon dengan server http yang berbeda, backend Node.js tetap dapat berjalan berdampingan selama database terhubung ke MySQL Laragon.
