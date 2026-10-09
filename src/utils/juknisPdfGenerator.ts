import { jsPDF } from 'jspdf';

/**
 * Generates and downloads the exact 32-page official document:
 * "PETUNJUK TEKNIS PESTA PENGGALANG TINGKAT SMP/MTS KECAMATAN MUARA KAMAN TAHUN 2026"
 * Faithful to the original 32 pages, text, tables, Batu Onggos logo (Page 6),
 * Panitia Stamp & Signature of Sukriansyah, S.Pd (Page 28), and Appendices (Pages 29-32).
 */
export function downloadOfficialJuknis2026Pdf(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210 x 297 mm
  });

  const LM = 25; // Left margin
  const RM = 185; // Right margin
  const PW = 210;
  const CW = RM - LM; // 160 mm content width

  const setFontTimes = (style: 'normal' | 'bold' | 'italic' | 'bolditalic' = 'normal', size = 12) => {
    doc.setFont('times', style);
    doc.setFontSize(size);
    doc.setTextColor(0, 0, 0);
  };

  const drawCenteredBold = (text: string, y: number, size = 12) => {
    setFontTimes('bold', size);
    doc.text(text, PW / 2, y, { align: 'center' });
  };

  const drawWrappedItem = (
    marker: string,
    text: string,
    xMarker: number,
    xText: number,
    y: number,
    lineHeight = 6.2,
    style: 'normal' | 'bold' | 'italic' = 'normal',
    size = 11.5
  ): number => {
    setFontTimes(style, size);
    if (marker) {
      doc.text(marker, xMarker, y);
    }
    const maxW = RM - xText;
    const lines: string[] = doc.splitTextToSize(text, maxW);
    lines.forEach((line, idx) => {
      doc.text(line, xText, y + idx * lineHeight);
    });
    return y + lines.length * lineHeight;
  };

  // =========================================================================
  // PAGE 1
  // =========================================================================
  drawCenteredBold('PETUNJUK TEKNIS', 34, 12.5);
  drawCenteredBold('PESTA PENGGALANG TINGKAT SMP/MTS KECAMATAN MUARA KAMAN', 42, 12.5);
  drawCenteredBold('TAHUN 2026', 50, 12.5);

  drawCenteredBold('BAB I PENDAHULUAN', 65, 12);

  setFontTimes('bold', 11.5);
  doc.text('A.', LM, 75);
  doc.text('Umum', LM + 8, 75);

  let y = 83;
  y = drawWrappedItem(
    '1.',
    'Gerakan Pramuka dalam melaksanakan tugas pokoknya untuk mencapai tujuan, dengan menyelenggarakan pendidikan kepramukaan dalam bentuk kegiatan yang sehat, menarik, terarah, terencana, di alam terbuka menggunakan Prinsip Dasar Kepramukaan dan Metode kepramukaan.',
    LM,
    LM + 8,
    y
  ) + 1.5;

  y = drawWrappedItem(
    '2.',
    'Gerakan Pramuka mempunyai tugas pokok menyelenggarakan pendidikan kepramukaan bagi kaum muda guna menumbuhkan tunas bangsa agar menjadi generasi yang lebih baik, bertanggung jawab, mampu membina dan mengisi kemerdekaan serta membangun dunia yang lebih baik.',
    LM,
    LM + 8,
    y
  ) + 1.5;

  y = drawWrappedItem(
    '3.',
    'Kegiatan-kegiatan dalam kepramukaan untuk mencapai sasaran tersebut merupakan kegiatan yang menantang, sesuai dengan kepentingan dan kebutuhan Pramuka serta situasi dan kondisi, dengan menerapkan prinsip modem, bermanfaat dan taat azas.',
    LM,
    LM + 8,
    y
  ) + 1.5;

  y = drawWrappedItem(
    '4.',
    'Kegiatan yang berkelompok, bekerja sama dan berkompetisi merupakan salah satu metode pendidikan yang efektif dalam mencapai tujuan dan sasaran Gerakan Pramuka.',
    LM,
    LM + 8,
    y
  ) + 1.5;

  y = drawWrappedItem(
    '5.',
    'Lomba dalam Gerakan Pramuka adalah kegiatan pendidikan yang menarik dan menantang yang mengandung Pendidikan.',
    LM,
    LM + 8,
    y
  ) + 1.5;

  y = drawWrappedItem(
    '6.',
    'Berlomba bukan hanya untuk menang tetapi berlomba untuk mengamalkan Kode Kehormatan Pramuka yaitu Tri Satya dan Dasa darma.',
    LM,
    LM + 8,
    y
  ) + 1.5;

  y = drawWrappedItem(
    '7.',
    'Perkemahan Pramuka Penggalang merupakan salah satu cara untuk mencapai tujuan dan sasaran Gerakan Pramuka.',
    LM,
    LM + 8,
    y
  ) + 1.5;

  drawWrappedItem(
    '8.',
    'Kwartir Ranting Gerakan Pramuka Muara Kaman telah menetapkan rencana kerja tentang peningkatan kualitas pendidikan dan kegiatan peserta didik merupakan salah satu program prioritas. Perkemahan',
    LM,
    LM + 8,
    y
  );

  // =========================================================================
  // PAGE 2
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem(
    '',
    'Pramuka tidak hanya merupakan upaya meningkatkan kualitas Pramuka Penggalang tetapi juga untuk mengevaluasi implementasi rencana kerja yang berkaitan dengan kualitas kegiatan peserta didik yang dilaksanakan di Gudep dan Kwartir.',
    LM,
    LM + 8,
    y
  ) + 2;

  y = drawWrappedItem(
    '9.',
    'Berlomba merupakan sifat anak, remaja, dan kaum muda dalam kegiatannya sehari-hari. Kegiatan yang bersifat lomba merupakan salah satu alat pendidikan yang efektif dalam merangsang dan memotivasi peserta untuk berprestasi dalam rangka mencapai tujuan dan sasaran Gerakan Pramuka.',
    LM,
    LM + 8,
    y
  ) + 2;

  y = drawWrappedItem(
    '10.',
    'Kegiatan-kegiatan dalam kepramukaan untuk mencapai sasaran tersebut haruslah kegiatan yang menantang, sesuai dengan kepentingan dan kebutuhan para Pramuka serta situasi dan kondisi, modern, bermanfaat dan taat azas dilaksanakan dengan Prinsip Dasar Kepramukaan dan Metode Kepramukaan.',
    LM,
    LM + 8,
    y
  ) + 8;

  setFontTimes('bold', 11.5);
  doc.text('B.', LM, y);
  doc.text('Pengertian', LM + 8, y);
  y += 8;

  y = drawWrappedItem(
    '1.',
    'Pramuka Penggalang adalah sebutan bagi anggota muda dalam Gerakan pramuka yang berusia antara 11-15 tahun.',
    LM,
    LM + 8,
    y
  ) + 2;

  y = drawWrappedItem(
    '2.',
    'Regu adalah kelompok Pramuka Penggalang.',
    LM,
    LM + 8,
    y
  ) + 2;

  y = drawWrappedItem(
    '3.',
    'Regu Utuh adalah keanggotaan regu orang bersifat tetap dan mempunyai keterikatan yang kuat.',
    LM,
    LM + 8,
    y
  ) + 2;

  drawWrappedItem(
    '4.',
    'Perkemahan Pramuka adalah salah satu bentuk kegiatan dalam Gerakan Pramuka yang dilaksanakan di alam terbuka dan menjadi sarana pendidikan karakter, keterampilan, dan kebersamaan bagi peserta didik. Perkemahan merupakan bagian dari sistem Among, yaitu sistem pendidikan khas Pramuka yang menekankan pada prinsip belajar sambil melakukan (learning by doing) dan pembentukan watak melalui pengalaman langsung.',
    LM,
    LM + 8,
    y
  );

  // =========================================================================
  // PAGE 3
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem(
    '5.',
    'Pembina Pendamping Regu adalah anggota dewasa Gerakan Pramuka yang bertugas mendampingi secara aktif Pramuka Penggalang.',
    LM,
    LM + 8,
    y
  ) + 2;

  y = drawWrappedItem(
    '6.',
    'Tim Penilai adalah tim yang memberi penilaian kepada peserta PESTA PENGGALANG dalam usahanya mencapai Regu Pramuka Penggalang Berprestasi dan Pasukan Berprestasi.',
    LM,
    LM + 8,
    y
  ) + 2;

  y = drawWrappedItem(
    '7.',
    'Sangga Kerja Pelaksana adalah suatu kepanitiaan yang dibentuk oleh Kwarran Muara Kaman terdiri dari Andalan, Pelatih Pembina Pramuka, Pembina Pramuka, Pramuka Penegak, Pramuka Pandega dan orang lain yang dianggap perlu.',
    LM,
    LM + 8,
    y
  ) + 8;

  setFontTimes('bold', 11.5);
  doc.text('C.', LM, y);
  doc.text('Dasar', LM + 8, y);
  y += 8;

  const dasarItems = [
    'Undang-Undang Republik Indonesia Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;',
    'Undang-Undang Republik Indonesia Nomor 12 Tahun 2010 tentang Gerakan Pramuka;',
    'Keputusan Munas Gerakan Pramuka Nomor : 07/Munas/2018 tentang Anggaran Dasar Dan Anggaran Rumah Tangga Gerakan Pramuka;',
    'Peraturan Pemerintah Nomor 132/KM/1976 tanggal 31 Desember 1967 tentang Penyelenggaraan Perkemahan Besar Penggalang;',
    'Keputusan Kwartir Nasional Gerakan Pramuka Nomor 130/KN/76 tentang Petunjuk Penyelenggaraan Pertemuan Pramuka;',
    'Keputusan Kwartir Nasional Gerakan Pramuka Nomor 033/KN/78 tentang Petunjuk Penyelenggaraan Lomba Tingkat Regu Pramuka Penggalang;',
    'Rencana Kerja Kwartir Ranting Gerakan Pramuka Muara Kaman tahun 2022-2026;',
    'Program Kerja Kwartir Ranting Gerakan Pramuka Muara Kaman tahun 2026.',
  ];
  dasarItems.forEach((item, idx) => {
    y = drawWrappedItem(`${idx + 1}.`, item, LM, LM + 8, y) + 1.5;
  });

  y += 6;
  setFontTimes('bold', 11.5);
  doc.text('D.', LM, y);
  doc.text('Maksud dan Tujuan', LM + 8, y);
  y += 8;

  drawWrappedItem(
    '1.',
    'Petunjuk teknis ini dimaksudkan sebagai pedoman dan pegangan bagi penyelenggara, pelaksana, dan peserta PESTA PENGGALANG Tingkat',
    LM,
    LM + 8,
    y
  );

  // =========================================================================
  // PAGE 4
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem(
    '',
    'SMP/MTs Kecamatan Muara Kaman Tahun 2026 dalam melaksanakan tugas, fungsi, dan wewenangnya serta panduan bagi Pembina Pendamping dalam menyiapkan peserta PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026.',
    LM,
    LM + 8,
    y
  ) + 2;

  y = drawWrappedItem(
    '2.',
    'Petunjuk teknis ini disusun dengan tujuan agar persiapan, pelaksanaan, dan penyelesaian kegiatan dapat berjalan dengan baik, teratur, dan terarah sesuai dengan rencana yang telah ditetapkan.',
    LM,
    LM + 8,
    y
  ) + 8;

  setFontTimes('bold', 11.5);
  doc.text('E.', LM, y);
  doc.text('Ruang Lingkup', LM + 8, y);
  y += 8;

  y = drawWrappedItem(
    '',
    'Sistematika Petunjuk Teknis PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026 meliputi:',
    LM,
    LM + 8,
    y
  ) + 2;

  const babList = [
    'Bab I Pendahuluan',
    'Bab II Penyelenggaraan',
    'Bab III Peserta dan Pembina Pendamping',
    'Bab IV Perkemahan dan Tata Tertib',
    'Bab V Kegiatan',
    'Bab VI Pelaksanaan Kegiatan Bab VII Penutup',
  ];
  babList.forEach((b) => {
    y = drawWrappedItem('', b, LM, LM + 8, y, 7);
  });

  // =========================================================================
  // PAGE 5
  // =========================================================================
  doc.addPage();
  drawCenteredBold('BAB II', 35, 12);
  drawCenteredBold('PENYELENGGARAAN', 43, 12);

  y = 54;
  setFontTimes('bold', 11.5);
  doc.text('1.', LM, y);
  doc.text('Nama Kegiatan', LM + 8, y);
  y += 7;
  y = drawWrappedItem(
    '',
    'PESTA PENGGALANG tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026',
    LM,
    LM + 8,
    y
  ) + 3;

  setFontTimes('bold', 11.5);
  doc.text('2.', LM, y);
  doc.text('Motto', LM + 8, y);
  y += 7;
  y = drawWrappedItem('', '"Satyaku Kudarmakan, Darmaku Kubaktikan"', LM, LM + 8, y) + 3;

  setFontTimes('bold', 11.5);
  doc.text('3.', LM, y);
  doc.text('Tema', LM + 8, y);
  y += 7;
  y = drawWrappedItem(
    '',
    '" Membangun Generasi Muda yang Mandiri, Berkarakter, dan Berjiwa Gotong Royong."',
    LM,
    LM + 8,
    y
  ) + 3;

  setFontTimes('bold', 11.5);
  doc.text('4.', LM, y);
  doc.text('Tujuan', LM + 8, y);
  y += 7;
  y = drawWrappedItem(
    '',
    'Kegiatan PESTA PENGGALANG tingkat SMP (Pramuka Penggalang) diselenggarakan dengan Tujuan utama adalah penguatan karakter peserta didik, menumbuhkan kepedulian terhadap lingkungan, Peningkatan keterampilan Kebencanaan Musiman (Karhutla) serta untuk membina persaudaraan, meningkatkan kemandirian, serta memperluas wawasan para peserta melalui kegiatan rekreasi yang edukatif dan kreatif di luar lingkungan sekolah.',
    LM,
    LM + 8,
    y
  ) + 3;

  setFontTimes('bold', 11.5);
  doc.text('5.', LM, y);
  doc.text('Sasaran', LM + 8, y);
  y += 7;
  y = drawWrappedItem(
    '',
    'Sasaran kegiatan ini adalah regu pramuka penggalang dari masing-masing Gugus depan se- Kecamatan Muara Kaman.',
    LM,
    LM + 8,
    y
  ) + 3;

  setFontTimes('bold', 11.5);
  doc.text('6.', LM, y);
  doc.text('Waktu & Tempat', LM + 8, y);
  y += 7;
  y = drawWrappedItem('', "Waktu : Jum'at 30 Oktober - Sabtu, 31 Oktober 2026", LM, LM + 8, y) + 6;
  drawWrappedItem(
    '',
    'Tempat : Bumi Perkemahan Lapangan Sepak Bola Mandala Desa Teratak Kecamatan Muara Kaman',
    LM,
    LM + 8,
    y
  );

  // =========================================================================
  // PAGE 6 (7. Logo Kegiatan — Full Color Emblem matching Page 6)
  // =========================================================================
  doc.addPage();
  setFontTimes('bold', 11.5);
  doc.text('7.', LM, 42);
  doc.text('Logo Kegiatan', LM + 8, 42);

  // Draw the ornate shield emblem of PESTA PENGGALANG SMP/MTs KECAMATAN MUARA KAMAN DESA TERATAK TAHUN 2026 Batu Onggos
  const cx = PW / 2;
  const topLogoY = 58;

  // Outer ornate shield
  doc.setFillColor(120, 42, 14);
  doc.setDrawColor(40, 18, 5);
  doc.setLineWidth(1.2);
  doc.roundedRect(cx - 38, topLogoY, 76, 108, 18, 18, 'FD');

  // Gold inner frame
  doc.setFillColor(234, 179, 8);
  doc.roundedRect(cx - 35, topLogoY + 3, 70, 102, 15, 15, 'FD');

  // Top Header Dark Brown Arch
  doc.setFillColor(45, 22, 8);
  doc.roundedRect(cx - 32, topLogoY + 12, 64, 20, 6, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10.5);
  doc.text('PESTA PENGGALANG', cx, topLogoY + 19, { align: 'center' });
  doc.setFontSize(8.5);
  doc.text('SMP/MTs', cx, topLogoY + 24, { align: 'center' });

  // Gold ribbon banners
  doc.setFillColor(245, 194, 66);
  doc.roundedRect(cx - 28, topLogoY + 26, 56, 5.5, 1.5, 1.5, 'F');
  doc.setTextColor(35, 18, 5);
  doc.setFontSize(6.5);
  doc.text('KECAMATAN MUARA KAMAN', cx, topLogoY + 30, { align: 'center' });

  doc.setFillColor(250, 214, 105);
  doc.roundedRect(cx - 20, topLogoY + 32, 40, 5, 1.5, 1.5, 'F');
  doc.setFontSize(6);
  doc.text('DESA TERATAK', cx, topLogoY + 35.5, { align: 'center' });

  doc.setFillColor(35, 18, 5);
  doc.roundedRect(cx - 16, topLogoY + 37.5, 32, 4.5, 1.5, 1.5, 'F');
  doc.setTextColor(250, 214, 105);
  doc.setFontSize(5.8);
  doc.text('TAHUN 2026', cx, topLogoY + 40.8, { align: 'center' });

  // Landscape illustration area (Sky + Mahakam river + Batu Onggos rock + Scouts)
  doc.setFillColor(224, 242, 254); // Sky
  doc.rect(cx - 30, topLogoY + 43, 60, 32, 'F');

  doc.setTextColor(25, 25, 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Batu Onggos', cx, topLogoY + 48.5, { align: 'center' });

  // River water
  doc.setFillColor(56, 189, 248);
  doc.rect(cx - 30, topLogoY + 60, 60, 15, 'F');

  // Batu Onggos rock island in the middle
  doc.setFillColor(146, 102, 57);
  doc.ellipse(cx + 2, topLogoY + 61, 16, 7, 'F');
  doc.setFillColor(120, 82, 42);
  doc.ellipse(cx + 4, topLogoY + 59, 11, 5.5, 'F');

  // Lower Scroll Ribbon: Satyaku Kudarmakan, Darmaku Kubaktikan
  doc.setFillColor(253, 230, 138);
  doc.setDrawColor(120, 53, 15);
  doc.setLineWidth(0.6);
  doc.roundedRect(cx - 29, topLogoY + 73, 58, 13, 3, 3, 'FD');

  doc.setTextColor(45, 22, 8);
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(8.5);
  doc.text('Satyaku Kudarmakan,', cx, topLogoY + 78.5, { align: 'center' });
  doc.text('Darmaku Kubaktikan', cx, topLogoY + 83.5, { align: 'center' });

  // Red-white Kacu & Tunas Kelapa circle
  doc.setFillColor(200, 30, 30);
  doc.rect(cx - 18, topLogoY + 87, 36, 3, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(cx, topLogoY + 88.5, 3.5, 'FD');

  // Bottom black banner with theme
  doc.setFillColor(25, 15, 8);
  doc.roundedRect(cx - 28, topLogoY + 92, 56, 9, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.2);
  doc.text('"Membangun Generasi Muda yang Mandiri,', cx, topLogoY + 95.8, { align: 'center' });
  doc.text('Berkarakter, dan Berjiwa Gotong Royong."', cx, topLogoY + 99.2, { align: 'center' });

  // =========================================================================
  // PAGE 7
  // =========================================================================
  doc.addPage();
  drawCenteredBold('BAB III', 35, 12);
  drawCenteredBold('PESERTA DAN PEMBINA PENDAMPING', 43, 12);

  y = 55;
  setFontTimes('bold', 11.5);
  doc.text('1.', LM, y);
  doc.text('Peserta', LM + 8, y);
  y += 7;

  y = drawWrappedItem('a.', 'Regu Utuh Pramuka Penggalang', LM + 6, LM + 14, y) + 1.5;
  y = drawWrappedItem(
    'b.',
    'Peserta PESTA PENGGALANG pada tanggal 30 Oktober 2026 belum berusia 16 ( Enam belas) tahun.',
    LM + 6,
    LM + 14,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'c.',
    'Setiap gugus depan mengirimkan minimal satu regu putra dan satu regu putri.',
    LM + 6,
    LM + 14,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'd.',
    'Setiap regu beranggotakan 8 (delapan) orang Pramuka Penggalang.',
    LM + 6,
    LM + 14,
    y
  ) + 1.5;
  y = drawWrappedItem('e.', 'Persyaratan:', LM + 6, LM + 14, y) + 1.5;
  y = drawWrappedItem('1)', 'Persyaratan Administrasi Peserta', LM + 12, LM + 20, y) + 1.5;
  y = drawWrappedItem(
    'a)',
    'Membawa surat tugas dari Gugus depan',
    LM + 18,
    LM + 26,
    y,
    6,
    'bold'
  ) + 1.5;
  y = drawWrappedItem(
    'b)',
    'Menyerahkan fotokopi dan membawa aslinya :',
    LM + 18,
    LM + 26,
    y
  ) + 1.5;
  y = drawWrappedItem('i.', 'Biodata peserta', LM + 24, LM + 32, y, 6, 'bold') + 1.5;
  y = drawWrappedItem(
    'ii.',
    'Membawa surat ijin dari orang tua/wali.',
    LM + 24,
    LM + 32,
    y,
    6,
    'bold'
  ) + 1.5;
  y = drawWrappedItem(
    'iii.',
    'Menyerahkan 2 (dua) buah pas foto ukuran 3x4 cm berseragam pramuka dengan latar belakang warna merah.',
    LM + 24,
    LM + 32,
    y,
    6,
    'bold'
  ) + 3;

  y = drawWrappedItem('2)', 'Persyaratan Administrasi Regu', LM + 12, LM + 20, y) + 1.5;
  y = drawWrappedItem('i.', 'Formulir Regu', LM + 24, LM + 32, y, 6, 'bold') + 2;
  y = drawWrappedItem('f.', 'Perlengkapan:', LM + 6, LM + 14, y) + 1.5;
  y = drawWrappedItem('1)', 'Perlengkapan Perorangan', LM + 12, LM + 20, y) + 4;

  // Helper for equipment tables
  const drawEquipRow = (
    topY: number,
    h: number,
    no: string,
    jenis: string[],
    jumlah: string,
    kegunaan: string[],
    isBold = false
  ) => {
    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(0.25);
    const x0 = 38;
    const wNo = 14;
    const wJenis = 68;
    const wJml = 32;
    const wGuna = 34;

    doc.rect(x0, topY, wNo, h);
    doc.rect(x0 + wNo, topY, wJenis, h);
    doc.rect(x0 + wNo + wJenis, topY, wJml, h);
    doc.rect(x0 + wNo + wJenis + wJml, topY, wGuna, h);

    setFontTimes(isBold ? 'bold' : 'normal', 11);
    doc.text(no, x0 + wNo / 2, topY + 6, { align: 'center' });
    jenis.forEach((line, idx) => {
      doc.text(line, x0 + wNo + 3, topY + 6 + idx * 5.5);
    });
    doc.text(jumlah, x0 + wNo + wJenis + wJml / 2, topY + 6, { align: 'center' });
    kegunaan.forEach((line, idx) => {
      doc.text(line, x0 + wNo + wJenis + wJml + wGuna / 2, topY + 6 + idx * 5.5, {
        align: 'center',
      });
    });
    return topY + h;
  };

  const drawEquipSectionBar = (topY: number, title: string) => {
    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(0.25);
    doc.rect(38, topY, 148, 8);
    setFontTimes('bold', 11);
    doc.text(title, 38 + 74, topY + 5.5, { align: 'center' });
    return topY + 8;
  };

  y = drawEquipRow(y, 13, 'No', ['Jenis Perlengkapan'], 'Jumlah', ['Kegunaan'], true);
  setFontTimes('bold', 11);
  doc.text('Barang', 38 + 14 + 68 + 16, y - 2.5, { align: 'center' });
  y = drawEquipSectionBar(y, 'Jenis Pakaian');
  y = drawEquipRow(
    y,
    18,
    '1',
    ['Seragam Pramuka Lengkap', '(baret/topi, dasi, kaos kaki,', 'sabuk)'],
    '1',
    ['Sangat', 'Penting']
  );
  drawEquipRow(y, 13, '2', ['Seragam Olahraga'], '1', ['Sangat', 'Penting']);

  // =========================================================================
  // PAGE 8
  // =========================================================================
  doc.addPage();
  y = 34;
  y = drawEquipRow(
    y,
    18,
    '3',
    ['Pakaian Sholat (baju', 'muslim, sarung, mukena,', 'sajadah)'],
    'Menyesuaikan',
    ['Sangat', 'Penting']
  );
  y = drawEquipRow(y, 13, '4', ['Baju bebas pantas'], 'Menyesuaikan', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '5', ['Pakaian dalam'], 'Menyesuaikan', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '6', ['Sepatu dan sandal'], '1', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 10, '7', ['Jaket'], '1', ['Penting']);
  y = drawEquipRow(y, 10, '8', ['Jas hujan'], '1', ['Penting']);
  y = drawEquipSectionBar(y, 'Peralatan Makan');
  y = drawEquipRow(y, 13, '1', ['Piring'], '1', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '2', ['Sendok'], '1', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '3', ['Gelas'], '1', ['Sangat', 'Penting']);
  drawEquipRow(y, 13, '4', ['Botol minum'], '1', ['Sangat', 'Penting']);

  // =========================================================================
  // PAGE 9
  // =========================================================================
  doc.addPage();
  y = 38;
  y = drawEquipSectionBar(y, 'Peralatan Mandi');
  y = drawEquipRow(y, 13, '1', ['Handuk'], '1', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '2', ['Sabun cair'], '1', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '3', ['Sampo'], '1', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '4', ['Sikat gigi dan pasta gigi'], '1', ['Sangat', 'Penting']);
  y = drawEquipSectionBar(y, 'Lain-lain');
  y = drawEquipRow(y, 13, '1', ['Obat Pribadi dan', 'multivitamin'], '1', ['Penting']);
  y = drawEquipRow(y, 13, '2', ['Obat nyamuk lotion'], 'Menyesuaikan', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '3', ['Tongkat Pramuka'], '1', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '4', ['Tali Pramuka'], '1', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '5', ['Alat tulis (Buku, Pulpen)'], '1', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '6', ['Plastik besar'], '3', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 10, '7', ['Senter'], '1', ['Penting']);

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(190, 30, 30);
  doc.text('Catatan : untuk kebutuhan pribadi silahkan menyesuiakan kebutuhan', LM, y + 14);

  // =========================================================================
  // PAGE 10
  // =========================================================================
  doc.addPage();
  y = 35;
  setFontTimes('normal', 11.5);
  doc.text('2)   Perlengkapan Regu', LM, y);
  y += 8;

  y = drawEquipRow(y, 13, 'No', ['Jenis Perlengkapan'], 'Jumlah', ['Kegunaan'], true);
  setFontTimes('bold', 11);
  doc.text('Barang', 38 + 14 + 68 + 16, y - 2.5, { align: 'center' });
  y = drawEquipSectionBar(y, 'Perlengkapan');
  y = drawEquipRow(y, 10, '1', ['Terpal 4 x 6 / 3 x 4'], 'menyesuaikan', ['Penting']);
  y = drawEquipRow(y, 13, '2', ['Tenda'], '1', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '3', ['Tali Pramuka 10 Meter'], '2', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '4', ['Tali Pramuka 5 Meter'], '6', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 13, '5', ['Pasak Besi'], 'menyesuaikan', ['Sangat', 'Penting']);
  y = drawEquipRow(y, 10, '6', ['Alas Tenda untuk tidur'], 'menyesuaikan', ['Penting']);
  y = drawEquipRow(y, 13, '7', ['Tongkat Pramuka'], '8', ['Sangat', 'Penting']);
  y = drawEquipSectionBar(y, 'Peralatan Masak');

  // Catering box
  doc.rect(38, y, 148, 52);
  setFontTimes('normal', 11);
  const cateringLines = [
    'Konsumsi di tanggung oleh panitia (Chatering) sebanyak 4 kali makan',
    'dengan rincian sebagai berikut :',
    "   1. Hari Jum'at, 30 Oktober 2026",
    '       Makan siang 1 x 10 orang -/ regu',
    '       Makan malam 1 x 10 orang -/ regu',
    '   2. Hari Sabtu, 31 Oktober 2026',
    '       Sarapan, 1 x 10 orang -/ regu',
    '       Makan siang 1 x 10 orang -/ regu',
  ];
  cateringLines.forEach((cl, idx) => {
    doc.text(cl, 40, y + 6 + idx * 6);
  });
  y += 58;

  y = drawEquipSectionBar(y, 'Lain-lain');
  y = drawEquipRow(y, 8.5, '1', ['Jirigen air/Galon'], 'menyesuaikan', ['Penting']);
  y = drawEquipRow(y, 8.5, '2', ['Cangkul'], '1', ['Penting']);
  y = drawEquipRow(y, 8.5, '3', ['Palu'], '1', ['Penting']);
  drawEquipRow(y, 8.5, '4', ['Ember'], '1', ['Penting']);

  // =========================================================================
  // PAGE 11
  // =========================================================================
  doc.addPage();
  y = 35;
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text('*catatan:', LM + 6, y);
  y += 6;
  doc.setTextColor(180, 30, 30);
  doc.text('1.   Regu dipersilahan membuat gapura dan pagar sederhana di lokasi', LM, y);
  y += 5.5;
  doc.text('      perkemahan, serta menggunakan papan nama regu (jika ada).', LM, y);
  y += 6;
  doc.text('2.   Seluruh perlengkapan pribadi dan perlengkapan regu harus dapat diangkut', LM, y);
  y += 5.5;
  doc.text('      oleh Peserta PESTA PENGGALANG sekaligus.', LM, y);

  y += 12;
  setFontTimes('bold', 11.5);
  doc.text('2.', LM, y);
  doc.text('Pembina Pendamping', LM + 8, y);
  y += 7;

  y = drawWrappedItem(
    'a.',
    'Pembina Pendamping Regu adalah Pembina Pramuka yang mendampingi regunya dari gudepnya masing-masing.',
    LM + 6,
    LM + 14,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '1)',
    'Setiap Regu didampingi oleh Pembina Pramuka yang berasal dari Gugus depan regu yang bersangkutan.',
    LM + 12,
    LM + 20,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '2)',
    'Pembina pendamping tidak diperkenankan mendekati area lomba kecuali pada saat waktu yang diperbolehkan Panitia.',
    LM + 12,
    LM + 20,
    y
  ) + 2;

  y = drawWrappedItem('b.', 'Persyaratan', LM + 6, LM + 14, y) + 1.5;
  y = drawWrappedItem(
    '1)',
    'Pembina Pramuka aktif di Gugus depan regu.',
    LM + 12,
    LM + 20,
    y
  ) + 1.5;
  y = drawWrappedItem('2)', 'Menyerahkan aslinya :', LM + 12, LM + 20, y) + 1.5;
  y = drawWrappedItem('i. Biodata Pembina', '', LM + 20, LM + 28, y, 6, 'bold') + 1.5;
  y = drawWrappedItem(
    '3)',
    'Membawa surat tugas dari Gugus depan',
    LM + 12,
    LM + 20,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '4)',
    'Menyerahkan 2 (dua) buah pasfoto ukuran 3 x 4 cm berseragam pramuka dengan latar belakang warna merah.',
    LM + 12,
    LM + 20,
    y
  ) + 2;

  y = drawWrappedItem('c.', 'Tugas', LM + 6, LM + 14, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Tugas Pembina Pendamping Regu Peserta PESTA PENGGALANG adalah:',
    LM + 6,
    LM + 14,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '1)',
    'Tugas Umum Pembina Pendamping Regu adalah:',
    LM + 12,
    LM + 20,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'i.',
    'Tugas Umum adalah tugas yang diberikan oleh panitia dalam rangka pembinaan dan pengembangan pengetahuan dan pengalaman Pembina Pramuka Penggalang.',
    LM + 18,
    LM + 24,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '2)',
    'Tugas khusus Pembina Pendamping Regu adalah:',
    LM + 12,
    LM + 20,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'i.',
    'Membimbing, memberi petunjuk dan nasihat kepada Pimpinan Regu selama perjalanan dari gugus depan sampai lokasi PESTA PENGGALANG 2026, dari pergi - pulang.',
    LM + 18,
    LM + 24,
    y
  ) + 1.5;
  drawWrappedItem(
    'ii.',
    'Memeriksa, mengawasi persyaratan dan perlengkapan Regu',
    LM + 18,
    LM + 24,
    y
  );

  // =========================================================================
  // PAGE 12
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem(
    '',
    'Peserta PESTA PENGGALANG yang di dampinginya.',
    LM + 18,
    LM + 24,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'iii.',
    'Mengamati kondisi kesehatan dan keamanan anggota Regu Peserta PESTA PENGGALANG selama perjalanan dari gugus depan sampai lokasi buper perkemahan, pergi - pulang.',
    LM + 17,
    LM + 24,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'iv.',
    'Bekerjasama dengan Panitia Penyelenggara dalam menangani situasi dan kondisi darurat yang dialami anggota Regu peserta PESTA PENGGALANG yang di dampinginya.',
    LM + 17,
    LM + 24,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'v.',
    'Memahami dan mentaati tata tertib perkemahan PESTA PENGGALANG.',
    LM + 17,
    LM + 24,
    y
  ) + 6;

  y = drawWrappedItem('d.', 'Perlengkapan', LM + 8, LM + 16, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Perlengkapan pribadi yang harus dibawa:',
    LM + 8,
    LM + 16,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '1)',
    'Pakaian seragam lengkap pramuka dengan atributnya.',
    LM + 14,
    LM + 22,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '2)',
    'Ransel pakaian dan peralatan pribadi (makan, mandi, dll.)',
    LM + 14,
    LM + 22,
    y
  ) + 1.5;
  y = drawWrappedItem('3)', 'Obat pribadi', LM + 14, LM + 22, y) + 1.5;
  y = drawWrappedItem('4)', 'Jas hujan/ponco', LM + 14, LM + 22, y) + 1.5;
  y = drawWrappedItem('5)', 'Alat tulis', LM + 14, LM + 22, y) + 8;

  setFontTimes('bold', 11.5);
  doc.text('3.', LM, y);
  doc.text('Pendaftaran', LM + 8, y);
  y += 7;
  drawWrappedItem(
    'a.',
    "Pendaftaran dilaksanakan oleh Pemimpin regu pada hari Jum'at, 30 Oktober pukul 08.00 - 90.00 WITA di sekretariat Pelaksana PESTA PENGGALANG serta membayarkan camp fee sebesar Rp 1.300.000, - /regu.",
    LM + 6,
    LM + 14,
    y
  );

  // =========================================================================
  // PAGE 13
  // =========================================================================
  doc.addPage();
  drawCenteredBold('BAB IV', 35, 12);
  drawCenteredBold('PERKEMAHAN DAN TATA TERTIB', 43, 12);

  y = 53;
  setFontTimes('bold', 11.5);
  doc.text('A.', LM, y);
  doc.text('Perkemahan', LM + 8, y);
  y += 7;

  y = drawWrappedItem(
    '1.',
    'Perkemahan PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026 adalah perkemahan pramuka yang sehat, menyenangkan, mengesankan, nyaman, sopan, bersih, teratur dan tertib serta membuat penghuninya dan pengunjung merasa aman.',
    LM + 6,
    LM + 14,
    y
  ) + 2;

  y = drawWrappedItem(
    '2.',
    'Perkemahan PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026 adalah perkemahan pramuka peserta PESTA PENGGALANG yang membina dan mengembangkan sikap dan perilaku yang berlandaskan Kode Kehormatan Pramuka, persaudaraan, persahabatan; persatuan dan kesatuan bangsa, kegotong-royongan, rasa kepedulian sosial, cinta alam sekitarnya, disiplin dan kreatif.',
    LM + 6,
    LM + 14,
    y
  ) + 2;

  y = drawWrappedItem(
    '3.',
    'Peserta Perkemahan PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026 harus mempunyai rasa memiliki terhadap perkemahan PESTA PENGGALANG dan dengan penuh kesadaran wajib memelihara, menjaga dan menertibkan kondisi serta fasilitasnya. Tata tertib perkemahan harus ditaati oleh penghuni dengan penuh kesadaran.',
    LM + 6,
    LM + 14,
    y
  ) + 6;

  setFontTimes('bold', 11.5);
  doc.text('B.', LM, y);
  doc.text('Tata Tertib', LM + 8, y);
  y += 7;

  y = drawWrappedItem(
    '1.',
    'Tata tertib perkemahan PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026 merupakan aturan untuk membina dan mengembangkan sikap disiplin pramuka.',
    LM + 6,
    LM + 14,
    y
  ) + 2;

  y = drawWrappedItem(
    '2.',
    'Patuh terhadap tata tertib perkemahan PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026 merupakan pengamalan Kode Kehormatan Pramuka, karena itu bagi seorang pramuka merupakan suatu kewajiban yang dilandasi kesadaran pribadi.',
    LM + 6,
    LM + 14,
    y
  ) + 2;

  drawWrappedItem(
    '3.',
    'Pelanggaran terhadap tata tertib perkemahan PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026 dikenakan',
    LM + 6,
    LM + 14,
    y
  );

  // =========================================================================
  // PAGE 14
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem('', 'sanksi dengan cara pengurangan nilai.', LM + 6, LM + 14, y) + 2;
  y = drawWrappedItem('4.', 'Tata Tertib Perkemahan', LM + 6, LM + 14, y) + 1.5;
  y = drawWrappedItem('a.', 'Pasal 1 Umum', LM + 14, LM + 22, y) + 1.5;

  y = drawWrappedItem(
    '1)',
    'Landasan perikehidupan dan semangat perkemahan adalah Tri Satya dan Dasa Darma Pramuka.',
    LM + 22,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '2)',
    'Warga perkemahan wajib patuh pada ketentuan perkemahan PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026.',
    LM + 22,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '3)',
    'Warga perkemahan wajib menggunakan tanda pengenal dalam semua aktifitas.',
    LM + 22,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '4)',
    'Warga perkemahan wajib mengenakan Seragam Pramuka pada saat mengikuti Upacara Pembukaan dan Penutupan, dan kegiatan lomba lainnya, sedangkan untuk kegiatan yang menggunakan kaos kegiatan disesuaikan dengan petunjuk teknis kegiatan, dengan tetap menggunakan tanda pengenal / nomor peserta, dan yang disediakan Panitia PESTA PENGGALANG Tahun 2026.',
    LM + 22,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '5)',
    'Selama di perkemahan dilarang mengenakan barang - barang berharga, seperti perhiasan emas, berlian dll.',
    LM + 22,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '6)',
    'Seluruh peserta dilarang membawa alat komunikasi, termasuk handphone (HP), selama kegiatan kemah berlangsung.',
    LM + 22,
    LM + 30,
    y,
    6,
    'bold'
  ) + 1.5;
  y = drawWrappedItem(
    '7)',
    'Arena perkemahan putra diberi nama Batu Onggos Camp dan perkemahan putri diberi nama Mandala Camp.',
    LM + 22,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '8)',
    'Selama peserta mengikuti lomba, pembina pendamping tidak boleh masuk ke dalam areal tapak lomba, apabila ditemukan pembina yang memasuki areal tapak lomba pada saat lomba berlangsung maka peserta atau regu yang bersangkutan akan didiskualifikasi untuk mata lomba tersebut.',
    LM + 22,
    LM + 30,
    y
  ) + 5;

  y = drawWrappedItem('b.', 'Pasal 2 Warga Perkemahan', LM + 14, LM + 22, y) + 1.5;
  drawWrappedItem(
    '1)',
    'Warga perkemahan induk PESTA PENGGALANG Tingkat',
    LM + 22,
    LM + 30,
    y
  );

  // =========================================================================
  // PAGE 15
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem(
    '',
    'SMP/MTs Kecamatan Muara Kaman Tahun 2026 terdiri atas Pramuka penggalang putra dan putri sebagai peserta PESTA PENGGALANG Tahun 2026.',
    LM + 22,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '2)',
    'Peserta PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026 tidak diperkenankan keluar area perkemahan tanpa se-ijin atau sepengetahuan panitia terutama Bidang Keamanan dan ketertiban.',
    LM + 22,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '3)',
    'Warga Perkemahan Pesta Penggalang Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026 tidak di perkenankan mandi, cuci pakaian, buang air besar / kecil dan aktivitas lainnya di sungai Mahakam.',
    LM + 22,
    LM + 30,
    y,
    6,
    'bold'
  ) + 1.5;
  y = drawWrappedItem(
    '4)',
    'Untuk Mandi, cuci pakaian, buang air besar / kecil dan aktivitas lainnya menggunakan MCK yang di sediakan Panitia Perkemahan.',
    LM + 22,
    LM + 30,
    y
  ) + 3;

  y = drawWrappedItem('c.', 'Pasal 3 Kebersihan dan Kesehatan', LM + 14, LM + 22, y) + 1.5;
  y = drawWrappedItem(
    '1)',
    'Kebersihan kavling menjadi tanggung jawab regu / peserta.',
    LM + 20,
    LM + 28,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '2)',
    'Setiap regu diwajibkan menyediakan tempat sampah di masing-masing tenda.',
    LM + 20,
    LM + 28,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '3)',
    'Kebersihan kavling, kamar mandi dan area perkemahan menjadi tanggung jawab regu.',
    LM + 20,
    LM + 28,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '4)',
    'Setiap regu / peserta PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman diwajibkan untuk menjaga kesehatan, apabila merasa sakit segera melapor kepada panitia Bidang Kesehatan.',
    LM + 20,
    LM + 28,
    y
  ) + 4;

  y = drawWrappedItem('d.', 'Pasal 4 Keamanan', LM + 14, LM + 22, y) + 1.5;
  y = drawWrappedItem(
    '1)',
    'Tidak diperkenankan membuat perapian di arena kavling',
    LM + 20,
    LM + 28,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '2)',
    'Setiap peserta / regu menjaga perlengkapannya',
    LM + 20,
    LM + 28,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '3)',
    'Tidak diperkenankan menebang, merusak, memotong tumbuhan yang berada di sekitar kavling',
    LM + 20,
    LM + 28,
    y
  ) + 1.5;
  drawWrappedItem(
    '4)',
    'Setiap gangguan keamanan yang tidak bisa ditangani regu segera laporkan kepada panitia PESTA PENGGALANG Tingkat',
    LM + 20,
    LM + 28,
    y
  );

  // =========================================================================
  // PAGE 16
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem(
    '',
    'SMP/MTs Kecamatan Muara Kaman Seksi Keamanan',
    LM + 20,
    LM + 28,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '5)',
    'Pengunjung / tamu tidak diperkenankan memasuki areal perkemahan putra maupun putri cukup berkunjung pada waktu dan tempat menerima tamu yang ditentukan.',
    LM + 20,
    LM + 28,
    y
  ) + 5;

  y = drawWrappedItem('e.', 'Pasal 5 Lain - lain', LM + 14, LM + 22, y) + 1.5;
  y = drawWrappedItem(
    '1)',
    'Tata tertib ini berlaku selama berada di Bumi Perkemahan',
    LM + 24,
    LM + 32,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '2)',
    'Tata tertib ini mengikat semua peserta, pendamping PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026',
    LM + 24,
    LM + 32,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '3)',
    'Hal - hal yang belum tertuang dalam tata tertib ini akan diatur kemudian',
    LM + 24,
    LM + 32,
    y
  ) + 6;

  y = drawWrappedItem('5.', 'Sanksi', LM + 6, LM + 14, y) + 1.5;
  y = drawWrappedItem(
    'a.',
    'Sanksi dari pelanggaran regu/peserta yang ditetapkan adalah berupa catatan dan peringatan yang akan dikompilasi oleh Pembina Perkemahan',
    LM + 14,
    LM + 22,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'b.',
    'Setiap peserta berhak melaporkan/mencatat pelanggaran yang dilakukan oleh peserta lainnya dengan disertai bukti atau saksi minimal dua orang dari regu yang berbeda',
    LM + 14,
    LM + 22,
    y
  ) + 1.5;
  drawWrappedItem(
    'c.',
    'Sanksi atas pelanggaran-pelanggaran tersebut dapat mempengaruhi nilai.',
    LM + 14,
    LM + 22,
    y
  );

  // =========================================================================
  // PAGE 17 (BAB V KEGIATAN - A. Jadwal Kegiatan)
  // =========================================================================
  doc.addPage();
  drawCenteredBold('BAB V', 28, 12);
  drawCenteredBold('KEGIATAN', 35, 12);

  setFontTimes('bold', 11.5);
  doc.text('A.  Jadwal Kegiatan', 22, 46);

  const drawScheduleRow = (
    topY: number,
    h: number,
    hariLines: string[],
    jam: string,
    kegiatanLines: string[],
    seragamLines: string[],
    isHeader = false,
    drawHariBottomBorder = true
  ) => {
    const x0 = 20;
    const wHari = 26;
    const wJam = 28;
    const wGiat = 82;
    const wSeragam = 38;

    doc.setDrawColor(60, 60, 60);
    doc.setLineWidth(0.25);

    if (isHeader) {
      doc.setFillColor(242, 242, 242);
      doc.rect(x0, topY, wHari + wJam + wGiat + wSeragam, h, 'F');
    }

    // Hari cell lines
    doc.line(x0, topY, x0, topY + h);
    if (hariLines.length > 0 || isHeader) {
      doc.line(x0, topY, x0 + wHari, topY);
    }
    if (drawHariBottomBorder) {
      doc.line(x0, topY + h, x0 + wHari, topY + h);
    }

    doc.rect(x0 + wHari, topY, wJam, h);
    doc.rect(x0 + wHari + wJam, topY, wGiat, h);
    doc.rect(x0 + wHari + wJam + wGiat, topY, wSeragam, h);

    setFontTimes('normal', 10.5);
    hariLines.forEach((hl, idx) => {
      doc.text(hl, x0 + 2, topY + 5.5 + idx * 5.5);
    });
    doc.text(jam, x0 + wHari + 2, topY + 5.5);
    kegiatanLines.forEach((kl, idx) => {
      doc.text(kl, x0 + wHari + wJam + 2, topY + 5.5 + idx * 5.5);
    });
    seragamLines.forEach((sl, idx) => {
      doc.text(sl, x0 + wHari + wJam + wGiat + wSeragam / 2, topY + 5.5 + idx * 5.5, {
        align: 'center',
      });
    });

    return topY + h;
  };

  y = 53;
  y = drawScheduleRow(y, 8, ['Hari / Tanggal'], 'Jam', ['Kegiatan'], ['Seragam'], true, true);
  y = drawScheduleRow(
    y,
    8,
    ["Jum'at,", '30-Okt-2026'],
    '07.00 - 08.00',
    ['Kedatangan Peserta dan Regestrasi'],
    ['Olah Raga'],
    false,
    false
  );
  y = drawScheduleRow(y, 8, [], '08.00 - 09.20', ['Tapak Tenda'], ['Olah Raga'], false, false);
  y = drawScheduleRow(y, 8, [], '09.20 - 09.30', ['Persiapan'], [], false, false);
  y = drawScheduleRow(
    y,
    13,
    [],
    '09.30 - 10.00',
    ['Materi / Hiburan ( dari Sanggar Tari Desa Budaya', 'Lekaq Kidau )'],
    ['Pramuka'],
    false,
    false
  );
  y = drawScheduleRow(
    y,
    13,
    [],
    '10.00 - 11.00',
    ['Materi dari Puskesmas/ pusban (Tips Hidup', 'Sehat di tengah pekatnya asap karhutla )'],
    ['Pramuka'],
    false,
    false
  );
  y = drawScheduleRow(
    y,
    8,
    [],
    '11.00 - 13.20',
    ['ISHOMA (Istirahat, Sholat, Makan)'],
    ['Bebas Pantas'],
    false,
    false
  );
  y = drawScheduleRow(
    y,
    18,
    [],
    '13.20 - 14.00',
    [
      'Materi dari Pemadam Kebakaran Kabupaten Kutai',
      'Kartanegara "Jangan Biarkan Kukar Membara:',
      'Kenali Bahaya, Cegah Karhutla Sejak Dini"',
    ],
    ['Pramuka'],
    false,
    false
  );
  y = drawScheduleRow(y, 8, [], '14.00 - 14.10', ['Persiapan'], [], false, false);
  y = drawScheduleRow(y, 8, [], '14.10 - 15.30', ['Lomba Yel yel'], ['Pramuka'], false, false);
  y = drawScheduleRow(
    y,
    8,
    [],
    '15.30 - 16.00',
    ['Iso ( istirahat dan Sholat )'],
    ['Bebas Pantas'],
    false,
    false
  );
  drawScheduleRow(
    y,
    10,
    [],
    '16.00 - 17.00',
    ['Upacara Pembukaan PESTA PENGGALANG'],
    ['Pramuka'],
    false,
    true
  );

  // =========================================================================
  // PAGE 18
  // =========================================================================
  doc.addPage();
  y = 25;
  y = drawScheduleRow(
    y,
    8,
    [''],
    '17.00 - 20.00',
    ['ISHOMA & Giat Pribadi'],
    ['Bebas Pantas'],
    false,
    false
  );
  y = drawScheduleRow(
    y,
    13,
    [],
    '20.00 - 23.00',
    ['Upacara Api Unggun & Pentas Seni Antar-', 'Pangkalan'],
    ['Pramuka ( bagi yang tampil', 'pakaian menyesuaikan'],
    false,
    false
  );
  y = drawScheduleRow(
    y,
    8,
    [],
    '23.00 - 04.30',
    ['Istirahat Malam'],
    ['Bebas Pantas'],
    false,
    true
  );

  y += 9;
  y = drawScheduleRow(y, 8, ['Hari / Tanggal'], 'Jam', ['Kegiatan'], ['Seragam'], true, true);
  y = drawScheduleRow(
    y,
    8,
    ['Sabtu,', '31-Okt-2026'],
    '04.30 - 06.00',
    ['Sholat Subuh'],
    ['Menyesuaikan'],
    false,
    false
  );
  y = drawScheduleRow(y, 8, [], '06.00 - 06.30', ['Olah raga pagi'], ['Olah raga'], false, false);
  y = drawScheduleRow(
    y,
    8,
    [],
    '06.30 - 07.30',
    ['Giat Pribadi & Sarapan'],
    ['Bebas Pantas'],
    false,
    false
  );
  y = drawScheduleRow(
    y,
    52,
    [],
    '07.30 - 10.00',
    [
      'Jelajah Alam 3 Pos',
      '   1. Perkenalan regu ( gugus sekolah)',
      '   2. Games indra perasa, Uji KIM ( Kemampuan',
      '       indra Manusia 10 Menit/regu',
      '   3. Games mengingat nama benda 10',
      '       Menit/regu',
      '   4. lomba pertolongan pertama pada kecelakaan',
      '       (P3K) - Tandu 10 menit/regu',
    ],
    ['Pramuka'],
    false,
    false
  );
  y = drawScheduleRow(
    y,
    8,
    [],
    '10.00 - 11.00',
    ['Materi Panahan ( Eksebisi )'],
    ['Pramuka'],
    false,
    false
  );
  drawScheduleRow(
    y,
    13,
    [],
    '11.00 - 11.30',
    ['Operasi Semut sekitar Bumi Perkemahan ( Bakti', 'lingkungan )'],
    ['Pramuka'],
    false,
    true
  );

  // =========================================================================
  // PAGE 19
  // =========================================================================
  doc.addPage();
  y = 25;
  y = drawScheduleRow(y, 8, [''], '11.30 - 13.15', ['ISHOMA'], ['Bebas pantas'], false, false);
  y = drawScheduleRow(
    y,
    13,
    [],
    '13.15 - 14.30',
    ['Upacara Penutupan & Pengumuman Tenda/Regu', 'Terbaik'],
    ['Pramuka'],
    false,
    false
  );
  drawScheduleRow(
    y,
    8,
    [],
    '14.30 - Selesai',
    ['Pembongkaran Tenda & Kepulangan Peserta'],
    ['Pramuka'],
    false,
    true
  );

  // =========================================================================
  // PAGE 20 (B. Materi Lomba - 1. Lomba yel-yel)
  // =========================================================================
  doc.addPage();
  y = 35;
  setFontTimes('bold', 11.5);
  doc.text('B.  Materi Lomba', LM, y);
  y += 7;
  doc.text('1.  Lomba yel-yel', LM + 6, y);
  y += 7;
  setFontTimes('normal', 11.5);
  doc.text('a.  Tujuan', LM + 12, y);
  y += 7;

  const yelGoals = [
    {
      title: 'v  Membangun Jiwa Korsa dan Kerjasama Tim (Teamwork):',
      body: 'Melatih kekompakan, keselarasan gerak, dan rasa kebersamaan antaranggota regu agar mampu meleburkan ego pribadi demi kepentingan kelompok.',
    },
    {
      title: 'v  Menumbuhkan Kepercayaan Diri dan Kepemimpinan:',
      body: 'Memberikan ruang bagi Pemimpin Regu (Pinru) untuk memimpin dan memberi instruksi, serta melatih para anggota agar berani tampil percaya diri di depan khalayak umum.',
    },
    {
      title: 'v  Meningkatkan Kreativitas dan Inovasi:',
      body: 'Mengasah daya cipta penggalang dalam merangkai lirik yang edukatif, memadukan nada, serta merancang koreografi gerak yang menarik dan dinamis.',
    },
    {
      title: 'v  Menyalurkan Energi Positif dan Semangat Kebangsaan:',
      body: 'Menjadi media pelepasan stres secara positif selama berkemah sekaligus menanamkan pesan-pesan moral, Dasadarma, atau isu sosial/lingkungan lewat lirik lagu.',
    },
    {
      title: 'v  Melatih Kedisiplinan dan Ketahanan Mental:',
      body: 'Menguji fokus, ketepatan waktu, dan ketahanan fisik regu saat menyelaraskan ritme gerak dan suara di bawah tekanan kompetisi.',
    },
  ];

  yelGoals.forEach((g) => {
    setFontTimes('bold', 11);
    doc.text(g.title, LM + 18, y);
    y += 5.5;
    y = drawWrappedItem('', g.body, LM + 23, LM + 23, y, 5.8, 'normal', 11) + 1.5;
  });

  y += 3;
  setFontTimes('normal', 11.5);
  doc.text('b.  Waktu dan Tempat', LM + 12, y);
  y += 6.5;
  doc.text("Hari/Tanggal         : Jum'at, 30 Oktober 2026", LM + 18, y);
  y += 6.5;
  doc.text('Waktu                     : 14.00 - 15.30 WITA', LM + 18, y);
  y += 6.5;
  doc.text('Tempat                    : Lapangan Sepak Bola Mandala Desa Teratak', LM + 18, y);
  y += 6;
  doc.text('                                  Kecamatan Kaman', LM + 18, y);
  y += 7;
  doc.text('c.  Peserta', LM + 12, y);
  y += 6.5;
  drawWrappedItem(
    '',
    'Peserta lomba YEL - YEL merupakan regu yang dibentuk oleh setiap gugus depan/sekolah. Setiap regu terdiri atas minimal 8 (delapan) orang dan maksimal 16 (enam belas) orang, termasuk',
    LM + 18,
    LM + 18,
    y
  );

  // =========================================================================
  // PAGE 21
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem(
    '',
    'danton (komandan peleton) sebagai pemimpin YEL - YEL. Seluruh anggota dalam regu tersebut harus berasal dari gugus depan yang sama serta telah terdaftar secara resmi sebagai peserta kegiatan perkemahan.',
    LM + 18,
    LM + 18,
    y
  ) + 2;

  y = drawWrappedItem('d.', 'Proses dan Prosedur :', LM + 12, LM + 18, y) + 1.5;
  y = drawWrappedItem('1)', 'Tahap Persiapan', LM + 18, LM + 24, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Setiap regu peserta diwajibkan menyiapkan penampilan yel-yel secara mandiri sebelum pelaksanaan lomba.',
    LM + 24,
    LM + 24,
    y
  ) + 1.5;
  y = drawWrappedItem('2)', 'Pengundian Nomor Urut Tampil', LM + 18, LM + 24, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Peserta akan mengikuti proses pengundian nomor urut penampilan yang dipandu secara langsung oleh panitia pada waktu yang telah ditentukan.',
    LM + 24,
    LM + 24,
    y
  ) + 1.5;
  y = drawWrappedItem('3)', 'Pelaksanaan Lomba', LM + 18, LM + 24, y) + 1.5;
  y = drawWrappedItem(
    'a)',
    'Lomba yel-yel dilaksanakan sesuai jadwal yang telah ditetapkan panitia.',
    LM + 24,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'b)',
    'Setiap regu tampil sesuai urutan dan diberi waktu maksimal 3 - 5 menit untuk menampilkan yel-yel.',
    LM + 24,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'c)',
    'Penampilan tidak mengandung unsur SARA, kekerasan, maupun hal-hal yang bertentangan dengan norma yang berlaku.',
    LM + 24,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'd)',
    'Seluruh peserta wajib menjaga ketertiban selama lomba berlangsung.',
    LM + 24,
    LM + 30,
    y
  ) + 2;
  y = drawWrappedItem('4)', 'Kriteria Penilaian', LM + 18, LM + 24, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Penilaian lomba dilakukan oleh dewan juri yang ditunjuk panitia, dengan mempertimbangkan beberapa aspek berikut:',
    LM + 24,
    LM + 24,
    y
  ) + 4;

  // Table Kriteria Penilaian
  doc.setDrawColor(40, 40, 40);
  doc.rect(48, y, 48, 8);
  doc.rect(96, y, 88, 8);
  setFontTimes('bold', 10.5);
  doc.text('Aspek Penilaian', 52, y + 5.5);
  doc.text('Kriteria Utama', 100, y + 5.5);
  y += 8;

  doc.rect(48, y, 48, 14);
  doc.rect(96, y, 88, 14);
  setFontTimes('bold', 10.5);
  doc.text('Kreativitas & Lirik', 50, y + 8);
  setFontTimes('normal', 10);
  doc.text('Keaslian ide, keselarasan nada, serta pesan', 98, y + 5.5);
  doc.text('moral/karakter Pramuka dalam lirik.', 98, y + 11);
  y += 14;

  doc.rect(48, y, 48, 14);
  doc.rect(96, y, 88, 14);
  setFontTimes('bold', 10.5);
  doc.text('Kekompakan &', 50, y + 6);
  doc.text('Semangat', 50, y + 11.5);
  setFontTimes('normal', 10);
  doc.text('Keselarasan gerak, artikulasi suara, power, dan', 98, y + 5.5);
  doc.text('ketepatan ritme antaranggota.', 98, y + 11);

  // =========================================================================
  // PAGE 22
  // =========================================================================
  doc.addPage();
  y = 35;
  doc.rect(48, y, 48, 14);
  doc.rect(96, y, 88, 14);
  setFontTimes('bold', 10.5);
  doc.text('Penampilan & Kostum', 50, y + 8);
  setFontTimes('normal', 10);
  doc.text('Kerapian seragam Pramuka, kesesuaian atribut', 98, y + 5.5);
  doc.text('tambahan, serta ekspresi wajah.', 98, y + 11);
  y += 14;

  doc.rect(48, y, 48, 18);
  doc.rect(96, y, 88, 18);
  setFontTimes('bold', 10.5);
  doc.text('Kedisiplinan & Waktu', 50, y + 10);
  setFontTimes('normal', 10);
  doc.text('Kepatuhan terhadap batas waktu penampilan dan', 98, y + 5.5);
  doc.text('tata krama saat memasuki/meninggalkan', 98, y + 11);
  doc.text('panggung.', 98, y + 16);
  y += 26;

  y = drawWrappedItem('5)', 'Penetapan dan Pengumuman Pemenang', LM + 18, LM + 24, y) + 1.5;
  y = drawWrappedItem(
    'a)',
    'Keputusan dewan juri bersifat mutlak dan tidak dapat diganggu gugat.',
    LM + 24,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'b)',
    'Pemenang lomba akan diumumkan pada saat penutupan kegiatan atau sesuai dengan jadwal yang ditetapkan panitia.',
    LM + 24,
    LM + 30,
    y
  ) + 8;

  setFontTimes('bold', 11.5);
  doc.text('2.  Lomba P3K', LM + 6, y);
  y += 7;
  y = drawWrappedItem('a.', 'Tujuan', LM + 12, LM + 18, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Tujuan lomba P3K adalah untuk melatih kesiapsiagaan peserta didik terhadap evakuasi bencana darurat serta menerapkan keterampilan peserta dalam menggunakan tali temali ( simpul dan ikatan) dalam membuat tandu darurat sederhana menggunakan tongkat dan tali, serta membangun dan menumbuhkan jiwa kepemimpinan, kerja sama, ketelitian, dan kemandirian dalam tim.',
    LM + 18,
    LM + 18,
    y
  ) + 3;

  y = drawWrappedItem('b.', 'Waktu dan Tempat', LM + 12, LM + 18, y) + 1.5;
  setFontTimes('normal', 11.5);
  doc.text('Hari/Tanggal  : Sabtu, 31 Oktober 2026', LM + 18, y);
  y += 6.5;
  doc.text('Waktu              : 07.30 - 10.00 WITA ( Pos terakhir )', LM + 18, y);
  y += 6.5;
  doc.text('Tempat             : Lapangan Sepak Bola Mandala Desa Teratak', LM + 18, y);
  y += 9;

  y = drawWrappedItem('c.', 'Peserta', LM + 12, LM + 18, y) + 1.5;
  y = drawWrappedItem('', 'Peserta lomba P3K, yaitu:', LM + 18, LM + 18, y) + 1.5;
  drawWrappedItem(
    '•',
    'Peserta lomba P3K merupakan anggota regu putra dan putri yang dibentuk oleh setiap gugus depan/sekolah dari jumlah anggota sebanyak 8 (Delapan) orang.',
    LM + 18,
    LM + 24,
    y
  );

  // =========================================================================
  // PAGE 23
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem('d.', 'Proses dan Prosedur :', LM + 12, LM + 18, y) + 1.5;
  y = drawWrappedItem('1)', 'Persiapan Peserta', LM + 18, LM + 24, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Setiap regu atau gugus depan peserta diwajibkan menyiapkan peralatan dan bahan yang diperlukan sesuai ketentuan lomba. Peserta juga harus memahami teknik dasar pionering yang akan digunakan selama lomba.',
    LM + 24,
    LM + 24,
    y
  ) + 2;
  y = drawWrappedItem(
    '',
    'Peralatan yang Wajib Dibawa Peserta:',
    LM + 24,
    LM + 24,
    y,
    6,
    'bold'
  ) + 1.5;
  y = drawWrappedItem(
    'v',
    '2 buah tongkat Pramuka standar (panjang 160 cm).',
    LM + 24,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'v',
    '2 buah tali Pramuka (ukuran/panjang standar regu).',
    LM + 24,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'v',
    'Catatan: Salah satu anggota tim akan berperan sebagai korban (atau menggunakan korban peragaan sesuai arahan juri).',
    LM + 24,
    LM + 30,
    y
  ) + 5;

  y = drawWrappedItem('2)', 'Pelaksanaan Lomba', LM + 18, LM + 24, y) + 1.5;
  y = drawWrappedItem(
    'a)',
    'Lomba P3K berlangsung sesuai jadwal yang telah ditetapkan panitia.',
    LM + 24,
    LM + 30,
    y
  ) + 1.5;
  y = drawWrappedItem('•', 'Wajib membuat tandu.', LM + 30, LM + 36, y, 6, 'bold') + 1.5;
  y = drawWrappedItem(
    '•',
    'Menggunakan 2 (dua) tongkat dan 2 (dua) tali.',
    LM + 30,
    LM + 36,
    y,
    6,
    'bold'
  ) + 1.5;
  y = drawWrappedItem(
    '•',
    'Setiap regu diberikan waktu selama 10 Menit untuk membangun konstruksi pionering (Tandu) menggunakan tongkat dan tali yang dibawa oleh peserta sendiri.',
    LM + 30,
    LM + 36,
    y
  ) + 1.5;
  y = drawWrappedItem(
    '•',
    'Setiap regu kemudian menstimulasikan bagaimana evakuasi terhadap korban kecelakaan( Korban dibaringkan di atas tandu dengan memperhatikan keamanan cedera. Dan kemudian Tim memindahkan/mengangkat korban sejauh rute pendek yang ditentukan untuk menguji kekuatan tandu dan stabilitas evakuasi.',
    LM + 30,
    LM + 36,
    y
  ) + 4;

  drawWrappedItem(
    'b)',
    'Selama lomba berlangsung, peserta harus bekerja sama secara efektif dalam tim dan mengikuti aturan yang berlaku.',
    LM + 24,
    LM + 30,
    y
  );

  // =========================================================================
  // PAGE 24
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem('3)', 'Penilaian', LM + 18, LM + 24, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Penilaian lomba dilakukan oleh dewan juri yang ditunjuk panitia, dengan mempertimbangkan beberapa aspek berikut:',
    LM + 24,
    LM + 24,
    y
  ) + 1.5;
  y = drawWrappedItem('a)', 'Kerapian simpul dan ikatan', LM + 24, LM + 30, y) + 1;
  y = drawWrappedItem('b)', 'Ketepatan simpul dan ikatan', LM + 24, LM + 30, y) + 1;
  y = drawWrappedItem('c)', 'Kekuatan/kekokohan hasil pionering', LM + 24, LM + 30, y) + 1;
  y = drawWrappedItem(
    'd)',
    'Ketepatan penggunaan bahan sesuai ketentuan',
    LM + 24,
    LM + 30,
    y
  ) + 1;
  y = drawWrappedItem('e)', 'Kerjasama tim', LM + 24, LM + 30, y) + 5;

  y = drawWrappedItem('4)', 'Pengumuman Pemenang', LM + 18, LM + 24, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Keputusan dewan juri bersifat mutlak dan akan diumumkan pada akhir kegiatan sesuai jadwal yang telah ditentukan panitia.',
    LM + 24,
    LM + 24,
    y
  ) + 8;

  setFontTimes('bold', 11.5);
  doc.text('3.  Lomba Pentas Seni (Seni Tari)', LM, y);
  y += 7;
  y = drawWrappedItem('a.', 'Tujuan', LM + 6, LM + 12, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Tujuan lomba pentas seni adalah untuk memberikan ruang ekspresi bagi peserta dalam menampilkan bakat dan potensi di bidang seni, serta menumbuhkan rasa percaya diri, kreativitas, dan semangat kebersamaan melalui penampilan yang positif dan edukatif.',
    LM + 12,
    LM + 12,
    y
  ) + 4;

  y = drawWrappedItem('b.', 'Waktu dan Tempat', LM + 6, LM + 12, y) + 1.5;
  setFontTimes('normal', 11.5);
  doc.text("Hari/Tanggal    : Jum'at, 30 Oktober 2026", LM + 12, y);
  y += 6.5;
  doc.text('Waktu                : 20.00 - 23.00 WITA', LM + 12, y);
  y += 6.5;
  doc.text('Tempat               : Lapangan Sepak Bola Mandala Desa Teratak', LM + 12, y);
  y += 9;

  y = drawWrappedItem('c.', 'Peserta', LM + 6, LM + 12, y) + 1.5;
  drawWrappedItem(
    '',
    'Peserta lomba pentas seni merupakan regu yang dibentuk oleh setiap gugus depan/sekolah. Setiap gudep / sekolah mengirimkan satu tim penampil, dengan jumlah anggota disesuaikan dengan jenis',
    LM + 12,
    LM + 12,
    y
  );

  // =========================================================================
  // PAGE 25
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem(
    '',
    'pertunjukan yang dibawakan. Seluruh anggota dalam regu tersebut harus berasal dari gugus depan yang sama serta telah terdaftar secara resmi sebagai peserta kegiatan perkemahan.',
    LM + 12,
    LM + 12,
    y
  ) + 2;

  y = drawWrappedItem('d.', 'Proses dan Prosedur', LM + 6, LM + 12, y) + 1.5;
  y = drawWrappedItem('1)', 'Pendaftaran dan Persiapan', LM + 12, LM + 18, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Setiap gugus depan (gudep) mendaftarkan tim peserta kepada panitia sesuai jadwal yang telah ditentukan. Peserta mempersiapkan penampilan seni secara mandiri, dengan mengikuti ketentuan tema dan jenis pertunjukan yang diperbolehkan oleh panitia.',
    LM + 18,
    LM + 18,
    y
  ) + 2;

  y = drawWrappedItem('2)', 'Pengundian Nomor Urut Tampil', LM + 12, LM + 18, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Panitia akan melakukan pengundian nomor urut penampilan, yang diikuti oleh seluruh tim peserta sebelum pelaksanaan lomba.',
    LM + 18,
    LM + 18,
    y
  ) + 2;

  y = drawWrappedItem('3)', 'Pelaksanaan Lomba', LM + 12, LM + 18, y) + 1.5;
  y = drawWrappedItem(
    'a)',
    'Setiap tim tampil sesuai nomor urut dan diberi waktu maksimal 6 menit untuk menampilkan pertunjukan seni.',
    LM + 18,
    LM + 24,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'b)',
    'Jenis pertunjukan dalam kategori Pentas Seni adalah tarian. Peserta diberikan kebebasan untuk menampilkan berbagai jenis tarian sesuai dengan kreativitas masing-masing. Tarian yang ditampilkan tidak hanya terbatas pada tari tradisional atau tari modern, tetapi juga dapat berupa bentuk tarian lainnya, seperti tari kreasi baru, tari semaphore, maupun jenis tarian lain yang relevan dan sesuai dengan norma kesopanan. Dengan demikian, peserta diharapkan dapat menampilkan pertunjukan yang kreatif, menarik, serta tetap menghormati nilai budaya dan aturan yang berlaku.',
    LM + 18,
    LM + 24,
    y
  ) + 1.5;
  y = drawWrappedItem(
    'c)',
    'Penampilan tidak diperbolehkan mengandung unsur kekerasan, SARA, pornografi, maupun hal lain yang bertentangan dengan norma dan etika.',
    LM + 18,
    LM + 24,
    y
  ) + 1.5;
  drawWrappedItem(
    'd)',
    'Peserta wajib menggunakan perlengkapan dan properti yang',
    LM + 18,
    LM + 24,
    y
  );

  // =========================================================================
  // PAGE 26
  // =========================================================================
  doc.addPage();
  y = 35;
  y = drawWrappedItem(
    '',
    'aman serta tidak membahayakan diri sendiri maupun orang lain.',
    LM + 24,
    LM + 24,
    y
  ) + 2;
  y = drawWrappedItem('4)', 'Penilaian', LM + 16, LM + 22, y) + 1.5;
  y = drawWrappedItem(
    '',
    'Dewan juri akan melakukan penilaian berdasarkan kriteria yang ditentukan, seperti Gerakan, Kekompakan dan Kostum.',
    LM + 22,
    LM + 22,
    y
  ) + 2;
  y = drawWrappedItem('5)', 'Pengumuman Pemenang', LM + 16, LM + 22, y) + 1.5;
  drawWrappedItem(
    '',
    'Keputusan dewan juri bersifat mutlak dan tidak dapat diganggu gugat. Pemenang akan diumumkan pada saat penutupan kegiatan atau sesuai jadwal yang telah ditentukan panitia',
    LM + 22,
    LM + 22,
    y
  );

  // =========================================================================
  // PAGE 27 (BAB VI PELAKSANA KEGIATAN)
  // =========================================================================
  doc.addPage();
  drawCenteredBold('BAB VI', 35, 12);
  drawCenteredBold('PELAKSANA KEGIATAN', 43, 12);

  y = 53;
  setFontTimes('bold', 11.5);
  doc.text('A.', LM, y);
  doc.text('Sangga Kerja', LM + 8, y);
  y += 7;
  y = drawWrappedItem(
    '',
    'Sangga Kerja kegiatan ini adalah andalan Kwarran Muara Kaman, anggota DKR, anggota Kelompok Kerja, dan sukarelawan yang ditunjuk sebagai Sangga Kerja Pelaksana sesuai dengan surat keputusan ketua Kwarran Muara Kaman Tentang Sangga Kerja Pelaksana PESTA PENGGALANG Tahun 2026.',
    LM + 8,
    LM + 8,
    y
  ) + 8;

  setFontTimes('bold', 11.5);
  doc.text('B.', LM, y);
  doc.text('Tim Juri', LM + 8, y);
  y += 7;
  drawWrappedItem(
    '',
    'Tim Juri kegiatan ini adalah Andalan Kwarran Muara Kaman dan unsur lain yang dianggap mumpuni di bidangnya masing-masing.',
    LM + 8,
    LM + 8,
    y
  );

  // =========================================================================
  // PAGE 28 (BAB VII PENUTUP + Stamp & Signature Sukriansyah, S.Pd)
  // =========================================================================
  doc.addPage();
  drawCenteredBold('BAB VII PENUTUP', 35, 12);

  y = 47;
  y = drawWrappedItem(
    '',
    'Demikian petunjuk teknis ini dibuat untuk melengkapi petunjuk pelaksanaan PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026, diharapkan semua unsur yang terlibat dalam pelaksanaan PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman Tahun 2026 ini dapat menjadikan Juknis ini sebagai pedoman standar dalam melaksanakan tugas dan tanggung jawabnya.',
    LM,
    LM,
    y,
    6.8
  );

  // Official Stamp & Signature Block
  const stampX = 86;
  const stampY = 108;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.7);
  doc.roundedRect(stampX, stampY, 30, 36, 2.5, 2.5, 'S');
  doc.setLineWidth(0.35);
  doc.roundedRect(stampX + 1, stampY + 1, 28, 34, 2, 2, 'S');

  // Tunas Kelapa emblem inside stamp
  doc.circle(stampX + 15, stampY + 11, 7.5, 'S');
  doc.setFillColor(0, 0, 0);
  doc.ellipse(stampX + 15, stampY + 13.5, 2.5, 1.5, 'F');
  doc.line(stampX + 15, stampY + 12, stampX + 15, stampY + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.2);
  doc.text('GERAKAN PRAMUKA', stampX + 15, stampY + 21.5, { align: 'center' });
  doc.setFontSize(5);
  doc.text('PANITIA PELAKSANA', stampX + 15, stampY + 25.5, { align: 'center' });
  doc.text('PESTA PENGGALANG', stampX + 15, stampY + 28.5, { align: 'center' });
  doc.setFontSize(4.4);
  doc.text('KECAMATAN MUARA KAMAN', stampX + 15, stampY + 31.3, { align: 'center' });
  doc.text('TAHUN 2026', stampX + 15, stampY + 33.8, { align: 'center' });

  // Signature text on the right of stamp
  setFontTimes('normal', 11.5);
  doc.text('Muara Kaman, 20 September 2026', 118, 111);
  doc.text('Ketua Panitia', 118, 116.5);

  // Handwritten signature strokes matching original
  doc.setDrawColor(10, 20, 45);
  doc.setLineWidth(0.6);
  doc.line(127, 108, 134, 162);
  doc.line(127, 108, 131, 136);
  doc.line(131, 136, 135, 131);
  doc.line(135, 131, 137, 137);
  doc.line(137, 137, 141, 123);

  setFontTimes('normal', 11.5);
  doc.text('Sukriansyah, S.Pd', 118, 140);
  doc.setLineWidth(0.35);
  doc.line(118, 141, 156, 141);
  doc.text('NTA.', 118, 146);

  // =========================================================================
  // PAGE 29 (Lampiran: Permohonan Ijin Kepala Sekolah)
  // =========================================================================
  doc.addPage();
  setFontTimes('normal', 12);
  doc.text('[KOP SEKOLAH]', PW / 2, 24, { align: 'center' });
  doc.setLineWidth(0.8);
  doc.line(LM, 28, RM, 28);
  doc.setLineWidth(0.3);
  doc.line(LM, 29.2, RM, 29.2);

  setFontTimes('normal', 11.5);
  doc.text('Muara Kaman, .....Oktober 2026', RM, 46, { align: 'right' });

  y = 54;
  doc.text('Perihal  : PERMOHONAN IJIN', LM, y);
  y += 7;
  doc.text('Kepada Yth.', LM, y);
  y += 7;
  doc.text('Bapak/Ibu Orang Tua/Wali Siswa', LM, y);
  y += 7;
  doc.text('Di tempat', LM, y);
  y += 14;

  doc.text('Salam Pramuka,', LM, y);
  y += 7;
  y = drawWrappedItem(
    '',
    '       Dengan hormat kami sampaikan, bahwa Kwaran Muara Kaman akan mengadakan PESTA PENGGALANG Tingkat SMP/MTs Kecamatan Muara Kaman yang akan dilaksanakan pada :',
    LM,
    LM,
    y
  ) + 2;

  doc.text("Hari, Tanggal          : Jum'at - Sabtu, 30 -31 Oktober 2026", LM, y);
  y += 7;
  doc.text('Tempat                    : Buper Lapangan Sepak Bola Mandala Desa Teratak', LM, y);
  y += 7;
  doc.text('Bentuk Kegiatan    : Perkemahan', LM, y);
  y += 7;

  y = drawWrappedItem(
    '',
    '       Sehubungan dengan hal di atas, kami meminta kepada orang tua siswa agar mengijinkan putra/putrinya untuk mengikuti kegiatan tersebut.',
    LM,
    LM,
    y
  ) + 2;

  y = drawWrappedItem(
    '',
    '       Demikian permohonan ini kami sampaikan. Atas perhatian dan kerja samanya kami ucapkan terima kasih',
    LM,
    LM,
    y
  ) + 8;

  doc.text('Mengetahui,', 118, y);
  y += 7;
  doc.text('Kepala Sekolah.................................', 118, y);
  y += 24;
  setFontTimes('bold', 11.5);
  doc.text('NAMA', 118, y);
  setFontTimes('normal', 11.5);
  doc.text('NIP.', 118, y + 6.5);

  // =========================================================================
  // PAGE 30 (SURAT IZIN ORANG TUA / WALI MURID)
  // =========================================================================
  doc.addPage();
  doc.setLineWidth(0.2);
  doc.line(LM, 26, RM, 26);
  drawCenteredBold('SURAT IZIN ORANG TUA / WALI MURID', 31, 11.5);

  y = 40;
  setFontTimes('normal', 11.5);
  doc.text('Kepada Yth : Kepala Sekolah ...............................', LM, y);
  y += 13;
  doc.text('Assalamualaikum Wr. Wb.', LM, y);
  y += 7;
  y = drawWrappedItem(
    '',
    'Sehubungan dengan akan di adakannya PESTA PENGGALANG tingkat SMP/MTs di Kecamatan Muara Kaman, saya yang bertanda tangan di bawah ini:',
    LM,
    LM,
    y
  ) + 2;

  const parentFields = [
    ['Nama Orang Tua / Wali', ': ........................................................................................'],
    ['Pekerjaan', ': ........................................................................................'],
    ['Alamat / No. HP', ': ........................................................................................'],
    ['Orang Tua / Wali dari :', ''],
    ['Nama Siswa', ': ........................................................................................'],
    ['Kelas', ': ........................................................................................'],
    ['Regu', ': ........................................................................................'],
  ];
  parentFields.forEach(([label, dots]) => {
    setFontTimes('bold', 11);
    doc.text(label, LM, y);
    if (dots) {
      setFontTimes('normal', 11);
      doc.text(dots, LM + 48, y);
    }
    y += 6.8;
  });

  y += 1;
  y = drawWrappedItem(
    '',
    'Dengan ini MENGIZINKAN / TIDAK MENGIZINKAN* anak kami untuk mengikuti kegiatan PESTA PENGGALANG Ranting / Tingkat SMP/MTs Se-Kecamatan Muara Kaman, yang dilaksanakan pada:',
    LM,
    LM,
    y
  ) + 2;

  setFontTimes('bold', 11);
  doc.text('Hari / Tanggal', LM + 5, y);
  setFontTimes('normal', 11);
  doc.text(": Jum'at - Sabtu (30-31 Oktober 2026)", LM + 38, y);
  y += 6.5;

  setFontTimes('bold', 11);
  doc.text('Tempat', LM + 5, y);
  setFontTimes('normal', 11);
  doc.text(': Bumi Perkemahan Lapangan Sepak Bola Mandala Desa', LM + 38, y);
  y += 6;
  doc.text('  Teratak Kecamatan Muara Kaman', LM + 38, y);
  y += 6.5;

  setFontTimes('bold', 11);
  doc.text('Acara', LM + 5, y);
  setFontTimes('normal', 11);
  doc.text(': Kegiatan Perkemahan PESTA PENGGALANG Tingkat', LM + 38, y);
  y += 6;
  doc.text('  SMP/MTs', LM + 38, y);
  y += 7;

  y = drawWrappedItem(
    '',
    'Demikian surat izin ini dibuat dengan sadar dan penuh rasa tanggung jawab agar dapat dipergunakan sebagaimana mestinya.',
    LM,
    LM,
    y
  ) + 3;

  doc.text('.........................., .................................... 2026', LM, y);
  y += 7;
  doc.text('Mengetahui,', 124, y);
  y += 6.5;
  setFontTimes('bold', 11);
  doc.text('Orang Tua / Wali Murid', 124, y);
  y += 19;
  setFontTimes('italic', 11);
  doc.text('( ................................................... )', 124, y);
  y += 6.5;
  doc.text('Nama Terang & Tanda Tangan', 124, y);
  y += 7;

  doc.text('*Coret yang tidak perlu', LM, y);
  y += 6.5;
  setFontTimes('normal', 11);
  doc.text('Catatan Orang Tua Ke Pembina untuk menjadi Perhatian :', LM, y);
  y += 6.5;
  doc.text(
    '1.  ......................................................................................................................................',
    LM,
    y
  );
  y += 6.5;
  doc.text(
    '2.  ......................................................................................................................................',
    LM,
    y
  );

  // =========================================================================
  // PAGE 31 (FORMULIR BIODATA PESERTA PRAMUKA PENGGALANG)
  // =========================================================================
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('KOP', PW / 2, 24, { align: 'center' });
  doc.setLineWidth(0.3);
  doc.line(20, 32, 190, 32);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('FORMULIR BIODATA PESERTA PRAMUKA PENGGALANG', PW / 2, 43, { align: 'center' });

  y = 54;
  doc.setFontSize(10);
  doc.text('A. IDENTITAS PRIBADI', 20, y);
  y += 9;

  const bioFieldsA = [
    ['Nama Lengkap', ':  ..................................................................................................'],
    ['Nama Panggilan', ':  ...................................................................................................'],
    ['Nomor Induk Siswa (NISN)', ':  ...................................................................................................'],
    ['Jenis Kelamin', ':  Laki-laki / Perempuan *(Coret yang tidak perlu)*'],
    ['Tempat, Tanggal Lahir', ':  ...................................................................................................'],
    ['Agama', ':  ...................................................................................................'],
    ['Golongan Darah', ':  A / B / AB / O'],
    ['Tinggi / Berat Badan', ':  ......... cm / ......... kg'],
    ['Alamat Rumah', ':  ...................................................................................................'],
    ['Nomor HP / WhatsApp', ':  ...................................................................................................'],
    ['Kelas', ':  VII / VIII / IX *(Lingkari yang sesuai)*'],
  ];

  bioFieldsA.forEach(([label, val]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(label, 20, y);
    doc.text(val, 74, y);
    y += 10.5;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('B. DATA KEPRAMUKAAN', 20, y);
  y += 9;

  const bioFieldsB = [
    ['Nomor Gugus Depan', ':  ...................................................................................................'],
    ['Nama Regu', ':  ...................................................................................................'],
    ['Jabatan di Regu', ':  Anggota / Pinru / Wapinru'],
    ['Tingkat Kecakapan (TKU)', ':  [  ] Ramu   [  ] Rakit   [  ] Terap'],
    ['TKK yang Dimiliki', ':  1. ........................................   2. ........................................'],
  ];

  bioFieldsB.forEach(([label, val]) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(label, 20, y);
    doc.text(val, 74, y);
    y += 10.5;
  });

  // =========================================================================
  // PAGE 32 (C. DATA KESEHATAN, D. DATA ORANG TUA / WALI & PERSETUJUAN)
  // =========================================================================
  doc.addPage();
  y = 24;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('C. DATA KESEHATAN', 20, y);
  y += 9;

  const bioFieldsC = [
    ['Riwayat Penyakit / Alergi', ':  ...................................................................................................'],
    ['Pantangan Makanan', ':  ...................................................................................................'],
    ['Keterangan Medis Khusus', ':  ...................................................................................................'],
  ];
  bioFieldsC.forEach(([label, val]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, 20, y);
    doc.text(val, 74, y);
    y += 10.5;
  });

  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.text('D. DATA ORANG TUA / WALI', 20, y);
  y += 9;

  const bioFieldsD = [
    ['Nama Orang Tua / Wali', ':  ...................................................................................................'],
    ['Pekerjaan', ':  ...................................................................................................'],
    ['No. HP / WhatsApp', ':  ...................................................................................................'],
  ];
  bioFieldsD.forEach(([label, val]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, 20, y);
    doc.text(val, 74, y);
    y += 10.5;
  });

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text('PERSETUJUAN ORANG TUA / WALI', 20, y);
  y += 6;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.8);
  const consentLines = [
    'Saya yang bertanda tangan di bawah ini selaku orang tua/wali dari peserta di atas, memberikan izin',
    'sepenuhnya kepada anak kami untuk mengikuti seluruh rangkaian kegiatan Kepramukaan Penggalang',
    'yang diselenggarakan oleh Gugus Depan/Pangkalan.',
  ];
  consentLines.forEach((cl) => {
    doc.text(cl, 20, y);
    y += 5.5;
  });

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('..............., ......................... 202...', 190, y, { align: 'right' });

  y += 10;
  doc.text('Orang Tua / Wali,', 46, y, { align: 'center' });
  doc.text('Peserta,', 156, y, { align: 'center' });

  // Pas Foto 3 x 4 Box in center
  doc.setFillColor(240, 240, 240);
  doc.rect(87, y + 6, 36, 26, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.text('Pas Foto', 105, y + 17, { align: 'center' });
  doc.text('3 x 4', 105, y + 22, { align: 'center' });

  y += 38;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('( .................................................. )', 46, y, { align: 'center' });
  doc.text('( .................................................. )', 156, y, { align: 'center' });

  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.text('Mengetahui,', PW / 2, y, { align: 'center' });
  y += 5.5;
  doc.text('Pembina Pramuka / Pembina Regu', PW / 2, y, { align: 'center' });

  y += 22;
  doc.text('( .................................................. )', PW / 2, y, { align: 'center' });
  y += 5.5;
  doc.text('NIP / NTA. ..........................................', PW / 2, y, { align: 'center' });

  doc.save('Juknis_Pesta_Penggalang_Kecamatan_Muara_Kaman_Tahun_2026.pdf');
}
