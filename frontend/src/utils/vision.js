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
          'You compare two photos and decide whether they show the SAME physical item/object. Be lenient on lighting, angle, distance, and background. Be strict on object identity — different brands, colors, or types are NOT a match. Respond only with valid JSON: {"match": boolean, "reason": string (1 short sentence)}.',
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Image 1 (target):' },
          { type: 'image_url', image_url: { url: targetData } },
          { type: 'text', text: 'Image 2 (candidate):' },
          { type: 'image_url', image_url: { url: candidateData } },
          { type: 'text', text: 'Do these show the same item?' },
        ],
      },
    ],
    max_tokens: 200,
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
