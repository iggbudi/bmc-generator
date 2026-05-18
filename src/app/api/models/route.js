import { NextResponse } from 'next/server';

const ZEN_MODELS_URL = 'https://opencode.ai/zen/v1/models';

export async function GET(request) {
  const zenApiKey = process.env.OPENCODE_ZEN_API_KEY;

  if (!zenApiKey) {
    return NextResponse.json(
      { error: 'Server belum dikonfigurasi dengan OPENCODE_ZEN_API_KEY' },
      { status: 500 }
    );
  }

  // ?filter=free → hanya model gratis, ?filter=all → semua model
  const url = new URL(request.url);
  const filter = url.searchParams.get('filter') || 'free';

  try {
    const response = await fetch(ZEN_MODELS_URL, {
      headers: { Authorization: `Bearer ${zenApiKey}` },
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
    const allModels = data?.data ?? [];

    // Filter model yang Gemini-nya disembunyikan karena belum didukung
    let models = allModels.filter((m) => !m.id?.startsWith('gemini-'));

    if (filter === 'free') {
      models = models.filter((m) => m.id?.toLowerCase().includes('free'));
    }

    return NextResponse.json({ models });
  } catch (err) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal.', detail: err.message },
      { status: 500 }
    );
  }
}
