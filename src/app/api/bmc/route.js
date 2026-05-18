import { NextResponse } from 'next/server';

const ZEN_BASE = 'https://opencode.ai/zen/v1';
const DEFAULT_MODEL = 'deepseek-v4-flash-free';

// Tentukan family/endpoint berdasarkan id model
function getProvider(model) {
  if (model.startsWith('gpt-')) return 'openai-responses';
  if (model.startsWith('claude-')) return 'anthropic';
  if (model.startsWith('gemini-')) return 'google';
  // Sisanya pakai OpenAI-compatible chat/completions:
  // qwen, minimax, glm, kimi, deepseek, nemotron, big-pickle, dll.
  return 'openai-compat';
}

const SYSTEM_PROMPT =
  'You are an expert business analyst. Always respond with ONLY a valid JSON object. No markdown, no code fences, no extra text. Start with { and end with }.';

function buildUserPrompt(idea, language) {
  const langInstr =
    language === 'en'
      ? 'Write all content in English.'
      : 'Tulis seluruh konten dalam Bahasa Indonesia.';

  return `Generate a Business Model Canvas based on this business description.

Business Description: ${idea}

${langInstr}

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

// ====== Caller per provider ======
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
      max_tokens: 2000,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
}

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
      max_tokens: 2000,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
}

async function callOpenAIResponses(model, system, user, key) {
  return fetch(`${ZEN_BASE}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      input: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
}

// ====== Content extractor per provider ======
function extractContent(data, provider) {
  // Anthropic Messages API: { content: [{ type: 'text', text: '...' }] }
  if (provider === 'anthropic') {
    const blocks = data?.content;
    if (Array.isArray(blocks)) {
      const text = blocks
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');
      if (text.trim()) return text.trim();
    }
  }

  // OpenAI Responses API: berbagai bentuk
  if (provider === 'openai-responses') {
    if (typeof data?.output_text === 'string' && data.output_text.trim()) {
      return data.output_text.trim();
    }
    const out = data?.output;
    if (Array.isArray(out)) {
      const text = out
        .flatMap((o) => (Array.isArray(o.content) ? o.content : []))
        .filter((c) => c?.type === 'output_text' || c?.type === 'text')
        .map((c) => c.text || '')
        .join('');
      if (text.trim()) return text.trim();
    }
  }

  // OpenAI-compatible chat/completions: choices[0].message.content
  let content = data?.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim()) return content.trim();
  if (Array.isArray(content)) {
    const text = content
      .map((p) => (typeof p === 'string' ? p : p?.text || ''))
      .join('');
    if (text.trim()) return text.trim();
  }

  // Fallback: choices[0].text (legacy completion)
  const altText = data?.choices?.[0]?.text;
  if (typeof altText === 'string' && altText.trim()) return altText.trim();

  // Fallback: reasoning content (some reasoning models)
  const reasoning = data?.choices?.[0]?.message?.reasoning_content;
  if (typeof reasoning === 'string' && reasoning.trim()) return reasoning.trim();

  return null;
}

// ====== Robust JSON extractor ======
function extractJSON(text) {
  if (!text || typeof text !== 'string') return null;

  // Bersihkan code fence kalau ada
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');

  // Coba parse langsung
  try {
    return JSON.parse(cleaned);
  } catch {
    // lanjut
  }

  // Cari pasangan { } terluar
  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    const candidate = cleaned.slice(first, last + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      // Coba perbaiki JSON yang umum rusak: trailing comma
      try {
        const repaired = candidate.replace(/,(\s*[}\]])/g, '$1');
        return JSON.parse(repaired);
      } catch {
        // tidak bisa diperbaiki
      }
    }
  }

  return null;
}

// ====== Main handler ======
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

  const provider = getProvider(model);
  const userPrompt = buildUserPrompt(idea, language);

  try {
    let response;
    if (provider === 'anthropic') {
      response = await callAnthropic(model, SYSTEM_PROMPT, userPrompt, zenApiKey);
    } else if (provider === 'openai-responses') {
      response = await callOpenAIResponses(model, SYSTEM_PROMPT, userPrompt, zenApiKey);
    } else if (provider === 'google') {
      return NextResponse.json(
        {
          error:
            language === 'en'
              ? 'Gemini models are not yet supported.'
              : 'Model Gemini belum didukung.',
        },
        { status: 400 }
      );
    } else {
      response = await callOpenAICompat(model, SYSTEM_PROMPT, userPrompt, zenApiKey);
    }

    const rawText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Gagal menghubungi OpenCode Zen',
          provider,
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
          error: 'OpenCode Zen mengembalikan respons non-JSON.',
          provider,
          detail: rawText.slice(0, 500),
        },
        { status: 502 }
      );
    }

    const content = extractContent(data, provider);

    if (!content) {
      return NextResponse.json(
        {
          error: 'Format respons OpenCode Zen tidak dikenali.',
          provider,
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
          provider,
          detail: content.slice(0, 500),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ canvas, provider, model });
  } catch (err) {
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal.', detail: err.message },
      { status: 500 }
    );
  }
}
