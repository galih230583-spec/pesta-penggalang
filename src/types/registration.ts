export interface PaymentProofFile {
  fileName: string;
  fileSize: number;
  fileType: string;
  dataUrl: string;
  uploadedAt: string;
}

export interface RegistrationFormData {
  namaSekolah: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  namaPembinaPutra: string;
  nipPembinaPutra: string;
  namaPembinaPutra2: string;
  nipPembinaPutra2: string;
  namaPembinaPutri: string;
  nipPembinaPutri: string;
  namaPembinaPutri2: string;
  nipPembinaPutri2: string;
  namaReguPutra: string;
  namaReguPutri: string;
  pesertaPutra: string[]; // 8 orang
  pesertaPutri: string[]; // 8 orang
  jumlahRegu: number; // Default 2 (Putra & Putri), biaya Rp1.300.000,00 / regu
  buktiPembayaran: PaymentProofFile | null;
  pernyataanBenar: boolean;
}

export interface SubmittedRegistration extends RegistrationFormData {
  id: string;
  nomorRegistrasi: string;
  tanggalDaftar: string;
  totalBiaya: number;
  statusVerifikasi?: 'Menunggu Verifikasi' | 'Terverifikasi';
}

export const BIAYA_PER_REGU = 1300000;

export const INFO_PEMBAYARAN = {
  bank: 'Bank Kaltimtara',
  noRekening: '0042830798',
  atasNama: 'Susilawati',
  biayaPerRegu: BIAYA_PER_REGU,
  biayaFormatted: 'Rp1.300.000,00',
  waPanitiaDisplay: '081253445433',
  waPanitiaInternational: '6281253445433',
};

export const INITIAL_FORM_DATA: RegistrationFormData = {
  namaSekolah: '',
  namaKepalaSekolah: '',
  nipKepalaSekolah: '',
  namaPembinaPutra: '',
  nipPembinaPutra: '',
  namaPembinaPutra2: '',
  nipPembinaPutra2: '',
  namaPembinaPutri: '',
  nipPembinaPutri: '',
  namaPembinaPutri2: '',
  nipPembinaPutri2: '',
  namaReguPutra: '',
  namaReguPutri: '',
  pesertaPutra: Array(8).fill(''),
  pesertaPutri: Array(8).fill(''),
  jumlahRegu: 2,
  buktiPembayaran: null,
  pernyataanBenar: false,
};

export function formatRupiah(amount: number): string {
  return (
    'Rp' +
    amount.toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function buildWhatsAppMessage(
  reg: SubmittedRegistration | RegistrationFormData,
  nomorReg?: string
): string {
  const totalBiaya = formatRupiah(reg.jumlahRegu * BIAYA_PER_REGU);
  const listPutra = reg.pesertaPutra
    .map(
      (nama, idx) =>
        `${idx + 1}. ${nama.trim() || '-'}${
          idx === 0 ? ' (Pinru)' : idx === 1 ? ' (Wapinru)' : ''
        }`
    )
    .join('\n');
  const listPutri = reg.pesertaPutri
    .map(
      (nama, idx) =>
        `${idx + 1}. ${nama.trim() || '-'}${
          idx === 0 ? ' (Pinru)' : idx === 1 ? ' (Wapinru)' : ''
        }`
    )
    .join('\n');

  return [
    `*KONFIRMASI PENDAFTARAN PESTA PENGGALANG*`,
    `*KWARRAN KECAMATAN MUARA KAMAN*`,
    `----------------------------------------`,
    nomorReg ? `*No. Registrasi:* ${nomorReg}` : null,
    `*Nama Sekolah:* ${reg.namaSekolah.trim()}`,
    `*Kepala Sekolah:* ${reg.namaKepalaSekolah.trim()}`,
    `*NIP Kepala Sekolah:* ${reg.nipKepalaSekolah.trim()}`,
    ``,
    `*DATA PEMBINA PENDAMPING PUTRA*`,
    `1. ${reg.namaPembinaPutra.trim()} (NIP: ${reg.nipPembinaPutra.trim()})`,
    `2. ${(reg.namaPembinaPutra2 || '-').trim()} (NIP: ${(reg.nipPembinaPutra2 || '-').trim()})`,
    ``,
    `*DATA PEMBINA PENDAMPING PUTRI*`,
    `1. ${reg.namaPembinaPutri.trim()} (NIP: ${reg.nipPembinaPutri.trim()})`,
    `2. ${(reg.namaPembinaPutri2 || '-').trim()} (NIP: ${(reg.nipPembinaPutri2 || '-').trim()})`,
    ``,
    `*DAFTAR PESERTA PUTRA (8 Orang)*${
      reg.namaReguPutra ? ` - Regu ${reg.namaReguPutra.trim()}` : ''
    }`,
    listPutra,
    ``,
    `*DAFTAR PESERTA PUTRI (8 Orang)*${
      reg.namaReguPutri ? ` - Regu ${reg.namaReguPutri.trim()}` : ''
    }`,
    listPutri,
    ``,
    `*RINCIAN PEMBAYARAN*`,
    `• Jumlah Regu: ${reg.jumlahRegu} Regu (@ Rp1.300.000,00)`,
    `• Total Biaya: ${totalBiaya}`,
    `• Tujuan Transfer: Bank Kaltimtara 0042830798 a.n. Susilawati`,
    `• Bukti Pembayaran: ${
      reg.buktiPembayaran
        ? `Sudah diunggah (${reg.buktiPembayaran.fileName})`
        : 'Terlampir'
    }`,
    `----------------------------------------`,
    `Mohon konfirmasi penerimaan pendaftaran dari pangkalan kami. Terima kasih. Salam Pramuka!`,
  ]
    .filter((line) => line !== null)
    .join('\n');
}
