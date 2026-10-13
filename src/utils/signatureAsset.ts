/**
 * Signature asset utility for Bendahara Susilawati, S.Pd.
 * Menggunakan gambar ttd penggalang.png untuk Kwitansi Pembayaran Resmi.
 */
import { TTD_PENGGALANG_BASE64 } from './signatureData';

export const TTD_PENGGALANG_IMAGE_PATH = '/ttd penggalang.png';
export const TTD_PENGGALANG_FALLBACK_BASE64 = TTD_PENGGALANG_BASE64;

const CUSTOM_SIGNATURE_KEY = 'kwitansi_custom_signature';

function readCustomSignature(): string | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(CUSTOM_SIGNATURE_KEY) : null;
  } catch {
    return null;
  }
}

/**
 * Returns default signature URL/DataURL (ttd penggalang.png)
 */
export function getDefaultSignature(): string {
  return TTD_PENGGALANG_FALLBACK_BASE64;
}

/**
 * Returns active signature URL (custom uploaded signature if present, otherwise default).
 */
export function getActiveSignature(): string {
  return readCustomSignature() || TTD_PENGGALANG_FALLBACK_BASE64;
}

/**
 * Saves a custom signature (DataURL) to localStorage.
 */
export function saveCustomSignature(dataUrl: string): void {
  try {
    window.localStorage.setItem(CUSTOM_SIGNATURE_KEY, dataUrl);
  } catch (err) {
    console.error('Gagal menyimpan tanda tangan kustom:', err);
  }
}

/**
 * Removes the custom signature, reverting to the default one.
 */
export function resetCustomSignature(): void {
  try {
    window.localStorage.removeItem(CUSTOM_SIGNATURE_KEY);
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
