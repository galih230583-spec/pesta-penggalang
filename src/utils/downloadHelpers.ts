import {
  SubmittedRegistration,
  INFO_PEMBAYARAN,
  formatRupiah,
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
 * Renders a high-resolution PNG of the official Registration Receipt (Bukti Pendaftaran & Pembayaran)
 * so users on mobile or inside sandboxed iframes can save it directly as an image.
 */
export async function downloadReceiptAsPng(reg: SubmittedRegistration): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 1200;
  const height = 1650;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(0, 0, width, height);

  // Outer Card Border
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#D8CEBE';
  ctx.lineWidth = 4;
  ctx.fillRect(40, 40, width - 80, height - 80);
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Header Banner (Pramuka Dark Brown + Red Stripe)
  ctx.fillStyle = '#4A2C11';
  ctx.fillRect(40, 40, width - 80, 170);
  ctx.fillStyle = '#C81E1E';
  ctx.fillRect(40, 210, width - 80, 12);

  // Header Text
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

  // Section 1: Identitas Sekolah & Pembina
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
  let rowY = y + 45;

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

  // Right column: Pembina Putra 1 & 2, Putri 1 & 2
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

  // Section 2: Daftar Peserta Putra & Putri
  y = 605;
  ctx.fillStyle = '#4A2C11';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('2. DAFTAR PESERTA REGU PUTRA (8) & REGU PUTRI (8)', 80, y);

  y += 20;
  // Putra Box
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
  ctx.font = '18px sans-serif';
  reg.pesertaPutra.forEach((nama, idx) => {
    const label = idx === 0 ? ' [Pinru]' : idx === 1 ? ' [Wapinru]' : '';
    ctx.fillText(`${idx + 1}. ${nama || '-'}${label}`, 105, y + 82 + idx * 38);
  });

  // Putri Box
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
  ctx.font = '18px sans-serif';
  reg.pesertaPutri.forEach((nama, idx) => {
    const label = idx === 0 ? ' [Pinru]' : idx === 1 ? ' [Wapinru]' : '';
    ctx.fillText(`${idx + 1}. ${nama || '-'}${label}`, 645, y + 82 + idx * 38);
  });

  // Section 3: Rincian Pembayaran & Bukti Transfer
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

  // Draw payment proof image on right side if it's an image
  if (reg.buktiPembayaran && reg.buktiPembayaran.fileType.startsWith('image/')) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = reg.buktiPembayaran!.dataUrl;
      });
      if (img.width > 0 && img.height > 0) {
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
    } catch {
      // Ignore image draw failure
    }
  }

  // Footer
  ctx.fillStyle = '#6B5744';
  ctx.font = '16px sans-serif';
  ctx.fillText(
    'Dokumen Resmi Panitia Pesta Penggalang — Kwartir Ranting Gerakan Pramuka Kecamatan Muara Kaman',
    80,
    1575
  );

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
 * Renders an individual Portrait ID Card (Kartu Nama Peserta / Pembina) onto a high-res PNG
 * and triggers an immediate file download.
 */
