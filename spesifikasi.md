# Spesifikasi Fitur Aplikasi Business Model Canvas

## Ringkasan Proyek
- Aplikasi Next.js 16 (App Router) yang membantu pengguna menghasilkan Business Model Canvas (BMC) secara otomatis dari deskripsi ide bisnis.
- Halaman utama sepenuhnya berupa client component (`src/app/page.js`) karena memanfaatkan state React dan interaksi browser (fetch, Blob download).
- Backend hanya terdiri dari satu endpoint API (`src/app/api/bmc/route.js`) yang meneruskan prompt terstruktur ke OpenAI GPT-4o-mini dan memvalidasi respons JSON yang berisi seluruh blok BMC.

## Tumpukan Teknologi
- **Framework**: Next.js 16 dengan fitur App Router, React 19, dan serverless API Routes.
- **Styling**: Tailwind CSS 4 (melalui `@import "tailwindcss"` dalam `globals.css`) dipadukan dengan styling inline class berbasis warna bernuansa merah marun.
- **Font**: `Geist` dan `Geist_Mono` dari `next/font/google` dikonfigurasi di `src/app/layout.js`.
- **Ikon**: Paket `lucide-react` menyediakan ikon Sparkles, Loader2, Download, dan RefreshCw.
- **AI Provider**: OpenAI Chat Completions API (`gpt-4o-mini`) dengan format respons `json_object`.

## Arsitektur Modul
### Halaman Utama (`src/app/page.js`)
- Mendefinisikan state utama: `businessIdea`, `loading`, `bmcData`, dan `error`.
- Fungsi `generateBMC` memanggil endpoint `/api/bmc` dengan ide bisnis lalu menyimpan hasil ke `bmcData`.
- Fungsi `downloadBMC` membuat file `.txt` yang merangkum seluruh blok BMC menggunakan API Blob/URL DOM.
- Fungsi `reset` mengembalikan state ke kondisi awal tanpa reload halaman.
- Komponen `BMCBlock` merupakan komponen internal untuk merender setiap blok BMC dengan judul, warna, dan daftar poin.

### Endpoint AI (`src/app/api/bmc/route.js`)
- Menerima request `POST` dengan body `{ idea: string }`.
- Menvalidasi keberadaan environment variable `OPENAI_API_KEY`, validitas JSON body, serta memastikan `idea` tidak kosong.
- Menyusun prompt yang mewajibkan OpenAI mengirim satu objek JSON dengan 9 array (elemen BMC). Menggunakan `response_format: { type: 'json_object' }` untuk memastikan struktur valid.
- Mengirim request ke `https://api.openai.com/v1/chat/completions` menggunakan model `gpt-4o-mini`, `temperature: 0.2`, dan `max_tokens: 1200`.
- Menangani berbagai kegagalan: HTTP tidak OK dari OpenAI, isi pesan kosong, atau JSON parsing gagal. Semua error dibungkus `NextResponse.json` dengan pesan berbahasa Indonesia.

### Layout & Styling Global
- `src/app/layout.js` memasukkan font dan menerapkan kelas `antialiased` pada `<body>`.
- `src/app/globals.css` mendefinisikan variabel CSS untuk warna terang/gelap dan memanfaatkan kemampuan tema inline Tailwind.

## Alur Fungsional Pengguna
1. Pengguna membuka halaman utama dan membaca hero section yang menjelaskan manfaat AI Business Model Canvas Generator.
2. Pengguna mengisi textarea "Deskripsikan Ide Bisnis Anda".
3. Saat menekan tombol "Generate Business Model Canvas":
   - Jika textarea kosong, muncul pesan kesalahan "Mohon masukkan deskripsi ide bisnis Anda."
   - Jika valid, state `loading` aktif, tombol menampilkan spinner `Loader2`, dan request dikirim ke API.
4. Ketika API merespons sukses:
   - Ide bisnis ditampilkan kembali.
   - Grid Business Model Canvas ditampilkan menggunakan 9 blok standar.
   - Tombol aksi "Download BMC" dan "Buat Baru" muncul.
5. Pengguna dapat:
   - Mengunduh ringkasan BMC dalam format teks.
   - Mengulangi proses menggunakan tombol "Buat Baru" yang mereset state.

