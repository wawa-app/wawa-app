import RNFS from 'react-native-fs';
import { OPENAI_API_KEY, OPENAI_MODEL } from '../config';
import { pathFromUri } from './photos';

function mimeFromUri(uri) {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

async function fileToDataUri(uri) {
  const base64 = await RNFS.readFile(pathFromUri(uri), 'base64');
  return `data:${mimeFromUri(uri)};base64,${base64}`;
}

const FALLBACK_OBJECT_NAME = 'Object';

/**
 * Returns a short, human-readable name for the main object in a photo.
 * A failed or ambiguous Vision response deliberately resolves to "Object" so
 * the add-object form is always usable, including when the device is offline.
 */
export async function identifyObject(imageUri) {
  if (!imageUri || !OPENAI_API_KEY) return FALLBACK_OBJECT_NAME;

  try {
    const imageData = await fileToDataUri(imageUri);
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'Identify the single main physical object in the photo. Reply only with JSON in this exact shape: {"name":"short common object name"}. Use a concise generic noun such as "Coffee mug". If the object is unclear, cropped, or not rendered clearly, reply {"name":"Object"}.',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'What is the main object in this image?' },
              // Naming only needs a quick general read of the object. The
              // harder two-photo match below keeps high detail.
              { type: 'image_url', image_url: { url: imageData, detail: 'low' } },
            ],
          },
        ],
        // GPT-5 models use max_completion_tokens; max_tokens is rejected.
        max_completion_tokens: 60,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenAI request failed (${res.status}): ${errorText}`);
    }

    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    const name = JSON.parse(content || '{}')?.name;
    const trimmedName = typeof name === 'string' ? name.trim() : '';

    // Keep unexpected model output from turning the editable input into a
    // paragraph or an unusable label.
    return trimmedName && trimmedName.length <= 80
      ? trimmedName
      : FALLBACK_OBJECT_NAME;
  } catch (error) {
    console.warn('[vision] object identification failed:', error?.message);
    return FALLBACK_OBJECT_NAME;
  }
}

export async function compareImages(targetUri, candidateUri) {
  if (!OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key. Add WAWA_OPENAI_API_KEY to .env.');
  }

  const [targetData, candidateData] = await Promise.all([
    fileToDataUri(targetUri),
    fileToDataUri(candidateUri),
  ]);

  const body = {
    model: OPENAI_MODEL,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'Decide whether two photos show the SAME individual physical object. The photos may be from completely different angles, sides, orientations, distances, crops, lighting, or backgrounds. Treat features hidden by the new angle or crop as unknown, not as a difference. Return match: true when the visible shape, materials, markings, colors, and distinctive details are consistent and there is no clear contradiction. Return match: false only when you can see a clear incompatible difference, such as different text/logo, a clearly different brand, color, shape, or object type. Respond only with valid JSON: {"match": boolean, "reason": string (1 short sentence)}.',
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Image 1 (target):' },
          { type: 'image_url', image_url: { url: targetData, detail: 'high' } },
          { type: 'text', text: 'Image 2 (candidate):' },
          { type: 'image_url', image_url: { url: candidateData, detail: 'high' } },
          { type: 'text', text: 'Do these show the same item?' },
        ],
      },
    ],
    max_completion_tokens: 200,
  };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI request failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`Could not parse OpenAI response: ${content}`);
  }

  if (typeof parsed.match !== 'boolean') {
    throw new Error('Response missing "match" boolean');
  }

  return {
    match: parsed.match,
    reason: typeof parsed.reason === 'string' ? parsed.reason : '',
  };
}