export async function downloadIdCardAsPng(card: IdCardPerson): Promise<void> {
  const canvas = document.createElement('canvas');
  const width = 900;
  const height = 1320;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Determine theme colors by category
  const theme =
    card.kategori === 'PEMBINA PUTRA' || card.kategori === 'PEMBINA PUTRI'
      ? {
          headerBg: '#4A2C11',
          subHeaderBg: '#B45309',
          badgeBg: '#FEF3C7',
          badgeText: '#92400E',
          accent: '#D97706',
          roleBar: '#4A2C11',
        }
      : card.kategori === 'PESERTA PUTRA'
      ? {
          headerBg: '#7F1D1D',
          subHeaderBg: '#C81E1E',
          badgeBg: '#FEE2E2',
          badgeText: '#991B1B',
          accent: '#C81E1E',
          roleBar: '#8B1E1E',
        }
      : {
          headerBg: '#4B1E78',
          subHeaderBg: '#6B21A8',
          badgeBg: '#F3E8FF',
          badgeText: '#581C87',
          accent: '#6B21A8',
          roleBar: '#4B1E78',
        };

  // Card base background
  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(0, 0, width, height);

  // Decorative top header block
  ctx.fillStyle = theme.headerBg;
  ctx.fillRect(0, 0, width, 285);

  // Red-white Pramuka neck-scarf (Kacu) ribbon under header
  ctx.fillStyle = '#C81E1E';
  ctx.fillRect(0, 285, width, 16);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 301, width, 10);
  ctx.fillStyle = theme.subHeaderBg;
  ctx.fillRect(0, 311, width, 10);

  // Lanyard Slot Hole at very top center
  ctx.fillStyle = '#FAF7F2';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 70, 26, 140, 24, 12);
  ctx.fill();

  // Header Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#F3D299';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('GERAKAN PRAMUKA KWARTIR RANTING', width / 2, 105);
  ctx.fillText('KECAMATAN MUARA KAMAN', width / 2, 138);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px sans-serif';
  ctx.fillText('PESTA PENGGALANG 2026', width / 2, 198);

  ctx.fillStyle = '#EAE0D5';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('KARTU TANDA IDENTITAS RESMI', width / 2, 245);

  // Photo / Avatar Circle Frame in Center
  const centerX = width / 2;
  const centerY = 500;
  const radius = 135;

  // Outer ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 12, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = theme.accent;
  ctx.stroke();

  // Inner circle background
  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = theme.badgeBg;
  ctx.fillRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

  if (card.customPhotoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = card.customPhotoUrl!;
      });
      if (img.width > 0 && img.height > 0) {
        const scale = Math.max((radius * 2) / img.width, (radius * 2) / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, centerX - w / 2, centerY - h / 2, w, h);
      }
    } catch {
      // Fallback to initials
    }
  } else {
    // Draw clean Scout Initials & Tunas Silhouette
    const initials = card.nama
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join('');
    ctx.fillStyle = theme.badgeText;
    ctx.font = 'bold 92px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials || 'GP', centerX, centerY);
  }
  ctx.restore();
  ctx.textBaseline = 'alphabetic';

  // Category Pill Banner
  ctx.fillStyle = theme.roleBar;
  ctx.beginPath();
  ctx.roundRect(width / 2 - 230, 665, 460, 64, 32);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(card.kategori, width / 2, 707);

  // Person Name
  ctx.fillStyle = '#23170D';
  ctx.font = 'bold 42px sans-serif';
  const maxNameWidth = 780;
  let displayName = card.nama;
  if (ctx.measureText(displayName).width > maxNameWidth) {
    ctx.font = 'bold 34px sans-serif';
  }
  ctx.fillText(displayName, width / 2, 795);

  // Jabatan / Peran
  ctx.fillStyle = theme.accent;
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(card.jabatan, width / 2, 840);

  // Info Box (Pangkalan Sekolah, NIP/Regu, Kepala Sekolah)
  const boxX = 75;
  const boxY = 880;
  const boxW = width - 150;
  const boxH = 270;

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 24);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#E5DEC9';
  ctx.stroke();

  ctx.textAlign = 'left';
  const labelX = boxX + 35;
  const valX = boxX + 265;

  // Row 1: Pangkalan
  ctx.fillStyle = '#6B5744';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Pangkalan', labelX, boxY + 58);
  ctx.fillStyle = '#23170D';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(`:  ${card.namaSekolah}`, valX, boxY + 58);

  // Divider 1
  ctx.strokeStyle = '#EFE8DC';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(labelX, boxY + 88);
  ctx.lineTo(boxX + boxW - 35, boxY + 88);
  ctx.stroke();

  // Row 2: NIP / Regu
  ctx.fillStyle = '#6B5744';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(card.nipAtauReguLabel, labelX, boxY + 142);
  ctx.fillStyle = '#23170D';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(`:  ${card.nipAtauReguValue}`, valX, boxY + 142);

  // Divider 2
  ctx.beginPath();
  ctx.moveTo(labelX, boxY + 172);
  ctx.lineTo(boxX + boxW - 35, boxY + 172);
  ctx.stroke();

  // Row 3: ID Kartu
  ctx.fillStyle = '#6B5744';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('No. ID Kartu', labelX, boxY + 225);
  ctx.fillStyle = '#4A2C11';
  ctx.font = 'bold 24px monospace';
  ctx.fillText(`:  ${card.nomorKartu}`, valX, boxY + 225);

  // Bottom Footer Band
  ctx.fillStyle = theme.headerBg;
  ctx.fillRect(0, height - 95, width, 95);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#F3D299';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(
    'PANITIA PELAKSANA PESTA PENGGALANG KECAMATAN MUARA KAMAN',
    width / 2,
    height - 40
  );

  // Outer Frame Border
  ctx.strokeStyle = '#4A2C11';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, width - 10, height - 10);

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
 * Generates and downloads a standalone, print-ready HTML document for all 20 Portrait ID Cards
 * of a school so the user can open and print to PDF/paper anywhere.
 */
