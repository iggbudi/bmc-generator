import { NextResponse } from 'next/server';

const ZEN_MODELS_URL = 'https://opencode.ai/zen/v1/models';

export async function GET() {
  const zenApiKey = process.env.OPENCODE_ZEN_API_KEY;

  if (!zenApiKey) {
    return NextResponse.json(
      { error: 'Server belum dikonfigurasi dengan OPENCODE_ZEN_API_KEY' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(ZEN_MODELS_URL, {
      headers: {
        Authorization: `Bearer ${zenApiKey}`,
      },
      // Cache selama 5 menit agar tidak terlalu sering hit API
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Gagal mengambil daftar model', detail: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Filter hanya model yang mengandung kata "free" (case-insensitive)
    const allModels = data?.data ?? [];
    const freeModels = allModels.filter((m) =>
      m.id?.toLowerCase().includes('free')
    );

    return NextResponse.json({ models: freeModels });
  } catch (err) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal.', detail: err.message },
      { status: 500 }
    );
  }
}
