import { jsPDF } from 'jspdf';
import {
  SubmittedRegistration,
  INFO_PEMBAYARAN,
  formatRupiah,
  formatTtlDisplay,
} from '../types/registration';

export interface IdCardPerson {
  id: string;
  nomorKartu: string;
  nama: string;
  kategori: 'PEMBINA PUTRA' | 'PEMBINA PUTRI' | 'PESERTA PUTRA' | 'PESERTA PUTRI';
  jabatan: string;
  nipAtauReguLabel: string;
  nipAtauReguValue: string;
  namaSekolah: string;
  namaKepalaSekolah: string;
  nomorRegistrasi: string;
  urutan: number;
  customPhotoUrl?: string;
}

const TUNAS_KELAPA_SVG = `<svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 114C14 114 22 86 52 86C78 86 90 105 90 118C90 134 76 149 52 149C26 149 14 123 14 114Z" fill="#23170D"/>
  <path d="M11 114C11 110 18 102 25 97C20 108 20 120 25 131C18 126 11 118 11 114Z" fill="#23170D"/>
  <path d="M84 112C88 94 78 76 70 58C63 42 66 26 71 17C74 28 77 38 78 46C80 30 82 14 87 4C89 20 98 38 99 56C100 72 93 86 95 104C96 112 94 119 88 123L84 112Z" fill="#23170D"/>
  <path d="M86 119C91 128 96 141 101 153C102 156 99 158 96 156C88 150 84 137 80 125L86 119Z" fill="#23170D"/>
</svg>`;

