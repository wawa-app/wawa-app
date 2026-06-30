import RNFS from 'react-native-fs';
import { SEED_IMAGES } from './seedImages';

export const PHOTOS_DIR = `${RNFS.DocumentDirectoryPath}/photos`;
const SEED_MARKER = `${PHOTOS_DIR}/.seeded`;

export function pathFromUri(uri) {
  return uri.replace(/^file:\/\//, '');
}

export function uriFromPath(path) {
  return path.startsWith('file://') ? path : `file://${path}`;
}

export async function ensurePhotosDir() {
  const exists = await RNFS.exists(PHOTOS_DIR);
  if (!exists) {
    await RNFS.mkdir(PHOTOS_DIR);
  }
}

// Copies the bundled sample photos into the library on first launch so the
// Challenge always has targets. Idempotent: a marker file prevents re-seeding,
// so deleting a seeded photo won't bring it back.
export async function seedPhotos() {
  await ensurePhotosDir();
  if (await RNFS.exists(SEED_MARKER)) return;

  for (const { name, base64 } of SEED_IMAGES) {
    const dest = `${PHOTOS_DIR}/IMG_seed_${name}.png`;
    if (!(await RNFS.exists(dest))) {
      await RNFS.writeFile(dest, base64, 'base64');
    }
  }

  await RNFS.writeFile(SEED_MARKER, String(Date.now()), 'utf8');
}

export async function savePhoto(tempUri) {
  await ensurePhotosDir();
  const filename = `IMG_${Date.now()}.jpg`;
  const dest = `${PHOTOS_DIR}/${filename}`;
  await RNFS.moveFile(pathFromUri(tempUri), dest);
  return uriFromPath(dest);
}

export async function listPhotos() {
  await ensurePhotosDir();
  const files = await RNFS.readDir(PHOTOS_DIR);
  return files
    .filter((file) => file.isFile())
    .map((file) => file.name)
    .filter((name) => name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png'))
    .sort((a, b) => a.localeCompare(b))
    .reverse()
    .map((name) => uriFromPath(`${PHOTOS_DIR}/${name}`));
}

export async function deletePhoto(uri) {
  try {
    const path = pathFromUri(uri);
    if (await RNFS.exists(path)) {
      await RNFS.unlink(path);
    }
  } catch (e) {
    console.warn('Failed to delete photo:', e);
  }
}

export function pickRandom(items) {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}
