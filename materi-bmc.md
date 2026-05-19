# Materi Kuliah: Membangun AI Business Model Canvas Generator

**Mata Kuliah:** Kewirausahaan Digital & Pemrograman Web  
**Topik:** Integrasi Large Language Model (LLM) dalam Aplikasi Bisnis  
**Studi Kasus:** BMC Generator — [bmc-generator.vercel.app](https://github.com/iggbudi/bmc-generator)

---

## 1. Apa Itu Business Model Canvas (BMC)?

Business Model Canvas adalah kerangka kerja visual satu halaman yang menggambarkan bagaimana sebuah bisnis menciptakan, menyampaikan, dan menangkap nilai. Dikembangkan oleh Alexander Osterwalder, BMC terdiri dari **9 blok** yang saling berkaitan:

| No | Blok | Pertanyaan Kunci |
|----|------|-----------------|
| 1 | **Key Partners** (Mitra Kunci) | Siapa mitra dan pemasok utama kita? |
| 2 | **Key Activities** (Aktivitas Kunci) | Apa yang harus kita lakukan agar bisnis berjalan? |
| 3 | **Key Resources** (Sumber Daya Kunci) | Aset apa yang kita butuhkan? |
| 4 | **Value Propositions** (Proposisi Nilai) | Nilai apa yang kita tawarkan ke pelanggan? |
| 5 | **Customer Relationships** (Hubungan Pelanggan) | Bagaimana kita berinteraksi dengan pelanggan? |
| 6 | **Channels** (Saluran) | Bagaimana kita menjangkau pelanggan? |
| 7 | **Customer Segments** (Segmen Pelanggan) | Siapa pelanggan kita? |
| 8 | **Cost Structure** (Struktur Biaya) | Apa saja biaya utama bisnis kita? |
| 9 | **Revenue Streams** (Aliran Pendapatan) | Bagaimana bisnis kita menghasilkan uang? |

### Visualisasi Tata Letak BMC

```
┌─────────────┬──────────────┬──────────────┬──────────────┬─────────────┐
│             │ Key          │              │ Customer     │             │
│ Key         │ Activities   │    Value     │ Relationships│  Customer   │
│ Partners    ├──────────────│  Propositions│              │  Segments   │
│             │ Key          │              │ Channels     │             │
│             │ Resources    │              │              │             │
├─────────────┴──────────────┴──────────────┴──────────────┴─────────────┤
│         Cost Structure                  │      Revenue Streams          │
└─────────────────────────────────────────┴───────────────────────────────┘
```

---

## 2. Mengapa BMC Penting bagi Bisnis?

BMC bukan sekadar dokumen — ia adalah **alat berpikir strategis** yang digunakan oleh startup, UMKM, hingga perusahaan besar.

### Manfaat Utama

**Visibilitas menyeluruh dalam satu halaman**
Dibanding business plan tradisional yang bisa puluhan halaman, BMC merangkum seluruh model bisnis dalam satu tampilan. Semua pemangku kepentingan bisa langsung memahami gambaran besar.

**Alat komunikasi tim**
BMC menjadi bahasa bersama antara founder, investor, dan tim. Semua orang melihat dokumen yang sama dan bisa berdiskusi dari titik yang sama.

**Iterasi cepat**
Karena ringkas, BMC mudah direvisi. Ketika asumsi bisnis terbukti salah, kita bisa mengubah satu blok tanpa menulis ulang seluruh dokumen.

**Validasi ide sebelum eksekusi**
Sebelum menginvestasikan waktu dan uang, BMC membantu mengidentifikasi apakah model bisnis sudah koheren — apakah value proposition sesuai dengan customer segment, apakah revenue stream cukup menutup cost structure.

**Standar industri**
BMC digunakan di program akselerator, pitch ke investor, dan kurikulum kewirausahaan di seluruh dunia.

---

## 3. Masalah dalam Pembuatan BMC

Meskipun konsepnya sederhana, dalam praktik banyak orang kesulitan membuat BMC yang baik.

### Hambatan Umum

**Tidak tahu harus mulai dari mana**
Banyak pemula bingung mengisi blok pertama. Apakah mulai dari customer segment atau value proposition? Kesalahan urutan bisa membuat BMC tidak koheren.

**Isian terlalu umum dan tidak spesifik**
Contoh buruk: *"Key Partners: supplier"* — ini tidak memberikan informasi apapun. BMC yang baik harus spesifik dan actionable.

**Blok-blok tidak saling terhubung**
BMC bukan 9 pertanyaan terpisah. Value proposition harus menjawab kebutuhan customer segment. Revenue stream harus realistis terhadap cost structure. Banyak orang mengisi tiap blok secara terpisah tanpa melihat keterkaitan.

**Membutuhkan pengetahuan bisnis yang luas**
Untuk mengisi blok seperti *Key Activities* atau *Revenue Streams* dengan tepat, dibutuhkan pemahaman tentang industri, kompetitor, dan model bisnis yang relevan.

**Proses yang memakan waktu**
Membuat BMC yang komprehensif bisa memakan waktu berjam-jam, terutama untuk ide bisnis yang kompleks.

---

## 4. Mengapa BMC Generator Menjadi Solusi?

AI BMC Generator hadir untuk menjawab semua hambatan di atas dengan memanfaatkan kemampuan Large Language Model (LLM).

### Bagaimana AI Membantu

| Masalah | Solusi AI |
|---------|-----------|
| Tidak tahu mulai dari mana | Cukup deskripsikan ide bisnis dalam bahasa natural |
| Isian terlalu umum | AI menghasilkan poin-poin spesifik berdasarkan konteks bisnis |
| Blok tidak terhubung | LLM memahami keterkaitan antar blok secara holistik |
| Butuh pengetahuan luas | AI dilatih dari jutaan dokumen bisnis dan studi kasus |
| Proses lama | Hasil lengkap dalam hitungan detik |

### Nilai Tambah Aplikasi Ini

- **Bilingual** — mendukung Bahasa Indonesia dan Inggris
- **Pilihan model AI** — dari model gratis hingga berbayar sesuai kebutuhan
- **Export multi-format** — TXT, PDF, dan CSV untuk berbagai keperluan
- **Dapat diakses siapa saja** — berbasis web, tidak perlu install apapun

---

## 5. Apa Saja yang Dibutuhkan untuk Membuat BMC Generator?

### Teknologi yang Digunakan

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  Next.js 16 + React 19 + Tailwind CSS 4             │
│  lucide-react (ikon) · jsPDF · html2canvas          │
│  papaparse (CSV)                                     │
├─────────────────────────────────────────────────────┤
│                    BACKEND                           │
│  Next.js API Routes (Serverless Functions)           │
│  /api/bmc  →  generate BMC                          │
│  /api/models  →  fetch daftar model                 │
├─────────────────────────────────────────────────────┤
│                    AI PROVIDER                       │
│  OpenCode Zen (https://opencode.ai/zen/v1)          │
│  Multi-provider: OpenAI · Anthropic · OpenAI-compat │
├─────────────────────────────────────────────────────┤
│                    DEPLOYMENT                        │
│  GitHub (version control) + Vercel (hosting)        │
└─────────────────────────────────────────────────────┘
```

### Struktur Folder Project

```
bmc-generator/
├── src/
│   ├── app/
│   │   ├── page.js              ← UI utama (client component)
│   │   ├── layout.js            ← Root layout + font
│   │   ├── globals.css          ← Tailwind CSS global
│   │   └── api/
│   │       ├── bmc/
│   │       │   └── route.js     ← POST /api/bmc
│   │       └── models/
│   │           └── route.js     ← GET /api/models
│   └── lib/
│       └── translations.js      ← Teks UI ID/EN
├── public/
│   └── logo.jpg
├── .env.local                   ← API key (TIDAK di-commit)
├── package.json
└── next.config.mjs
```

### Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "16.0.10",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "lucide-react": "^0.553.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "papaparse": "^5.4.1"
  },
  "devDependencies": {
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.0.1"
  }
}
```

---

## 6. Bagaimana Cara Menggunakan OpenCode Zen sebagai Otak LLM

### Apa Itu OpenCode Zen?

OpenCode Zen adalah AI gateway dari [opencode.ai](https://opencode.ai) yang menyediakan akses ke berbagai model LLM terbaik melalui satu API key. Keunggulannya:

- Satu API key untuk semua model (GPT, Claude, DeepSeek, Qwen, dll.)
- Tersedia model **gratis** untuk penggunaan terbatas
- Endpoint kompatibel dengan format OpenAI

### Mendapatkan API Key

1. Buka [https://opencode.ai/auth](https://opencode.ai/auth)
2. Login dengan akun GitHub atau email
3. Tambahkan billing details (kartu kredit, untuk model berbayar)
4. Copy API key yang dihasilkan (format: `sk_live_...`)
5. Simpan di file `.env.local`:

```bash
OPENCODE_ZEN_API_KEY=sk_live_xxxxxxxxxxxxxxxx
```

> **Penting:** File `.env.local` TIDAK boleh di-commit ke GitHub. Pastikan ada di `.gitignore`.

### Endpoint OpenCode Zen

OpenCode Zen memiliki 3 endpoint berbeda tergantung family model:

| Endpoint | Digunakan untuk |
|----------|----------------|
| `https://opencode.ai/zen/v1/chat/completions` | DeepSeek, Qwen, MiniMax, GLM, Kimi, Nemotron, Big Pickle |
| `https://opencode.ai/zen/v1/messages` | Claude (Anthropic) |
| `https://opencode.ai/zen/v1/responses` | GPT (OpenAI) |
| `https://opencode.ai/zen/v1/models` | Fetch daftar semua model |

### Model Gratis yang Tersedia

| Model ID | Nama |
|----------|------|
| `deepseek-v4-flash-free` | DeepSeek V4 Flash Free |
| `minimax-m2.5-free` | MiniMax M2.5 Free |
| `nemotron-3-super-free` | Nemotron 3 Super Free |
| `big-pickle` | Big Pickle |

### Implementasi di Kode

#### Routing per Provider (`src/app/api/bmc/route.js`)

```javascript
const ZEN_BASE = 'https://opencode.ai/zen/v1';

// Tentukan endpoint berdasarkan nama model
function getProvider(model) {
  if (model.startsWith('gpt-'))    return 'openai-responses';
  if (model.startsWith('claude-')) return 'anthropic';
  return 'openai-compat'; // DeepSeek, Qwen, MiniMax, dll.
}
```

#### Memanggil API untuk Model OpenAI-Compatible

```javascript
async function callOpenAICompat(model, system, user, key) {
  return fetch(`${ZEN_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 10000,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
}
```

#### Memanggil API untuk Claude (Anthropic)

```javascript
async function callAnthropic(model, system, user, key) {
  return fetch(`${ZEN_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'anthropic-version': '2023-06-01',
      'x-api-key': key,
    },
    body: JSON.stringify({
      model,
      max_tokens: 10000,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
}
```

#### Menyusun Prompt yang Efektif

Kunci agar LLM mengembalikan JSON yang valid adalah **prompt engineering** yang ketat:

```javascript
const SYSTEM_PROMPT =
  'You are an expert business analyst. Always respond with ONLY a valid JSON object. ' +
  'No markdown, no code fences, no extra text. Start with { and end with }.';

function buildUserPrompt(idea, language) {
  return `Generate a Business Model Canvas based on this business description.

Business Description: ${idea}

Use this exact JSON structure with 3-5 specific items per array:
{
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

Respond with ONLY the JSON. No explanation, no markdown.`;
}
```

#### Mengambil Daftar Model (`src/app/api/models/route.js`)

```javascript
const res = await fetch('https://opencode.ai/zen/v1/models', {
  headers: { Authorization: `Bearer ${zenApiKey}` },
});
const data = await res.json();

// Filter hanya model gratis
const freeModels = data.data.filter(m => m.id.includes('free'));
```

### Alur Data Lengkap

```
User ketik ide bisnis
        │
        ▼
page.js: generateBMC()
        │  POST /api/bmc
        │  { idea, language, model }
        ▼
route.js: getProvider(model)
        │
        ├─ openai-compat ──► POST /zen/v1/chat/completions
        ├─ anthropic ──────► POST /zen/v1/messages
        └─ openai-responses ► POST /zen/v1/responses
                │
                ▼
        extractContent(data, provider)
                │
                ▼
        extractJSON(content)
                │
                ▼
        { canvas: { keyPartners, keyActivities, ... } }
                │
                ▼
        page.js: setBmcData(canvas)
                │
                ▼
        Render 9 blok BMC di UI
```

---

## 7. Cara Mengunggah ke GitHub

### Persiapan Awal (Sekali Saja)

1. Buat akun di [github.com](https://github.com)
2. Install [GitHub Desktop](https://desktop.github.com) atau Git CLI
3. Buat repository baru di GitHub:
   - Klik **New repository**
   - Nama: `bmc-generator`
   - Visibility: **Public** (agar bisa di-deploy gratis di Vercel)
   - Jangan centang "Initialize with README"
   - Klik **Create repository**

### Pastikan `.gitignore` Sudah Benar

File `.gitignore` harus mengecualikan file sensitif dan folder yang tidak perlu:

```gitignore
# Dependencies
/node_modules

# Next.js build output
/.next/
/out/

# Environment variables (JANGAN di-commit!)
.env*

# Vercel
.vercel
```

> **Perhatian:** Baris `.env*` memastikan `.env.local` yang berisi API key tidak pernah ter-upload ke GitHub.

### Langkah Upload via Git CLI

```bash
# 1. Masuk ke folder project
cd C:\laragon\www\bmc

# 2. Inisialisasi Git (jika belum)
git init

# 3. Hubungkan ke repository GitHub
git remote add origin https://github.com/username/bmc-generator.git

# 4. Tambahkan semua file ke staging
git add .

# 5. Buat commit pertama
git commit -m "feat: initial commit - AI BMC Generator"

# 6. Push ke GitHub
git push -u origin master
```

### Workflow Setelah Ada Perubahan

```bash
# Lihat file yang berubah
git status

# Tambahkan file tertentu (lebih aman dari git add .)
git add src/app/api/bmc/route.js
git add src/app/page.js

# Commit dengan pesan deskriptif
git commit -m "fix: improve JSON parsing for free models"

# Push ke GitHub
git push
```

### Konvensi Pesan Commit

Gunakan format **Conventional Commits** agar riwayat mudah dibaca:

| Prefix | Digunakan untuk |
|--------|----------------|
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `chore:` | Perubahan konfigurasi/tooling |
| `docs:` | Perubahan dokumentasi |
| `refactor:` | Refactoring kode |

Contoh: `feat: add model selector with free/paid badge`

---

## 8. Cara Deploy ke Vercel

Vercel adalah platform hosting yang dirancang khusus untuk Next.js. Deploy bisa dilakukan dalam hitungan menit.

### Langkah Deploy

**1. Buat akun Vercel**
- Buka [vercel.com](https://vercel.com)
- Klik **Sign Up** → pilih **Continue with GitHub**
- Authorize Vercel untuk mengakses repository GitHub

**2. Import Project**
- Di dashboard Vercel, klik **Add New → Project**
- Pilih repository `bmc-generator` dari daftar
- Klik **Import**

**3. Konfigurasi Build**
Vercel otomatis mendeteksi Next.js. Tidak perlu mengubah apapun:
- Framework Preset: **Next.js** (otomatis)
- Build Command: `npm run build` (otomatis)
- Output Directory: `.next` (otomatis)

**4. Tambahkan Environment Variable**

> **Ini langkah krusial.** File `.env.local` tidak ikut di-push ke GitHub, jadi Vercel tidak tahu API key-nya. Harus diset manual.

- Klik **Environment Variables**
- Tambahkan:
  - **Key:** `OPENCODE_ZEN_API_KEY`
  - **Value:** `sk_live_xxxxxxxxxxxxxxxx` (API key dari OpenCode Zen)
  - **Environment:** centang `Production` dan `Preview`
- Klik **Save**

**5. Deploy**
- Klik **Deploy**
- Tunggu 1-3 menit hingga build selesai
- Vercel akan memberikan URL seperti: `https://bmc-generator.vercel.app`

### Auto-Deploy untuk Setiap Push

Setelah setup awal, setiap kali kamu `git push` ke branch `master`, Vercel otomatis:
1. Mendeteksi perubahan di GitHub
2. Menjalankan `npm run build`
3. Deploy versi baru ke production

```
git push → GitHub → Vercel webhook → Build → Deploy otomatis
```

### Jika Ada Error Setelah Deploy

**Error: "Server belum dikonfigurasi dengan OPENCODE_ZEN_API_KEY"**
→ Environment variable belum diset atau belum redeploy setelah diset.
→ Solusi: Settings → Environment Variables → tambahkan key → Deployments → Redeploy

**Error: "Respons bukan JSON yang valid"**
→ Model yang dipilih mengembalikan format berbeda dari yang diharapkan.
→ Solusi: Coba model lain, atau lihat detail error yang ditampilkan di UI.

**Build gagal di Vercel tapi berhasil di lokal**
→ Biasanya karena perbedaan versi Node.js atau dependency yang tidak ter-lock.
→ Solusi: Pastikan `package-lock.json` ikut di-commit.

---

## Ringkasan Alur Kerja Keseluruhan

```
1. IDEA
   Deskripsikan ide bisnis dalam bahasa natural
        │
        ▼
2. DEVELOPMENT (Lokal)
   Next.js + React + Tailwind CSS
   API key di .env.local
   npm run dev → http://localhost:3000
        │
        ▼
3. VERSION CONTROL
   git add → git commit → git push
   (API key TIDAK ikut push)
        │
        ▼
4. HOSTING
   Vercel import dari GitHub
   Set OPENCODE_ZEN_API_KEY di dashboard
   Auto-deploy setiap push
        │
        ▼
5. PRODUCTION
   https://bmc-generator.vercel.app
   User input ide → AI generate BMC → Download PDF/CSV/TXT
```

---

## Latihan

1. **Eksplorasi BMC Manual** — Pilih satu bisnis yang kamu kenal (warung makan, toko online, dll.) dan isi 9 blok BMC secara manual. Bandingkan hasilnya dengan output AI Generator.

2. **Modifikasi Prompt** — Ubah `buildUserPrompt()` di `route.js` agar AI menghasilkan minimal 7 poin per blok (bukan 3-5). Amati perbedaan kualitas output.

3. **Tambah Model Baru** — Daftarkan akun OpenCode Zen, dapatkan API key, dan coba semua model gratis yang tersedia. Catat perbedaan kualitas dan kecepatan respons.

4. **Deploy Sendiri** — Fork repository ini, buat perubahan kecil (misalnya ubah warna tema), push ke GitHub, dan deploy ke akun Vercel milikmu sendiri.

5. **Analisis Kode** — Jelaskan mengapa `extractJSON()` perlu menangani 3 kasus berbeda (JSON langsung, code fence, dan pencarian `{ }`). Apa yang terjadi jika hanya mengandalkan `JSON.parse()` langsung?

---

## Referensi

- [Business Model Canvas — Strategyzer](https://www.strategyzer.com/library/the-business-model-canvas)
- [OpenCode Zen Documentation](https://opencode.ai/docs/zen/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Source Code Project](https://github.com/iggbudi/bmc-generator)
