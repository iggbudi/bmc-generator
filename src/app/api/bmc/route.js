import { NextResponse } from 'next/server';

// OpenCode Zen API — compatible with OpenAI chat completions format
const ZEN_URL = 'https://opencode.ai/zen/v1/chat/completions';
const DEFAULT_MODEL = 'deepseek-v4-flash-free';

// Ekstrak content text dari berbagai bentuk respons OpenAI-compatible
function extractContent(data) {
  // Bentuk standar: choices[0].message.content
  let content = data?.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim()) return content.trim();

  // Beberapa model mengembalikan content sebagai array of parts
  if (Array.isArray(content)) {
    const text = content
      .map((p) => (typeof p === 'string' ? p : p?.text || ''))
      .join('');
    if (text.trim()) return text.trim();
  }

  // Bentuk alternatif: choices[0].text
  const altText = data?.choices?.[0]?.text;
  if (typeof altText === 'string' && altText.trim()) return altText.trim();

  // Bentuk alternatif: output_text (responses API format)
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  // Bentuk reasoning models: choices[0].message.reasoning_content
  const reasoning = data?.choices?.[0]?.message?.reasoning_content;
  if (typeof reasoning === 'string' && reasoning.trim()) return reasoning.trim();

  return null;
}

// Ekstrak JSON dari teks yang mungkin mengandung markdown atau teks tambahan
function extractJSON(text) {
  // Coba parse langsung dulu
  try {
    return JSON.parse(text);
  } catch {
    // Cari blok JSON di dalam ```json ... ``` atau ``` ... ```
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1].trim());
      } catch {
        // lanjut ke cara berikutnya
      }
    }

    // Cari objek JSON { ... } terluar (greedy)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // tidak bisa di-parse
      }
    }

    return null;
  }
}

export async function POST(request) {
  const zenApiKey = process.env.OPENCODE_ZEN_API_KEY;

  if (!zenApiKey) {
    return NextResponse.json(
      { error: 'Server belum dikonfigurasi dengan OPENCODE_ZEN_API_KEY' },
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
  const language = body?.language === 'en' ? 'en' : 'id';
  const model = body?.model?.trim() || DEFAULT_MODEL;

  if (!idea) {
    return NextResponse.json(
      {
        error:
          language === 'en'
            ? 'Please provide a business idea description.'
            : 'Mohon kirimkan deskripsi ide bisnis.',
      },
      { status: 400 }
    );
  }

  const promptLanguageInstruction =
    language === 'en'
      ? 'Write all content in English.'
      : 'Tulis seluruh konten dalam Bahasa Indonesia.';

  const prompt = `You are an expert business analyst. Generate a Business Model Canvas based on the business description below.

Business Description: ${idea}

${promptLanguageInstruction}

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no code fences, no explanation text. Start directly with { and end with }.

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
}`;

  const requestBody = {
    model,
    temperature: 0.3,
    max_tokens: 2000,
    messages: [
      {
        role: 'system',
        content:
          'You are a business analyst. Always respond with valid JSON only, no markdown or extra text.',
      },
      { role: 'user', content: prompt },
    ],
  };

  try {
    const response = await fetch(ZEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${zenApiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    const rawText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Gagal menghubungi OpenCode Zen',
          status: response.status,
          detail: rawText.slice(0, 500),
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        {
          error: 'OpenCode Zen mengembalikan respons non-JSON',
          detail: rawText.slice(0, 500),
        },
        { status: 502 }
      );
    }

    const content = extractContent(data);

    if (!content) {
      return NextResponse.json(
        {
          error: 'Format respons OpenCode Zen tidak dikenali.',
          detail: JSON.stringify(data).slice(0, 500),
        },
        { status: 500 }
      );
    }

    const canvas = extractJSON(content);

    if (!canvas) {
      return NextResponse.json(
        {
          error: 'Respons bukan JSON yang valid.',
          detail: content.slice(0, 500),
        },
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