const WOSM_SVG = `<svg viewBox="0 0 140 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="70" cy="68" r="58" stroke="#4B1E78" stroke-width="6.5" stroke-dasharray="10 4"/>
  <circle cx="70" cy="68" r="55" stroke="#4B1E78" stroke-width="2"/>
  <path d="M70 18C70 18 89 35 88 57C87 68 81 76 78 81H62C59 76 53 68 52 57C51 35 70 18 70 18Z" fill="#4B1E78"/>
  <path d="M70 32V81" stroke="#FAF7F2" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M62 79C56 64 46 50 32 51C20 52 14 63 17 75C20 84 29 88 35 83C31 80 30 74 35 71C40 68 48 73 53 81H62Z" fill="#4B1E78"/>
  <path d="M78 79C84 64 94 50 108 51C120 52 126 63 123 75C120 84 111 88 105 83C109 80 110 74 105 71C100 68 92 73 87 81H78Z" fill="#4B1E78"/>
  <polygon points="31,61 32.8,65 37,65.5 33.8,68.3 34.8,72.5 31,70.2 27.2,72.5 28.2,68.3 25,65.5 29.2,65" fill="#FAF7F2"/>
  <polygon points="109,61 110.8,65 115,65.5 111.8,68.3 112.8,72.5 109,70.2 105.2,72.5 106.2,68.3 103,65.5 107.2,65" fill="#FAF7F2"/>
  <rect x="48" y="81" width="44" height="7" rx="3.5" fill="#4B1E78" stroke="#FAF7F2" stroke-width="2"/>
  <path d="M63 89H77L82 104L70 116L58 104L63 89Z" fill="#4B1E78"/>
  <path d="M55 89H62C61 98 56 105 47 107C43 108 40 104 42 100C46 102 52 97 55 89Z" fill="#4B1E78"/>
  <path d="M85 89H78C79 98 84 105 93 107C97 108 100 104 98 100C94 102 88 97 85 89Z" fill="#4B1E78"/>
  <path d="M70 89V111" stroke="#FAF7F2" stroke-width="2"/>
  <path d="M52 125C56 119 66 119 72 125C78 131 86 131 90 125" stroke="#4B1E78" stroke-width="6.5" stroke-linecap="round"/>
  <path d="M52 131C56 137 66 137 72 131C78 125 86 125 90 131" stroke="#4B1E78" stroke-width="6.5" stroke-linecap="round"/>
  <path d="M53 129L43 142M87 129L97 142" stroke="#4B1E78" stroke-width="6" stroke-linecap="round"/>
</svg>`;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function buildIdCardsFromRegistration(reg: SubmittedRegistration): IdCardPerson[] {
  const cards: IdCardPerson[] = [];

  // 1. Pembina Pendamping Putra 1 & 2
  const pembinaPutraList = [
    { nama: reg.namaPembinaPutra, nip: reg.nipPembinaPutra, no: 1 },
    { nama: reg.namaPembinaPutra2, nip: reg.nipPembinaPutra2, no: 2 },
  ];
  pembinaPutraList.forEach((p) => {
    if (p.nama && p.nama.trim() !== '' && p.nama.trim() !== '-') {
      cards.push({
        id: `${reg.id}-bindamping-pa-${p.no}`,
        nomorKartu: `${reg.nomorRegistrasi}-BPA0${p.no}`,
        nama: p.nama.trim(),
        kategori: 'PEMBINA PUTRA',
        jabatan: `Pembina Pendamping Putra ${p.no}`,
        nipAtauReguLabel: 'NIP Pembina',
        nipAtauReguValue: p.nip?.trim() || '-',
        namaSekolah: reg.namaSekolah,
        namaKepalaSekolah: reg.namaKepalaSekolah,
        nomorRegistrasi: reg.nomorRegistrasi,
        urutan: p.no,
      });
    }
  });

  // 2. Pembina Pendamping Putri 1 & 2
  const pembinaPutriList = [
    { nama: reg.namaPembinaPutri, nip: reg.nipPembinaPutri, no: 1 },
    { nama: reg.namaPembinaPutri2, nip: reg.nipPembinaPutri2, no: 2 },
  ];
  pembinaPutriList.forEach((p) => {
    if (p.nama && p.nama.trim() !== '' && p.nama.trim() !== '-') {
      cards.push({
        id: `${reg.id}-bindamping-pi-${p.no}`,
        nomorKartu: `${reg.nomorRegistrasi}-BPI0${p.no}`,
        nama: p.nama.trim(),
        kategori: 'PEMBINA PUTRI',
        jabatan: `Pembina Pendamping Putri ${p.no}`,
        nipAtauReguLabel: 'NIP Pembina',
        nipAtauReguValue: p.nip?.trim() || '-',
        namaSekolah: reg.namaSekolah,
        namaKepalaSekolah: reg.namaKepalaSekolah,
        nomorRegistrasi: reg.nomorRegistrasi,
        urutan: p.no,
      });
    }
  });

  // 3. Peserta Putra (1 - 8)
  reg.pesertaPutra.forEach((nama, idx) => {
    const cleanName = nama?.trim() || `Peserta Putra ${idx + 1}`;
    const role =
      idx === 0
        ? 'Pemimpin Regu (Pinru) Putra'
        : idx === 1
        ? 'Wakil Pinru (Wapinru) Putra'
        : `Anggota Regu Putra #${idx + 1}`;
    cards.push({
      id: `${reg.id}-peserta-pa-${idx + 1}`,
      nomorKartu: `${reg.nomorRegistrasi}-PA0${idx + 1}`,
      nama: cleanName,
      kategori: 'PESERTA PUTRA',
      jabatan: role,
      nipAtauReguLabel: 'Regu Putra',
      nipAtauReguValue: reg.namaReguPutra?.trim() || 'Regu Penggalang Putra',
      namaSekolah: reg.namaSekolah,
      namaKepalaSekolah: reg.namaKepalaSekolah,
      nomorRegistrasi: reg.nomorRegistrasi,
      urutan: idx + 1,
    });
  });

  // 4. Peserta Putri (1 - 8)
  reg.pesertaPutri.forEach((nama, idx) => {
    const cleanName = nama?.trim() || `Peserta Putri ${idx + 1}`;
    const role =
      idx === 0
        ? 'Pemimpin Regu (Pinru) Putri'
        : idx === 1
        ? 'Wakil Pinru (Wapinru) Putri'
        : `Anggota Regu Putri #${idx + 1}`;
    cards.push({
      id: `${reg.id}-peserta-pi-${idx + 1}`,
      nomorKartu: `${reg.nomorRegistrasi}-PI0${idx + 1}`,
      nama: cleanName,
      kategori: 'PESERTA PUTRI',
      jabatan: role,
      nipAtauReguLabel: 'Regu Putri',
      nipAtauReguValue: reg.namaReguPutri?.trim() || 'Regu Penggalang Putri',
      namaSekolah: reg.namaSekolah,
      namaKepalaSekolah: reg.namaKepalaSekolah,
      nomorRegistrasi: reg.nomorRegistrasi,
      urutan: idx + 1,
    });
  });

  return cards;
}

/**
 * Triggers a direct file download of the uploaded payment proof image/PDF
 */
