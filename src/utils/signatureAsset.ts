/**
 * Signature asset utility for Bendahara Susilawati, S.Pd.
 * Menggunakan gambar ttd penggalang.png untuk Kwitansi Pembayaran Resmi.
 */
import { TTD_PENGGALANG_BASE64 } from './signatureData';

export const TTD_PENGGALANG_IMAGE_PATH = '/ttd penggalang.png';
export const TTD_PENGGALANG_FALLBACK_BASE64 = TTD_PENGGALANG_BASE64;

/**
 * Returns default signature URL/DataURL (ttd penggalang.png)
 */
export function getDefaultSignature(): string {
  return TTD_PENGGALANG_FALLBACK_BASE64;
}

/**
 * Returns active signature URL.
 */
export function getActiveSignature(): string {
  return readCustomSignature() || TTD_PENGGALANG_FALLBACK_BASE64;
}

const CUSTOM_SIGNATURE_STORAGE_KEY = 'pramuka_custom_signature';

function readCustomSignature(): string | null {
  try {
    return localStorage.getItem(CUSTOM_SIGNATURE_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Saves a custom signature (DataURL) to localStorage.
 */
export function saveCustomSignature(data: string): void {
  try {
    localStorage.setItem(CUSTOM_SIGNATURE_STORAGE_KEY, data);
  } catch (err) {
    console.error('Gagal menyimpan tanda tangan kustom:', err);
  }
}

/**
 * Removes the custom signature, reverting to the default.
 */
export function resetCustomSignature(): void {
  try {
    localStorage.removeItem(CUSTOM_SIGNATURE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Returns true if a custom signature has been saved.
 */
export function hasCustomSignature(): boolean {
  return !!readCustomSignature();
}