export function downloadPrintableCardsHtml(
  reg: SubmittedRegistration,
  cards: IdCardPerson[]
): void {
  const cardItemsHtml = cards
    .map((card) => {
      const isPembina =
        card.kategori === 'PEMBINA PUTRA' || card.kategori === 'PEMBINA PUTRI';
      const headerColor = isPembina
        ? '#4A2C11'
        : card.kategori === 'PESERTA PUTRA'
        ? '#8B1E1E'
        : '#4B1E78';
      const badgeColor = isPembina
        ? '#B45309'
        : card.kategori === 'PESERTA PUTRA'
        ? '#C81E1E'
        : '#6B21A8';

      const initials = card.nama
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join('');

      return `
      <div class="id-card">
        <div class="card-header" style="background:${headerColor}">
          <div class="lanyard-hole"></div>
          <div class="sub-org">GERAKAN PRAMUKA KWARRAN MUARA KAMAN</div>
          <div class="event-title">PESTA PENGGALANG</div>
          <div class="card-subtitle">KARTU TANDA IDENTITAS RESMI</div>
        </div>
        <div class="kacu-strip"></div>
        <div class="card-body">
          <div class="avatar-ring" style="border-color:${badgeColor}">
            ${
              card.customPhotoUrl
                ? `<img src="${card.customPhotoUrl}" alt="${card.nama}" />`
                : `<span>${initials || 'GP'}</span>`
            }
          </div>
          <div class="role-badge" style="background:${badgeColor}">${card.kategori}</div>
          <div class="person-name">${card.nama}</div>
          <div class="person-jabatan" style="color:${headerColor}">${card.jabatan}</div>
          <table class="info-table">
            <tr>
              <td class="lbl">Pangkalan</td>
              <td class="val">: ${card.namaSekolah}</td>
            </tr>
            <tr>
              <td class="lbl">${card.nipAtauReguLabel}</td>
              <td class="val">: ${card.nipAtauReguValue}</td>
            </tr>
            <tr>
              <td class="lbl">ID Kartu</td>
              <td class="val mono">: ${card.nomorKartu}</td>
            </tr>
          </table>
        </div>
        <div class="card-footer" style="background:${headerColor}">
          PANITIA PESTA PENGGALANG KEC. MUARA KAMAN
        </div>
      </div>`;
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Kartu Peserta & Pembina — ${reg.namaSekolah}</title>
  <style>
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #FAF7F2; margin: 0; padding: 20px; color: #23170D; }
    .toolbar { background: #4A2C11; color: #fff; padding: 14px 24px; border-radius: 12px; max-width: 900px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: space-between; }
    .toolbar button { background: #C81E1E; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 14px; cursor: pointer; }
    .grid { display: grid; grid-template-columns: repeat(2, 86mm); gap: 10mm; justify-content: center; margin: 0 auto; }
    .id-card { width: 86mm; height: 126mm; background: #FAF7F2; border: 2px solid #4A2C11; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; page-break-inside: avoid; break-inside: avoid; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .card-header { color: #fff; text-align: center; padding: 10px 10px 12px; position: relative; }
    .lanyard-hole { width: 32px; height: 6px; background: #FAF7F2; border-radius: 4px; margin: 0 auto 6px; }
    .sub-org { font-size: 8.5px; color: #F3D299; font-weight: 700; letter-spacing: 0.4px; }
    .event-title { font-size: 15px; font-weight: 800; margin: 2px 0; }
    .card-subtitle { font-size: 8px; color: #EAE0D5; font-weight: 600; }
    .kacu-strip { height: 6px; background: linear-gradient(90deg, #C81E1E 0%, #C81E1E 50%, #FFFFFF 50%, #FFFFFF 100%); border-bottom: 1px solid #D8CEBE; }
    .card-body { padding: 10px 14px; text-align: center; flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .avatar-ring { width: 68px; height: 68px; border-radius: 50%; border: 3px solid #4A2C11; background: #fff; display: flex; align-items: center; justify-content: center; overflow: hidden; font-weight: 800; font-size: 24px; color: #4A2C11; margin-bottom: 8px; }
    .avatar-ring img { width: 100%; height: 100%; object-fit: cover; }
    .role-badge { color: #fff; font-size: 9px; font-weight: 800; padding: 4px 14px; border-radius: 99px; letter-spacing: 0.5px; margin-bottom: 6px; }
    .person-name { font-size: 14px; font-weight: 800; color: #23170D; line-height: 1.25; margin-bottom: 2px; }
    .person-jabatan { font-size: 10px; font-weight: 700; margin-bottom: 8px; }
    .info-table { width: 100%; background: #fff; border: 1px solid #E5DEC9; border-radius: 8px; padding: 6px 8px; font-size: 9.5px; text-align: left; border-collapse: collapse; }
    .info-table td { padding: 3px 4px; border-bottom: 1px solid #F3ECE0; }
    .info-table tr:last-child td { border-bottom: none; }
    .info-table .lbl { color: #6B5744; font-weight: 600; width: 34%; }
    .info-table .val { color: #23170D; font-weight: 700; }
    .info-table .mono { font-family: monospace; }
    .card-footer { color: #F3D299; text-align: center; font-size: 8px; font-weight: 700; padding: 7px 6px; letter-spacing: 0.4px; }
    @media print {
      body { background: #fff; padding: 0; }
      .toolbar { display: none !important; }
      .grid { gap: 6mm; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <strong>Lembar Siap Cetak Kartu Peserta & Pembina (${cards.length} Kartu Portrait)</strong><br/>
      <span style="font-size:12px;color:#F3D299">${reg.namaSekolah} — No. Registrasi: ${reg.nomorRegistrasi}</span>
    </div>
    <button onclick="window.print()">Cetak Sekarang / Simpan PDF</button>
  </div>
  <div class="grid">
    ${cardItemsHtml}
  </div>
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeSchool = reg.namaSekolah.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.href = url;
  link.download = `Lembar_Cetak_Kartu_Peserta_${safeSchool}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a standalone, print-ready HTML document for the Admin Recap
 * (Rekapitulasi Pendaftaran Pesta Penggalang) so it works 100% reliably even in sandboxed iframes.
 */
export function downloadPrintableAdminRecapHtml(
  submissions: SubmittedRegistration[]
): void {
  const totalRegu = submissions.reduce((acc, s) => acc + (s.jumlahRegu || 2), 0);
  const totalDana = submissions.reduce((acc, s) => acc + (s.totalBiaya || 0), 0);

  const rowsHtml = submissions
    .map(
      (s, idx) => `
      <tr>
        <td style="text-align:center">${idx + 1}</td>
        <td><strong>${s.nomorRegistrasi}</strong><br/><small>${s.tanggalDaftar}</small></td>
        <td><strong>${s.namaSekolah}</strong><br/><small>Kepsek: ${s.namaKepalaSekolah} (NIP: ${
        s.nipKepalaSekolah
      })</small></td>
        <td>
          <strong>Putra:</strong><br/>
          1. ${s.namaPembinaPutra} (${s.nipPembinaPutra})<br/>
          2. ${s.namaPembinaPutra2 || '-'} (${s.nipPembinaPutra2 || '-'})<br/>
          <strong>Putri:</strong><br/>
          1. ${s.namaPembinaPutri} (${s.nipPembinaPutri})<br/>
          2. ${s.namaPembinaPutri2 || '-'} (${s.nipPembinaPutri2 || '-'})
        </td>
        <td>
          ${s.pesertaPutra.map((p, i) => `${i + 1}. ${p || '-'}`).join('<br/>')}
        </td>
        <td>
          ${s.pesertaPutri.map((p, i) => `${i + 1}. ${p || '-'}`).join('<br/>')}
        </td>
        <td style="text-align:right">
          <strong>${formatRupiah(s.totalBiaya)}</strong><br/>
          <small>${s.jumlahRegu} Regu · ${s.statusVerifikasi || 'Menunggu Verifikasi'}</small>
        </td>
      </tr>`
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Rekapitulasi Pendaftaran Pesta Penggalang — Kwarran Kecamatan Muara Kaman</title>
  <style>
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: Arial, sans-serif; margin: 0; padding: 24px; color: #23170D; background: #fff; }
    .toolbar { background: #4A2C11; color: #fff; padding: 14px 20px; border-radius: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .toolbar button { background: #15803D; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; }
    .header { text-align: center; border-bottom: 3px solid #4A2C11; padding-bottom: 14px; margin-bottom: 18px; }
    .header h1 { margin: 4px 0; font-size: 20px; color: #4A2C11; }
    .header p { margin: 2px 0; font-size: 12px; color: #5C4328; }
    .summary { display: flex; gap: 16px; margin-bottom: 18px; font-size: 13px; background: #FAF7F2; padding: 12px 16px; border: 1px solid #D8CEBE; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th, td { border: 1px solid #B8A68E; padding: 7px 8px; vertical-align: top; text-align: left; }
    th { background: #4A2C11; color: #fff; font-weight: bold; }
    tr:nth-child(even) { background: #FAF7F2; }
    @media print {
      .toolbar { display: none !important; }
      @page { size: landscape; margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <div>
      <strong>Dokumen Rekapitulasi Pendaftaran Pesta Penggalang Kecamatan Muara Kaman</strong><br/>
      <span style="font-size:12px;color:#F3D299">Buka file ini lalu tekan tombol Cetak Sekarang atau Ctrl+P untuk mencetak / menyimpan PDF</span>
    </div>
    <button onclick="window.print()">Cetak Sekarang / Simpan PDF</button>
  </div>
  <div class="header">
    <p><strong>GERAKAN PRAMUKA KWARTIR RANTING KECAMATAN MUARA KAMAN</strong></p>
    <h1>REKAPITULASI PENDAFTARAN SEKOLAH PESTA PENGGALANG</h1>
    <p>Rekening Resmi: Bank Kaltimtara 0042830798 a.n. Susilawati · Konfirmasi WA: 081253445433</p>
  </div>
  <div class="summary">
    <div><strong>Total Sekolah:</strong> ${submissions.length} Sekolah</div>
    <div><strong>Total Regu:</strong> ${totalRegu} Regu (${submissions.length * 16} Peserta)</div>
    <div><strong>Total Pembina:</strong> ${submissions.length * 4} Orang</div>
    <div><strong>Total Biaya Pendaftaran:</strong> ${formatRupiah(totalDana)}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:32px">No</th>
        <th style="width:120px">No. Registrasi</th>
        <th style="width:170px">Sekolah & Kepala Sekolah</th>
        <th style="width:200px">Pembina Pendamping (Putra & Putri)</th>
        <th>Peserta Putra (8 Orang)</th>
        <th>Peserta Putri (8 Orang)</th>
        <th style="width:120px">Total Biaya</th>
      </tr>
    </thead>
    <tbody>
      ${
        rowsHtml ||
        '<tr><td colspan="7" style="text-align:center;padding:20px">Belum ada data pendaftaran.</td></tr>'
      }
    </tbody>
  </table>
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  </script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Cetak_Rekap_Pesta_Penggalang_Muara_Kaman_${new Date()
    .toISOString()
    .slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