export function downloadPaymentProofFile(reg: SubmittedRegistration): void {
  if (!reg.buktiPembayaran) return;
  const link = document.createElement('a');
  link.href = reg.buktiPembayaran.dataUrl;
  const safeSchool = reg.namaSekolah.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.download = `Bukti_Bayar_${safeSchool}_${reg.buktiPembayaran.fileName}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Renders the Official Registration Receipt onto an HTML5 Canvas
 */
async function renderReceiptToCanvas(reg: SubmittedRegistration): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1650;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#D8CEBE';
  ctx.lineWidth = 4;
  ctx.fillRect(40, 40, width - 80, height - 80);
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Header Banner
  ctx.fillStyle = '#4A2C11';
  ctx.fillRect(40, 40, width - 80, 170);
  ctx.fillStyle = '#C81E1E';
  ctx.fillRect(40, 210, width - 80, 12);

  ctx.fillStyle = '#F3D299';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('GERAKAN PRAMUKA KWARTIR RANTING KECAMATAN MUARA KAMAN', 80, 95);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText('BUKTI PENDAFTARAN & PEMBAYARAN PESTA PENGGALANG', 80, 145);

  ctx.fillStyle = '#EAE0D5';
  ctx.font = '20px monospace';
  ctx.fillText(
    `No. Registrasi: ${reg.nomorRegistrasi}   |   Tanggal: ${reg.tanggalDaftar}`,
    80,
    185
  );

  // Section 1
  let y = 270;
  ctx.fillStyle = '#4A2C11';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('1. IDENTITAS SEKOLAH & PEMBINA PENDAMPING', 80, y);

  y += 20;
  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(80, y, width - 160, 270);
  ctx.strokeStyle = '#E5DEC9';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, y, width - 160, 270);

  const leftX = 105;
  const rightX = 630;
  const rowY = y + 45;

  ctx.fillStyle = '#6B5744';
  ctx.font = '17px sans-serif';
  ctx.fillText('Nama Sekolah / Pangkalan:', leftX, rowY);
  ctx.fillStyle = '#23170D';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(reg.namaSekolah, leftX, rowY + 30);

  ctx.fillStyle = '#6B5744';
  ctx.font = '17px sans-serif';
  ctx.fillText('Kepala Sekolah (Kamabigus):', leftX, rowY + 80);
  ctx.fillStyle = '#23170D';
  ctx.font = 'bold 19px sans-serif';
  ctx.fillText(reg.namaKepalaSekolah, leftX, rowY + 108);
  ctx.fillStyle = '#4A2C11';
  ctx.font = '16px monospace';
  ctx.fillText(`NIP: ${reg.nipKepalaSekolah}`, leftX, rowY + 134);

  ctx.fillStyle = '#8B1E1E';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText('Pembina Pendamping Putra:', rightX, rowY);
  ctx.fillStyle = '#23170D';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText(`1. ${reg.namaPembinaPutra} (NIP: ${reg.nipPembinaPutra})`, rightX, rowY + 26);
  ctx.fillText(
    `2. ${reg.namaPembinaPutra2 || '-'} (NIP: ${reg.nipPembinaPutra2 || '-'})`,
    rightX,
    rowY + 52
  );

  ctx.fillStyle = '#4B1E78';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText('Pembina Pendamping Putri:', rightX, rowY + 95);
  ctx.fillStyle = '#23170D';
  ctx.font = 'bold 17px sans-serif';
  ctx.fillText(`1. ${reg.namaPembinaPutri} (NIP: ${reg.nipPembinaPutri})`, rightX, rowY + 121);
  ctx.fillText(
    `2. ${reg.namaPembinaPutri2 || '-'} (NIP: ${reg.nipPembinaPutri2 || '-'})`,
    rightX,
    rowY + 147
  );

  // Section 2
  y = 605;
  ctx.fillStyle = '#4A2C11';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('2. DAFTAR PESERTA REGU PUTRA (8) & REGU PUTRI (8)', 80, y);

  y += 20;
  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(80, y, 500, 390);
  ctx.strokeRect(80, y, 500, 390);

  ctx.fillStyle = '#8B1E1E';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(
    `REGU PUTRA ${reg.namaReguPutra ? `(${reg.namaReguPutra})` : ''}`,
    105,
    y + 40
  );

  ctx.fillStyle = '#23170D';
  reg.pesertaPutra.forEach((nama, idx) => {
    const label = idx === 0 ? ' [Pinru]' : idx === 1 ? ' [Wapinru]' : '';
    const ttl = formatTtlDisplay(reg.tempatLahirPutra?.[idx], reg.tanggalLahirPutra?.[idx]);
    const rowTop = y + 72 + idx * 39;
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#23170D';
    ctx.fillText(`${idx + 1}. ${nama || '-'}${label}`, 105, rowTop);
    ctx.font = '13.5px sans-serif';
    ctx.fillStyle = '#5C4328';
    ctx.fillText(`   TTL: ${ttl}`, 105, rowTop + 16);
  });

  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(620, y, 500, 390);
  ctx.strokeRect(620, y, 500, 390);

  ctx.fillStyle = '#4B1E78';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(
    `REGU PUTRI ${reg.namaReguPutri ? `(${reg.namaReguPutri})` : ''}`,
    645,
    y + 40
  );

  ctx.fillStyle = '#23170D';
  reg.pesertaPutri.forEach((nama, idx) => {
    const label = idx === 0 ? ' [Pinru]' : idx === 1 ? ' [Wapinru]' : '';
    const ttl = formatTtlDisplay(reg.tempatLahirPutri?.[idx], reg.tanggalLahirPutri?.[idx]);
    const rowTop = y + 72 + idx * 39;
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#23170D';
    ctx.fillText(`${idx + 1}. ${nama || '-'}${label}`, 645, rowTop);
    ctx.font = '13.5px sans-serif';
    ctx.fillStyle = '#5C4328';
    ctx.fillText(`   TTL: ${ttl}`, 645, rowTop + 16);
  });

  // Section 3
  y = 1065;
  ctx.fillStyle = '#14532D';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('3. RINCIAN PEMBAYARAN & BUKTI TRANSFER BANK KALTIMTARA', 80, y);

  y += 20;
  ctx.fillStyle = '#F0FDF4';
  ctx.fillRect(80, y, width - 160, 440);
  ctx.strokeStyle = '#15803D';
  ctx.strokeRect(80, y, width - 160, 440);

  ctx.fillStyle = '#23170D';
  ctx.font = '19px sans-serif';
  ctx.fillText(`• Biaya per Regu: ${INFO_PEMBAYARAN.biayaFormatted}`, 105, y + 55);
  ctx.fillText(`• Jumlah Regu Didaftarkan: ${reg.jumlahRegu} Regu`, 105, y + 95);
  ctx.fillStyle = '#C81E1E';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(`• TOTAL BIAYA: ${formatRupiah(reg.totalBiaya)}`, 105, y + 140);

  ctx.fillStyle = '#23170D';
  ctx.font = '18px sans-serif';
  ctx.fillText(
    `• Rekening Tujuan: ${INFO_PEMBAYARAN.bank} ${INFO_PEMBAYARAN.noRekening}`,
    105,
    y + 185
  );
  ctx.fillText(`• Atas Nama: ${INFO_PEMBAYARAN.atasNama}`, 105, y + 220);
  ctx.fillStyle = '#15803D';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(
    `• Status Konfirmasi WA Panitia: ${INFO_PEMBAYARAN.waPanitiaDisplay}`,
    105,
    y + 265
  );
  ctx.fillText(
    `• File Bukti Transfer: ${reg.buktiPembayaran?.fileName || 'Terlampir'}`,
    105,
    y + 305
  );

  if (reg.buktiPembayaran && reg.buktiPembayaran.fileType.startsWith('image/')) {
    const img = await loadImage(reg.buktiPembayaran.dataUrl);
    if (img && img.width > 0 && img.height > 0) {
      const boxX = 680;
      const boxY = y + 30;
      const boxW = 410;
      const boxH = 380;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = '#D8CEBE';
      ctx.strokeRect(boxX, boxY, boxW, boxH);

      const scale = Math.min((boxW - 20) / img.width, (boxH - 20) / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      ctx.drawImage(
        img,
        boxX + (boxW - drawW) / 2,
        boxY + (boxH - drawH) / 2,
        drawW,
        drawH
      );
    }
  }

  ctx.fillStyle = '#6B5744';
  ctx.font = '16px sans-serif';
  ctx.fillText(
    'Dokumen Resmi Panitia Pesta Penggalang — Kwartir Ranting Gerakan Pramuka Kecamatan Muara Kaman',
    80,
    1575
  );

  return canvas;
}

/**
 * Downloads the Registration Receipt directly as a PDF (.pdf)
 */
export async function downloadReceiptAsPdf(reg: SubmittedRegistration): Promise<void> {
  const canvas = await renderReceiptToCanvas(reg);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  pdf.addImage(imgData, 'JPEG', 5, 5, 200, 275);
  const safeSchool = reg.namaSekolah.replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`Bukti_Pendaftaran_${safeSchool}.pdf`);
}

/**
 * Downloads the Registration Receipt as PNG
 */
export async function downloadReceiptAsPng(reg: SubmittedRegistration): Promise<void> {
  const canvas = await renderReceiptToCanvas(reg);
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const safeSchool = reg.namaSekolah.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.href = dataUrl;
  link.download = `Bukti_Pendaftaran_Pesta_Penggalang_${safeSchool}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Renders an individual Portrait ID Card onto an HTML5 Canvas so that the visual result
 * is 100% IDENTICAL to the React preview (including Tunas Kelapa + WOSM badges,
 * Pita Merah-Putih Kacu, and 4x6 Photo Frame with All Corners Rounded).
 */
export async function renderIdCardToCanvas(card: IdCardPerson): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const width = 900;
  const height = 1380;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const isPembina =
    card.kategori === 'PEMBINA PUTRA' || card.kategori === 'PEMBINA PUTRI';
  const isPutra = card.kategori === 'PESERTA PUTRA';

  const colors = isPembina
    ? {
        gradStart: '#4A2C11',
        gradMid: '#5C3614',
        gradEnd: '#3B220C',
        roleBadge: '#B45309',
        frameBorder: '#D97706',
      }
    : isPutra
    ? {
        gradStart: '#7F1D1D',
        gradMid: '#991B1B',
        gradEnd: '#651515',
        roleBadge: '#C81E1E',
        frameBorder: '#C81E1E',
      }
    : {
        gradStart: '#4B1E78',
        gradMid: '#5B21B6',
        gradEnd: '#3B1561',
        roleBadge: '#6B21A8',
        frameBorder: '#6B21A8',
      };

  // Clip entire card to rounded rectangle (matches rounded-3xl in preview)
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, width, height, 56);
  ctx.clip();

  // Base cream background (#FAF7F2)
  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(0, 0, width, height);

  // 1. TOP HEADER BLOCK WITH GRADIENT
  const headerH = 265;
  const headerGrad = ctx.createLinearGradient(0, 0, 0, headerH);
  headerGrad.addColorStop(0, colors.gradStart);
  headerGrad.addColorStop(0.5, colors.gradMid);
  headerGrad.addColorStop(1, colors.gradEnd);
  ctx.fillStyle = headerGrad;
  ctx.fillRect(0, 0, width, headerH);

  // Lanyard Hole Pill at top center
  ctx.fillStyle = '#FAF7F2';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 58, 28, 116, 20, 10);
  ctx.fill();

  // Left White Emblem Box (Tunas Kelapa)
  const leftBoxX = 44;
  const boxY = 74;
  const boxSize = 104;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(leftBoxX, boxY, boxSize, boxSize, 26);
  ctx.fill();

  const tunasImg = await loadImage(
    `data:image/svg+xml;utf8,${encodeURIComponent(TUNAS_KELAPA_SVG)}`
  );
  if (tunasImg) {
    ctx.drawImage(tunasImg, leftBoxX + 18, boxY + 10, 68, 84);
  }

  // Right White Emblem Box (WOSM)
  const rightBoxX = width - 44 - boxSize;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(rightBoxX, boxY, boxSize, boxSize, 26);
  ctx.fill();

  const wosmImg = await loadImage(
    `data:image/svg+xml;utf8,${encodeURIComponent(WOSM_SVG)}`
  );
  if (wosmImg) {
    ctx.drawImage(wosmImg, rightBoxX + 12, boxY + 12, 80, 80);
  }

  // Center Header Titles (Enlarged & Adjusted)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F3D299';
  ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('GERAKAN PRAMUKA KWARRAN', width / 2, 106);
  ctx.font = '800 27px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('KECAMATAN MUARA KAMAN', width / 2, 140);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 42px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('PESTA PENGGALANG', width / 2, 194);

  // 2. PITA MERAH PUTIH KACU PRAMUKA (Left 50% Red, Right 50% White)
  const ribbonY = headerH;
  const ribbonH = 24;
  ctx.fillStyle = '#C81E1E';
  ctx.fillRect(0, ribbonY, width / 2, ribbonH);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(width / 2, ribbonY, width / 2, ribbonH);
  ctx.strokeStyle = '#D8CEBE';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, ribbonY + ribbonH);
  ctx.lineTo(width, ribbonY + ribbonH);
  ctx.stroke();

  // 3. WIDENED PORTRAIT PHOTO FRAME WITH ALL CORNERS ROUNDED (Matches w-[116px] h-[148px] in preview)
  const photoW = 300;
  const photoH = 384;
  const photoX = (width - photoW) / 2;
  const photoY = 318;
  const photoRadius = 38;

  // Draw white inner background & clip for photo
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.clip();

  if (card.customPhotoUrl) {
    const userImg = await loadImage(card.customPhotoUrl);
    if (userImg && userImg.width > 0 && userImg.height > 0) {
      const scale = Math.max(photoW / userImg.width, photoH / userImg.height);
      const drawW = userImg.width * scale;
      const drawH = userImg.height * scale;
      ctx.drawImage(
        userImg,
        photoX + (photoW - drawW) / 2,
        photoY + (photoH - drawH) / 2,
        drawW,
        drawH
      );
    }
  } else {
    // Same placeholder as preview: Initials + PRAMUKA + PASFOTO 4x6
    const initials = card.nama
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
    ctx.textAlign = 'center';
    ctx.fillStyle = '#4A2C11';
    ctx.font = '800 84px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(initials || 'GP', width / 2, photoY + 185);

    ctx.fillStyle = '#7A5C3E';
    ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PRAMUKA', width / 2, photoY + 238);

    ctx.fillStyle = '#A38B73';
    ctx.font = '600 23px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PASFOTO 4x6', width / 2, photoY + 280);
  }
  ctx.restore();

  // Rounded border around frame
  ctx.beginPath();
  ctx.roundRect(photoX, photoY, photoW, photoH, photoRadius);
  ctx.lineWidth = 10;
  ctx.strokeStyle = colors.frameBorder;
  ctx.stroke();

  // 4. ROLE / CATEGORY PILL (Enlarged)
  const pillY = 724;
  const pillW = 390;
  const pillH = 60;
  ctx.fillStyle = colors.roleBadge;
  ctx.beginPath();
  ctx.roundRect((width - pillW) / 2, pillY, pillW, pillH, 30);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 29px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(card.kategori, width / 2, pillY + 40);

  // 5. FULL NAME & JABATAN (Enlarged & Adjusted)
  ctx.fillStyle = '#23170D';
  ctx.font = '800 45px "Plus Jakarta Sans", sans-serif';
  if (ctx.measureText(card.nama).width > 800) {
    ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
  }
  ctx.fillText(card.nama, width / 2, 838);

  ctx.fillStyle = '#7A5C3E';
  ctx.font = 'bold 31px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(card.jabatan, width / 2, 884);

  // 6. DETAILS TABLE CARD (Enlarged Text)
  const tableX = 46;
  const tableY = 916;
  const tableW = width - 92;
  const tableH = 330;

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(tableX, tableY, tableW, tableH, 36);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#E5DEC9';
  ctx.stroke();

  const leftPad = tableX + 36;
  const rightPad = tableX + tableW - 36;

  // Row 1: Pangkalan
  ctx.textAlign = 'left';
  ctx.fillStyle = '#6B5744';
  ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Pangkalan', leftPad, tableY + 76);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#23170D';
  ctx.font = '800 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(card.namaSekolah, rightPad, tableY + 76);

  ctx.strokeStyle = '#F3ECE0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftPad, tableY + 110);
  ctx.lineTo(rightPad, tableY + 110);
  ctx.stroke();

  // Row 2: NIP / Regu
  ctx.textAlign = 'left';
  ctx.fillStyle = '#6B5744';
  ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(card.nipAtauReguLabel, leftPad, tableY + 180);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#23170D';
  ctx.font = 'bold 30px "JetBrains Mono", monospace';
  ctx.fillText(card.nipAtauReguValue, rightPad, tableY + 180);

  ctx.beginPath();
  ctx.moveTo(leftPad, tableY + 214);
  ctx.lineTo(rightPad, tableY + 214);
  ctx.stroke();

  // Row 3: ID Kartu
  ctx.textAlign = 'left';
  ctx.fillStyle = '#6B5744';
  ctx.font = '600 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ID Kartu', leftPad, tableY + 284);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#4A2C11';
  ctx.font = '800 30px "JetBrains Mono", monospace';
  ctx.fillText(card.nomorKartu, rightPad, tableY + 284);

  // 7. BOTTOM FOOTER BAND (Enlarged Text)
  const footerH = 92;
  const footerY = height - footerH;
  const footerGrad = ctx.createLinearGradient(0, footerY, width, footerY);
  footerGrad.addColorStop(0, colors.gradStart);
  footerGrad.addColorStop(0.5, colors.gradMid);
  footerGrad.addColorStop(1, colors.gradEnd);
  ctx.fillStyle = footerGrad;
  ctx.fillRect(0, footerY, width, footerH);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#F3D299';
  ctx.font = '800 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    'PANITIA PESTA PENGGALANG KEC. MUARA KAMAN',
    width / 2,
    footerY + 56
  );

  ctx.restore();

  // Outer Rounded Card Border (#4A2C11)
  ctx.beginPath();
  ctx.roundRect(4, 4, width - 8, height - 8, 56);
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#4A2C11';
  ctx.stroke();

  return canvas;
}

