import React, { useState } from 'react';
import {
  Download,
  Printer,
  Camera,
  Check,
  IdCard,
} from 'lucide-react';
import { SubmittedRegistration } from '../types/registration';
import {
  IdCardPerson,
  buildIdCardsFromRegistration,
  downloadIdCardAsPng,
  downloadPrintableCardsHtml,
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
  const [printedNotice, setPrintedNotice] = useState(false);

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

  const handleDownloadSingleCard = async (card: IdCardPerson) => {
    setDownloadingId(card.id);
    try {
      await downloadIdCardAsPng(card);
    } finally {
      setTimeout(() => setDownloadingId(null), 900);
    }
  };

  const handlePrintAllCards = () => {
    downloadPrintableCardsHtml(registration, filteredCards);
    setPrintedNotice(true);
    setTimeout(() => setPrintedNotice(false), 3500);
    try {
      window.print();
    } catch {
      // Ignore if blocked in iframe
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Tombol Cetak / Simpan Semua Kartu */}
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
                Anda dapat mengunggah pasfoto (opsional) dan mengunduh kartu beresolusi tinggi
                (PNG) atau lembar siap cetak.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePrintAllCards}
            className="min-h-[52px] px-5 py-3 rounded-2xl bg-[#C81E1E] hover:bg-[#A51717] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] transition-all cursor-pointer shrink-0"
          >
            {printedNotice ? (
              <>
                <Check className="w-5 h-5" />
                <span>Lembar Cetak Kartu Diunduh!</span>
              </>
            ) : (
              <>
                <Printer className="w-5 h-5" />
                <span>Cetak / Unduh Semua Kartu ({filteredCards.length})</span>
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

          const ringBorderColor = isPembina
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
            <div
              key={card.id}
              className="flex flex-col items-center space-y-3"
            >
              {/* PORTRAIT ID CARD CONTAINER */}
              <div className="w-full max-w-[330px] aspect-[3/4.4] rounded-3xl bg-[#FAF7F2] border-[3px] border-[#4A2C11] shadow-md overflow-hidden flex flex-col justify-between relative">
                {/* TOP HEADER BLOCK */}
                <div>
                  <div
                    className={`bg-gradient-to-b ${headerGradient} px-4 pt-3 pb-4 text-white text-center relative`}
                  >
                    {/* Lanyard Hole Visual */}
                    <div className="w-12 h-2 rounded-full bg-[#FAF7F2] mx-auto mb-2.5 shadow-inner" />

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

                {/* CENTER PHOTO / AVATAR & IDENTITY */}
                <div className="px-5 py-3 flex-1 flex flex-col items-center justify-center text-center">
                  {/* Circular Photo Frame with Optional Upload */}
                  <div className="relative group mb-2.5">
                    <div
                      className={`w-24 h-24 rounded-full border-4 ${ringBorderColor} bg-white shadow-sm overflow-hidden flex items-center justify-center`}
                    >
                      {card.customPhotoUrl ? (
                        <img
                          src={card.customPhotoUrl}
                          alt={card.nama}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#4A2C11]">
                          <span className="text-2xl font-extrabold tracking-tight">
                            {initials || 'GP'}
                          </span>
                          <span className="text-[9px] font-semibold text-[#7A5C3E]">
                            PRAMUKA
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Upload Photo Trigger on Card */}
                    <label
                      htmlFor={`photo-upload-${card.id}`}
                      title="Ganti Pasfoto Kartu"
                      className="no-print absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#4A2C11] hover:bg-[#C81E1E] text-white flex items-center justify-center shadow-md cursor-pointer transition-colors"
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
                    className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${roleBadgeBg} shadow-2xs`}
                  >
                    {card.kategori}
                  </div>

                  {/* Full Name */}
                  <h5 className="mt-2 text-base font-extrabold text-[#23170D] leading-snug line-clamp-2">
                    {card.nama}
                  </h5>

                  {/* Jabatan / Peran */}
                  <p className="text-xs font-bold text-[#7A5C3E] mt-0.5">
                    {card.jabatan}
                  </p>

                  {/* Details Table Card */}
                  <div className="mt-3 w-full bg-white rounded-2xl border border-[#E5DEC9] p-2.5 text-left text-[11px] space-y-1 shadow-2xs">
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
                  className={`bg-gradient-to-r ${headerGradient} py-2 px-3 text-center text-[9px] font-bold tracking-wider text-[#F3D299]`}
                >
                  PANITIA PESTA PENGGALANG KEC. MUARA KAMAN
                </div>
              </div>

              {/* Action Button Under Each Card */}
              <button
                type="button"
                onClick={() => handleDownloadSingleCard(card)}
                className="no-print w-full max-w-[330px] min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-[#EFE8DC] text-[#4A2C11] border border-[#D8CEBE] font-semibold text-xs flex items-center justify-center gap-2 shadow-2xs active:scale-[0.99] transition-all cursor-pointer"
              >
                {downloadingId === card.id ? (
                  <>
                    <Check className="w-4 h-4 text-[#15803D]" />
                    <span>Kartu PNG Berhasil Diunduh!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-[#C81E1E]" />
                    <span>Unduh Kartu Ini (PNG Portrait)</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
