import React, { useState } from 'react';
import {
  Download,
  FileDown,
  Camera,
  Check,
  IdCard,
  Loader2,
} from 'lucide-react';
import { SubmittedRegistration } from '../types/registration';
import {
  IdCardPerson,
  buildIdCardsFromRegistration,
  downloadIdCardAsPng,
  downloadSingleIdCardAsPdf,
  downloadAllCardsAsPdf,
} from '../utils/downloadHelpers';
import { TunasKelapaLogo, WosmLogo } from './PramukaEmblems';

interface IdCardsShowcaseProps {
  registration: SubmittedRegistration;
}

export const IdCardsShowcase: React.FC<IdCardsShowcaseProps> = ({ registration }) => {
  const [customPhotos, setCustomPhotos] = useState<Record<string, string>>({});
  const [categoryFilter, setCategoryFilter] = useState<
    'ALL' | 'PEMBINA' | 'PUTRA' | 'PUTRI'
  >('ALL');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadingAllPdf, setDownloadingAllPdf] = useState(false);
  const [pdfSuccessNotice, setPdfSuccessNotice] = useState(false);

  const allCards = buildIdCardsFromRegistration(registration).map((card) => ({
    ...card,
    customPhotoUrl: customPhotos[card.id],
  }));

  const filteredCards = allCards.filter((c) => {
    if (categoryFilter === 'PEMBINA')
      return c.kategori === 'PEMBINA PUTRA' || c.kategori === 'PEMBINA PUTRI';
    if (categoryFilter === 'PUTRA') return c.kategori === 'PESERTA PUTRA';
    if (categoryFilter === 'PUTRI') return c.kategori === 'PESERTA PUTRI';
    return true;
  });

  const handlePhotoUpload = (cardId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomPhotos((prev) => ({
          ...prev,
          [cardId]: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadSinglePdf = async (card: IdCardPerson) => {
    setDownloadingId(`${card.id}-pdf`);
    try {
      await downloadSingleIdCardAsPdf(card);
    } finally {
      setTimeout(() => setDownloadingId(null), 900);
    }
  };

  const handleDownloadSinglePng = async (card: IdCardPerson) => {
    setDownloadingId(`${card.id}-png`);
    try {
      await downloadIdCardAsPng(card);
    } finally {
      setTimeout(() => setDownloadingId(null), 900);
    }
  };

  const handleDownloadAllPdf = async () => {
    if (downloadingAllPdf) return;
    setDownloadingAllPdf(true);
    try {
      await downloadAllCardsAsPdf(registration, filteredCards);
      setPdfSuccessNotice(true);
      setTimeout(() => setPdfSuccessNotice(false), 3500);
    } finally {
      setDownloadingAllPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tombol Unduh Semua Kartu Langsung File PDF (.pdf) */}
      <div className="bg-white rounded-3xl border border-[#E5DEC9] p-5 sm:p-6 space-y-5 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#4A2C11] text-white flex items-center justify-center shrink-0">
              <IdCard className="w-6 h-6 text-[#F3D299]" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#23170D]">
                Kartu Tanda Peserta & Pembina Pendamping (Tipe Portrait)
              </h3>
              <p className="text-xs sm:text-sm text-[#6B5744] mt-0.5">
                Otomatis dibuat dari data pendaftaran <strong>{registration.namaSekolah}</strong>.
                Dilengkapi bingkai pasfoto <strong>4x6 sudut melengkung</strong> dan hasil unduhan{' '}
                <strong>PDF (.pdf)</strong> yang sama persis dengan pratinjau.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadAllPdf}
            disabled={downloadingAllPdf}
            className="min-h-[52px] px-5 py-3 rounded-2xl bg-[#C81E1E] hover:bg-[#A51717] disabled:opacity-70 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer shrink-0"
          >
            {downloadingAllPdf ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Menyiapkan File PDF ({filteredCards.length} Kartu)...</span>
              </>
            ) : pdfSuccessNotice ? (
              <>
                <Check className="w-5 h-5" />
                <span>File PDF Berhasil Diunduh!</span>
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                <span>Unduh Semua Kartu ({filteredCards.length}) — File PDF (.pdf)</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Kategori Kartu */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-[#4A2C11] text-white shadow-2xs'
                : 'bg-[#FAF7F2] text-[#4A2C11] border border-[#D8CEBE] hover:bg-[#EFE8DC]'
            }`}
          >
            Semua Kartu ({allCards.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('PEMBINA')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              categoryFilter === 'PEMBINA'
                ? 'bg-[#B45309] text-white shadow-2xs'
                : 'bg-[#FAF7F2] text-[#4A2C11] border border-[#D8CEBE] hover:bg-[#EFE8DC]'
            }`}
          >
            Pembina Pendamping (4)
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('PUTRA')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              categoryFilter === 'PUTRA'
                ? 'bg-[#8B1E1E] text-white shadow-2xs'
                : 'bg-[#FAF7F2] text-[#8B1E1E] border border-[#D8CEBE] hover:bg-[#EFE8DC]'
            }`}
          >
            Peserta Putra (8)
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('PUTRI')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              categoryFilter === 'PUTRI'
                ? 'bg-[#4B1E78] text-white shadow-2xs'
                : 'bg-[#FAF7F2] text-[#4B1E78] border border-[#D8CEBE] hover:bg-[#EFE8DC]'
            }`}
          >
            Peserta Putri (8)
          </button>
        </div>
      </div>

      {/* Grid Kartu Nama Portrait */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.map((card) => {
          const isPembina =
            card.kategori === 'PEMBINA PUTRA' || card.kategori === 'PEMBINA PUTRI';
          const isPutra = card.kategori === 'PESERTA PUTRA';

          const headerGradient = isPembina
            ? 'from-[#4A2C11] via-[#5C3614] to-[#3B220C]'
            : isPutra
            ? 'from-[#7F1D1D] via-[#991B1B] to-[#651515]'
            : 'from-[#4B1E78] via-[#5B21B6] to-[#3B1561]';

          const roleBadgeBg = isPembina
            ? 'bg-[#B45309] text-white'
            : isPutra
            ? 'bg-[#C81E1E] text-white'
            : 'bg-[#6B21A8] text-white';

          const frameBorderColor = isPembina
            ? 'border-[#D97706]'
            : isPutra
            ? 'border-[#C81E1E]'
            : 'border-[#6B21A8]';

          const initials = card.nama
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase())
            .join('');

          return (
            <div key={card.id} className="flex flex-col items-center space-y-3">
              {/* PORTRAIT ID CARD CONTAINER (Matches renderIdCardToCanvas 1:1) */}
              <div className="w-full max-w-[330px] aspect-[900/1380] rounded-3xl bg-[#FAF7F2] border-[3px] border-[#4A2C11] shadow-md overflow-hidden flex flex-col justify-between relative">
                {/* TOP HEADER BLOCK */}
                <div>
                  <div
                    className={`bg-gradient-to-b ${headerGradient} px-4 pt-3 pb-4 text-white text-center relative`}
                  >
                    {/* Lanyard Hole Visual */}
                    <div className="w-11 h-2 rounded-full bg-[#FAF7F2] mx-auto mb-2.5 shadow-inner" />

                    <div className="flex items-center justify-between gap-2">
                      <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
                        <TunasKelapaLogo className="w-6 h-8 text-[#23170D]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-bold tracking-wider text-[#F3D299] leading-tight">
                          GERAKAN PRAMUKA KWARRAN
                        </p>
                        <p className="text-[10px] font-bold tracking-wider text-[#F3D299] leading-tight">
                          KECAMATAN MUARA KAMAN
                        </p>
                        <h4 className="text-sm font-extrabold tracking-tight text-white mt-0.5 leading-tight">
                          PESTA PENGGALANG
                        </h4>
                      </div>

                      <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
                        <WosmLogo className="w-7 h-7" />
                      </div>
                    </div>
                  </div>

                  {/* Pita Merah Putih Kacu Pramuka */}
                  <div className="h-2.5 w-full flex border-b border-[#D8CEBE]">
                    <div className="w-1/2 h-full bg-[#C81E1E]" />
                    <div className="w-1/2 h-full bg-white" />
                  </div>
                </div>

                {/* CENTER 4x6 ROUNDED PHOTO FRAME & IDENTITY */}
                <div className="px-5 py-2.5 flex-1 flex flex-col items-center justify-center text-center">
                  {/* 4x6 Portrait Photo Frame with All Corners Rounded (w-[88px] h-[132px] = exact 4:6 ratio) */}
                  <div className="relative group mb-2.5">
                    <div
                      className={`w-[88px] h-[132px] rounded-2xl border-4 ${frameBorderColor} bg-white shadow-sm overflow-hidden flex items-center justify-center`}
                    >
                      {card.customPhotoUrl ? (
                        <img
                          src={card.customPhotoUrl}
                          alt={card.nama}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#4A2C11] px-1">
                          <span className="text-2xl font-extrabold tracking-tight">
                            {initials || 'GP'}
                          </span>
                          <span className="text-[8.5px] font-bold text-[#7A5C3E] mt-0.5">
                            PRAMUKA
                          </span>
                          <span className="text-[7.5px] font-semibold text-[#A38B73] mt-0.5">
                            FOTO 4x6
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Upload Photo Trigger on Card */}
                    <label
                      htmlFor={`photo-upload-${card.id}`}
                      title="Unggah Pasfoto 4x6"
                      className="no-print absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-[#4A2C11] hover:bg-[#C81E1E] text-white flex items-center justify-center shadow-md cursor-pointer transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      <input
                        id={`photo-upload-${card.id}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(card.id, e)}
                        className="sr-only"
                      />
                    </label>
                  </div>

                  {/* Role / Category Ribbon */}
                  <div
                    className={`px-3.5 py-0.5 rounded-full text-[9.5px] font-extrabold tracking-wider ${roleBadgeBg} shadow-2xs`}
                  >
                    {card.kategori}
                  </div>

                  {/* Full Name */}
                  <h5 className="mt-1.5 text-sm font-extrabold text-[#23170D] leading-snug line-clamp-1">
                    {card.nama}
                  </h5>

                  {/* Jabatan / Peran */}
                  <p className="text-[11px] font-bold text-[#7A5C3E]">
                    {card.jabatan}
                  </p>

                  {/* Details Table Card */}
                  <div className="mt-2 w-full bg-white rounded-2xl border border-[#E5DEC9] p-2.5 text-left text-[10.5px] space-y-1 shadow-2xs">
                    <div className="flex items-start justify-between gap-2 border-b border-[#F3ECE0] pb-1">
                      <span className="text-[#6B5744] font-semibold shrink-0">Pangkalan</span>
                      <span className="font-bold text-[#23170D] text-right truncate">
                        {card.namaSekolah}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-2 border-b border-[#F3ECE0] pb-1">
                      <span className="text-[#6B5744] font-semibold shrink-0">
                        {card.nipAtauReguLabel}
                      </span>
                      <span className="font-mono-num font-bold text-[#23170D] text-right truncate">
                        {card.nipAtauReguValue}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[#6B5744] font-semibold shrink-0">ID Kartu</span>
                      <span className="font-mono-num font-bold text-[#4A2C11] text-right">
                        {card.nomorKartu}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM FOOTER BAND */}
                <div
                  className={`bg-gradient-to-r ${headerGradient} py-2 px-3 text-center text-[8.5px] font-bold tracking-wider text-[#F3D299]`}
                >
                  PANITIA PESTA PENGGALANG KEC. MUARA KAMAN
                </div>
              </div>

              {/* Action Buttons Under Each Card (PDF & PNG) */}
              <div className="no-print w-full max-w-[330px] grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadSinglePdf(card)}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-[#4A2C11] hover:bg-[#361F0B] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.99] transition-all cursor-pointer"
                >
                  {downloadingId === `${card.id}-pdf` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>PDF Diunduh!</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-3.5 h-3.5 text-[#F3D299]" />
                      <span>Unduh PDF</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadSinglePng(card)}
                  className="min-h-[44px] px-3 py-2 rounded-xl bg-white hover:bg-[#EFE8DC] text-[#4A2C11] border border-[#D8CEBE] font-semibold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-[0.99] transition-all cursor-pointer"
                >
                  {downloadingId === `${card.id}-png` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>PNG Diunduh!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-[#C81E1E]" />
                      <span>Unduh PNG</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