/**
 * Downloads a single Portrait ID Card as PNG (matching the preview 100%)
 */
export async function downloadIdCardAsPng(card: IdCardPerson): Promise<void> {
  const canvas = await renderIdCardToCanvas(card);
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const safeName = card.nama.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.href = dataUrl;
  link.download = `Kartu_${card.kategori.replace(/\s+/g, '_')}_${safeName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads a single Portrait ID Card directly as a PDF (.pdf)
 */
export async function downloadSingleIdCardAsPdf(card: IdCardPerson): Promise<void> {
  const canvas = await renderIdCardToCanvas(card);
  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [86, 132],
  });
  pdf.addImage(imgData, 'JPEG', 0, 0, 86, 132);
  const safeName = card.nama.replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`Kartu_${card.kategori.replace(/\s+/g, '_')}_${safeName}.pdf`);
}

/**
 * Renders all selected Portrait ID Cards using the exact preview renderer and packs them
 * into a multi-page A4 Portrait PDF (.pdf) file (4 cards per page, 2x2 grid) and downloads it immediately.
 */
export async function downloadAllCardsAsPdf(
  reg: SubmittedRegistration,
  cards: IdCardPerson[]
): Promise<void> {
  if (cards.length === 0) return;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210mm x 297mm
  });

  const cardWidthMm = 86;
  const cardHeightMm = 132;
  const marginX = 14;
  const marginY = 12;
  const gapX = 10;
  const gapY = 9;

  for (let i = 0; i < cards.length; i++) {
    const slotIndex = i % 4;
    if (i > 0 && slotIndex === 0) {
      pdf.addPage('a4', 'portrait');
    }

    const col = slotIndex % 2;
    const row = Math.floor(slotIndex / 2);
    const x = marginX + col * (cardWidthMm + gapX);
    const y = marginY + row * (cardHeightMm + gapY);

    const canvas = await renderIdCardToCanvas(cards[i]);
    const imgData = canvas.toDataURL('image/jpeg', 0.94);
    pdf.addImage(imgData, 'JPEG', x, y, cardWidthMm, cardHeightMm);
  }

  const safeSchool = reg.namaSekolah.replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`Kartu_Peserta_dan_Pembina_${safeSchool}.pdf`);
}

/**
 * Downloads the Admin Recap (Rekapitulasi Pendaftaran Pesta Penggalang) directly as a PDF (.pdf)
 */
export function downloadAdminRecapAsPdf(
  submissions: SubmittedRegistration[]
): void {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4', // 297mm x 210mm
  });

  const totalRegu = submissions.reduce((acc, s) => acc + (s.jumlahRegu || 2), 0);
  const totalDana = submissions.reduce((acc, s) => acc + (s.totalBiaya || 0), 0);

  // Header
  pdf.setFillColor(74, 44, 17); // #4A2C11
  pdf.rect(10, 10, 277, 26, 'F');

  pdf.setTextColor(243, 210, 153);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text(
    'GERAKAN PRAMUKA KWARTIR RANTING KECAMATAN MUARA KAMAN',
    148.5,
    18,
    { align: 'center' }
  );

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(15);
  pdf.text(
    'REKAPITULASI PENDAFTARAN SEKOLAH PESTA PENGGALANG',
    148.5,
    26,
    { align: 'center' }
  );

  pdf.setFontSize(9);
  pdf.text(
    `Total Sekolah: ${submissions.length}  |  Total Regu: ${totalRegu} (${
      submissions.length * 16
    } Peserta)  |  Total Biaya: ${formatRupiah(totalDana)}`,
    148.5,
    33,
    { align: 'center' }
  );

  let y = 42;

  const drawTableHeader = (topY: number) => {
    pdf.setFillColor(239, 232, 220);
    pdf.rect(10, topY, 277, 9, 'F');
    pdf.setDrawColor(194, 178, 153);
    pdf.rect(10, topY, 277, 9, 'S');
    pdf.setTextColor(35, 23, 13);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('No', 12, topY + 6);
    pdf.text('Sekolah & Kepala Sekolah', 18, topY + 6);
    pdf.text('Pembina Putra & Putri (NIP)', 66, topY + 6);
    pdf.text('8 Peserta Putra (Nama & Tempat, Tanggal Lahir)', 116, topY + 6);
    pdf.text('8 Peserta Putri (Nama & Tempat, Tanggal Lahir)', 186, topY + 6);
    pdf.text('Biaya & Status', 256, topY + 6);
  };

  drawTableHeader(y);
  y += 9;

  submissions.forEach((s, idx) => {
    const rowHeight = 68;
    if (y + rowHeight > 198) {
      pdf.addPage('a4', 'landscape');
      y = 14;
      drawTableHeader(y);
      y += 9;
    }

    // Zebra row background
    if (idx % 2 === 1) {
      pdf.setFillColor(250, 247, 242);
      pdf.rect(10, y, 277, rowHeight, 'F');
    }

    pdf.setDrawColor(216, 206, 190);
    pdf.rect(10, y, 277, rowHeight, 'S');

    // Vertical column dividers for neat alignment
    [16.5, 64, 114, 184, 254].forEach((colX) => {
      pdf.line(colX, y, colX, y + rowHeight);
    });

    const topPad = y + 5;

    // Col 0: No
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(35, 23, 13);
    pdf.text(String(idx + 1), 12, topPad);

    // Col 1: Sekolah & Kepsek
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    const schoolLines = pdf.splitTextToSize(s.namaSekolah || '-', 45);
    pdf.text(schoolLines.slice(0, 2), 18, topPad);

    const afterSchoolY = topPad + (schoolLines.length > 1 ? 8 : 4.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(92, 67, 40);
    pdf.text(`No: ${s.nomorRegistrasi}`, 18, afterSchoolY);

    pdf.setTextColor(35, 23, 13);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Kepala Sekolah:', 18, afterSchoolY + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.text((s.namaKepalaSekolah || '-').slice(0, 28), 18, afterSchoolY + 9);
    pdf.text(`NIP: ${s.nipKepalaSekolah || '-'}`, 18, afterSchoolY + 13);
    pdf.setTextColor(107, 87, 68);
    pdf.text(`Daftar: ${s.tanggalDaftar}`, 18, afterSchoolY + 18);

    // Col 2: Pembina Putra & Putri + NIP
    pdf.setTextColor(139, 30, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.2);
    pdf.text('Pembina Putra:', 66, topPad);
    pdf.setTextColor(35, 23, 13);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.8);
    pdf.text(`1. ${(s.namaPembinaPutra || '-').slice(0, 26)}`, 66, topPad + 4);
    pdf.text(`   NIP: ${s.nipPembinaPutra || '-'}`, 66, topPad + 7.5);
    pdf.text(`2. ${(s.namaPembinaPutra2 || '-').slice(0, 26)}`, 66, topPad + 12);
    pdf.text(`   NIP: ${s.nipPembinaPutra2 || '-'}`, 66, topPad + 15.5);

    pdf.setTextColor(75, 30, 120);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7.2);
    pdf.text('Pembina Putri:', 66, topPad + 22);
    pdf.setTextColor(35, 23, 13);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(6.8);
    pdf.text(`1. ${(s.namaPembinaPutri || '-').slice(0, 26)}`, 66, topPad + 26);
    pdf.text(`   NIP: ${s.nipPembinaPutri || '-'}`, 66, topPad + 29.5);
    pdf.text(`2. ${(s.namaPembinaPutri2 || '-').slice(0, 26)}`, 66, topPad + 34);
    pdf.text(`   NIP: ${s.nipPembinaPutri2 || '-'}`, 66, topPad + 37.5);

    // Col 3: Peserta Putra (8) + Tempat, Tanggal Lahir Lengkap (2 baris per peserta agar tahun lahir utuh)
    s.pesertaPutra.forEach((p, i) => {
      const ttl = formatTtlDisplay(s.tempatLahirPutra?.[i], s.tanggalLahirPutra?.[i]);
      const itemY = topPad - 0.5 + i * 7.8;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6.8);
      pdf.setTextColor(35, 23, 13);
      pdf.text(`${i + 1}. ${(p || '-').slice(0, 34)}`, 116, itemY);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.3);
      pdf.setTextColor(92, 67, 40);
      pdf.text(`   TTL: ${ttl}`, 116, itemY + 3.2);
    });

    // Col 4: Peserta Putri (8) + Tempat, Tanggal Lahir Lengkap (2 baris per peserta agar tahun lahir utuh)
    s.pesertaPutri.forEach((p, i) => {
      const ttl = formatTtlDisplay(s.tempatLahirPutri?.[i], s.tanggalLahirPutri?.[i]);
      const itemY = topPad - 0.5 + i * 7.8;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(6.8);
      pdf.setTextColor(35, 23, 13);
      pdf.text(`${i + 1}. ${(p || '-').slice(0, 34)}`, 186, itemY);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6.3);
      pdf.setTextColor(92, 67, 40);
      pdf.text(`   TTL: ${ttl}`, 186, itemY + 3.2);
    });

    // Col 5: Biaya & Status
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(200, 30, 30);
    pdf.text(formatRupiah(s.totalBiaya), 256, topPad);
    pdf.setTextColor(35, 23, 13);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text(`${s.jumlahRegu} Regu`, 256, topPad + 5);
    pdf.text(s.statusVerifikasi || 'Menunggu Verifikasi', 256, topPad + 10);

    y += rowHeight;
  });

  pdf.save(
    `Rekap_Pendaftaran_Pesta_Penggalang_Muara_Kaman_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
  );
}