## Detail Fitur UI/UX
- **Validasi Input**: Trim string, wajib minimal satu karakter, feedback ditampilkan inline pada kartu input.
- **Indikator Loading**: Tombol generate berubah menjadi status loading dengan animasi spinner dan teks progres.
- **Grid Responsif**: 
  - Layout BMC menggunakan kombinasi grid 5 kolom untuk desktop dan tumpukan vertikal di layar kecil.
  - Blok "Key Activities/Resources" dan "Customer Relationships/Channels" digabung dalam kolom bertumpuk sesuai struktur BMC.
- **Tipografi & Warna**: Palet gradasi merah marun dengan background gradient, card kaca (`bg-white/90`), serta heading uppercase.
- **Download BMC**: File `.txt` berisi daftar bernomor untuk setiap blok, termasuk ide bisnis asli di bagian atas.
- **Reset State**: Tombol "Buat Baru" menghapus hasil tanpa reload, memudahkan eksperimen ide.

## API Internal `/api/bmc`
- **Metode**: `POST`
- **Body**:
  ```json
  { "idea": "Deskripsi ide bisnis panjang" }
  ```
- **Respons Berhasil**:
  ```json
  {
    "canvas": {
      "keyPartners": ["..."],
      "keyActivities": ["..."],
      "keyResources": ["..."],
      "valuePropositions": ["..."],
      "customerRelationships": ["..."],
      "channels": ["..."],
      "customerSegments": ["..."],
      "costStructure": ["..."],
      "revenueStreams": ["..."]
    }
  }
  ```
- **Kode Error yang Mungkin**:
  - `400`: Body tidak valid atau ide kosong.
  - `500`: Variabel lingkungan tidak diset, respons OpenAI tidak valid, atau kesalahan parsing.
  - Status dari OpenAI diteruskan ketika fetch gagal (ditambah detail teks dari API).

## Manajemen Status & Data
- `initialState` memastikan semua blok BMC terdefinisi (array kosong) sebelum data aktual tiba.
- `setBmcData` selalu menggabungkan `initialState` dengan respons untuk mencegah field undefined.
- Error disimpan dalam `error` dan dapat muncul bersamaan dengan `bmcData` (mis. jika fetch sukses tapi download error, meski saat ini error utama berasal dari API).

## Penanganan Error & UX Aman
- Validasi sisi klien dan server menjaga API tidak menerima input kosong.
- Semua error API dikomunikasikan ke pengguna dengan bahasa Indonesia dan styling alert merah.
- `try/catch` di sisi klien mengantisipasi masalah jaringan, JSON parsing, atau error tak terduga lainnya.
- `URL.revokeObjectURL` dipanggil setelah download untuk mencegah kebocoran memori.

## Konfigurasi & Ketergantungan
- **Environment**: `OPENAI_API_KEY` wajib ada di `.env.local`. Nilai tidak dibundel ke client karena pemanggilan ke OpenAI dilakukan di sisi server.
- **Script npm**:
  - `npm run dev`: `next dev --webpack`
  - `npm run build`: `next build --webpack`
  - `npm start`: Menjalankan hasil build.
  - `npm run lint`: Memakai konfigurasi ESLint Next.js.
- **Dependencies**:
  - `next@16.0.1`, `react@19.2.0`, `react-dom@19.2.0`
  - `lucide-react` untuk ikon.
  - Dev: `tailwindcss@^4`, `@tailwindcss/postcss`, `eslint@^9`, `eslint-config-next`.

## Pertimbangan Keamanan & Batasan
- API key hanya diakses di server; tidak pernah diteruskan ke klien.
- Tidak ada penyimpanan persistensi; setiap request BMC baru akan menggantikan data lama.
- Aplikasi bergantung penuh pada ketersediaan OpenAI API; jika model gagal, aplikasi tidak menyediakan fallback.
- Tidak ada batasan panjang input maupun sanitasi tambahan selain trim; jika input sangat panjang, biaya token meningkat dan waktu respons bertambah.

## Ide Pengembangan Lanjutan (Opsional)
1. Menyimpan riwayat BMC sehingga pengguna bisa membandingkan beberapa ide.
2. Menyediakan opsi unduhan PDF atau CSV untuk mempermudah berbagi.
3. Menambah parameter konfigurasi (mis. jumlah poin per blok) agar pengguna dapat mengendalikan detail dari AI.
4. Menambahkan penjelasan tooltips untuk setiap blok BMC agar pengguna baru memahami konteksnya.

