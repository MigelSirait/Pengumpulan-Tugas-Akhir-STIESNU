# STIESNU - Sistem Informasi Manajemen Tugas Akhir

Front-end Vue.js untuk aplikasi STIESNU (Sistem Informasi Manajemen Tugas Akhir) yang dikonversi dari aplikasi Laravel Blade templates.

## Deskripsi

Aplikasi ini adalah implementasi front-end menggunakan Vue 3 yang meniru tampilan dan fungsionalitas dari aplikasi STIESNU berbasis Laravel. Fokus utama adalah pada dashboard mahasiswa dengan fitur monitoring progress tugas akhir.

## Fitur Utama

- **Dashboard Mahasiswa**: Pantau progress penyelesaian tugas akhir
- **Status Cards**: Overview status Outline, Proposal, Seminar, dan Sidang
- **Progress Tracking**: Visual progress bar dan step-by-step tracking
- **Komentar Dosen**: Panel collapsible untuk komentar dari dosen pembimbing
- **Responsive Design**: Menggunakan Bootstrap 5 untuk layout responsif
- **SB Admin 2 Theme**: Tema admin yang clean dan professional

## Teknologi

- **Vue 3**: Framework JavaScript progresif
- **Vue Router**: Routing untuk single-page application
- **Bootstrap 5**: Framework CSS untuk styling
- **FontAwesome**: Icon library
- **Vite**: Build tool dan development server
- **TypeScript**: Type safety untuk JavaScript

## Struktur Proyek

```
src/
├── components/
│   └── Layout.vue          # Layout utama dengan sidebar
├── views/
│   └── Home.vue            # Halaman dashboard mahasiswa
├── router.ts               # Konfigurasi routing
├── App.vue                 # Root component
└── main.ts                 # Entry point aplikasi
```

## Setup dan Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

3. Buka browser di `http://localhost:5173`

## Build untuk Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Catatan

Aplikasi ini adalah konversi front-end dari template Blade Laravel. Data saat ini menggunakan mock data dan placeholder images. Untuk integrasi dengan backend, perlu ditambahkan:

- API calls menggunakan Axios atau Fetch
- State management (Vuex/Pinia)
- Authentication handling
- Real-time updates untuk progress dan komentar

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## Backend (Node + MySQL / Laragon)

Folder backend berisi service API sederhana yang terhubung ke database MySQL/MariaDB.

1. Buka folder `backend`:
```sh
cd backend
npm install
```
2. Salin `.env.example` ke `.env` dan sesuaikan kredensial database.
3. Buat database `kp_system` dan impor `schema.sql` menggunakan phpMyAdmin atau MySQL dari Laragon.
4. Jalankan backend:
```sh
npm start
```

Backend akan berjalan pada `http://localhost:3000`.

Frontend login sekarang akan memanggil endpoint `POST /api/login` di backend.
