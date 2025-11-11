import { NextResponse } from 'next/server';

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

export async function POST(request) {
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!openAiKey) {
    return NextResponse.json(
      { error: 'Server belum dikonfigurasi dengan OPENAI_API_KEY' },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Body request tidak valid' },
      { status: 400 }
    );
  }

  const idea = body?.idea?.trim();
  if (!idea) {
    return NextResponse.json(
      { error: 'Mohon kirimkan deskripsi ide bisnis.' },
      { status: 400 }
    );
  }

  const prompt = `Berdasarkan deskripsi bisnis berikut, buatkan Business Model Canvas yang lengkap dan detail dalam format JSON.

Deskripsi Bisnis: ${idea}

PENTING: Respons Anda HARUS HANYA berupa satu objek JSON yang valid. JANGAN menambahkan teks apa pun di luar struktur JSON. JANGAN gunakan backticks atau markdown.

Format JSON yang harus Anda gunakan:
{
  "keyPartners": ["partner 1", "partner 2", "..."],
  "keyActivities": ["aktivitas 1", "aktivitas 2", "..."],
  "keyResources": ["sumber daya 1", "sumber daya 2", "..."],
  "valuePropositions": ["proposisi nilai 1", "proposisi nilai 2", "..."],
  "customerRelationships": ["hubungan 1", "hubungan 2", "..."],
  "channels": ["channel 1", "channel 2", "..."],
  "customerSegments": ["segmen 1", "segmen 2", "..."],
  "costStructure": ["biaya 1", "biaya 2", "..."],
  "revenueStreams": ["pendapatan 1", "pendapatan 2", "..."]
}

Berikan analisis yang mendalam dan spesifik untuk setiap elemen. Setiap array harus berisi 3-5 poin yang relevan dan detail.`;

  try {
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.2,
        max_tokens: 1200,
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Gagal menghubungi OpenAI', detail: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return NextResponse.json(
        { error: 'Format respons OpenAI tidak dikenali.' },
        { status: 500 }
      );
    }

    let canvas;
    try {
      canvas = JSON.parse(content);
    } catch (err) {
      return NextResponse.json(
        { error: 'Respons OpenAI bukan JSON yang valid.', detail: err.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ canvas });
  } catch (err) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal.', detail: err.message },
      { status: 500 }
    );
  }
}
