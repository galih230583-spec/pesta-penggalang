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
  return TTD_PENGGALANG_FALLBACK_BASE64;
}
