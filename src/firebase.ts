import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
  serverTimestamp,
  query,
  where,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { SubmittedRegistration, PaymentProofFile } from '../types/registration';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

const REGISTRATIONS_COLLECTION = 'registrations';

/**
 * Compresses large image dataUrls if needed so that the document always stays well under
 * the 1MB Firestore document limit and the 950,000-char blueprint rule constraint.
 */
export async function optimizePaymentProofForFirestore(
  proof: PaymentProofFile | null
): Promise<PaymentProofFile | null> {
  if (!proof) return null;
  if (!proof.dataUrl || proof.dataUrl.length <= 750000 || proof.fileType.includes('svg')) {
    return {
      fileName: (proof.fileName || 'bukti_transfer').slice(0, 300),
      fileSize: Math.min(Math.max(0, Math.round(proof.fileSize || 0)), 10485760),
      fileType: (proof.fileType || 'image/jpeg').slice(0, 120),
      dataUrl: (proof.dataUrl || '').slice(0, 940000),
      uploadedAt: (proof.uploadedAt || '-').slice(0, 64),
    };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            ...proof,
            fileName: proof.fileName.slice(0, 300),
            fileType: proof.fileType.slice(0, 120),
            dataUrl: proof.dataUrl.slice(0, 940000),
            uploadedAt: proof.uploadedAt.slice(0, 64),
          });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
        resolve({
          fileName: proof.fileName.slice(0, 300),
          fileSize: Math.min(Math.max(0, Math.round(compressedDataUrl.length * 0.75)), 10485760),
          fileType: 'image/jpeg',
          dataUrl: compressedDataUrl.slice(0, 940000),
          uploadedAt: proof.uploadedAt.slice(0, 64),
        });
      } catch {
        resolve({
          ...proof,
          fileName: proof.fileName.slice(0, 300),
          fileType: proof.fileType.slice(0, 120),
          dataUrl: proof.dataUrl.slice(0, 940000),
          uploadedAt: proof.uploadedAt.slice(0, 64),
        });
      }
    };
    img.onerror = () => {
      resolve({
        ...proof,
        fileName: proof.fileName.slice(0, 300),
        fileType: proof.fileType.slice(0, 120),
        dataUrl: proof.dataUrl.slice(0, 940000),
        uploadedAt: proof.uploadedAt.slice(0, 64),
      });
    };
    img.src = proof.dataUrl;
  });
}

function normalizeArray8(arr: string[] | undefined, maxLen: number): string[] {
  const base = Array.isArray(arr) ? arr.slice(0, 8) : [];
  while (base.length < 8) {
    base.push('');
  }
  return base.map((item) => String(item ?? '').trim().slice(0, maxLen));
}

export async function saveRegistrationToFirestore(reg: SubmittedRegistration): Promise<void> {
  const safeId = reg.id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  const path = `${REGISTRATIONS_COLLECTION}/${safeId}`;
  const optimizedProof = await optimizePaymentProofForFirestore(reg.buktiPembayaran);

  const payload = {
    id: safeId,
    nomorRegistrasi: (reg.nomorRegistrasi || 'PP-MK-2026-0000').trim().slice(0, 64),
    tanggalDaftar: (reg.tanggalDaftar || '-').trim().slice(0, 100),
    namaSekolah: (reg.namaSekolah || '-').trim().slice(0, 200),
    namaKepalaSekolah: (reg.namaKepalaSekolah || '-').trim().slice(0, 200),
    nipKepalaSekolah: (reg.nipKepalaSekolah || '-').trim().slice(0, 64),
    namaPembinaPutra: (reg.namaPembinaPutra || '-').trim().slice(0, 200),
    nipPembinaPutra: (reg.nipPembinaPutra || '-').trim().slice(0, 64),
    namaPembinaPutra2: (reg.namaPembinaPutra2 || '').trim().slice(0, 200),
    nipPembinaPutra2: (reg.nipPembinaPutra2 || '').trim().slice(0, 64),
    namaPembinaPutri: (reg.namaPembinaPutri || '-').trim().slice(0, 200),
    nipPembinaPutri: (reg.nipPembinaPutri || '-').trim().slice(0, 64),
    namaPembinaPutri2: (reg.namaPembinaPutri2 || '').trim().slice(0, 200),
    nipPembinaPutri2: (reg.nipPembinaPutri2 || '').trim().slice(0, 64),
    namaReguPutra: (reg.namaReguPutra || '').trim().slice(0, 120),
    namaReguPutri: (reg.namaReguPutri || '').trim().slice(0, 120),
    pesertaPutra: normalizeArray8(reg.pesertaPutra, 160),
    tempatLahirPutra: normalizeArray8(reg.tempatLahirPutra, 120),
    tanggalLahirPutra: normalizeArray8(reg.tanggalLahirPutra, 32),
    pesertaPutri: normalizeArray8(reg.pesertaPutri, 160),
    tempatLahirPutri: normalizeArray8(reg.tempatLahirPutri, 120),
    tanggalLahirPutri: normalizeArray8(reg.tanggalLahirPutri, 32),
    jumlahRegu: Math.min(Math.max(1, Math.round(reg.jumlahRegu || 2)), 10),
    totalBiaya: Math.min(Math.max(0, Math.round(reg.totalBiaya || 2600000)), 100000000),
    statusVerifikasi:
      reg.statusVerifikasi === 'Terverifikasi' ? 'Terverifikasi' : 'Menunggu Verifikasi',
    pernyataanBenar: true,
    buktiPembayaran: optimizedProof,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(doc(db, REGISTRATIONS_COLLECTION, safeId), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateRegistrationVerificationInFirestore(
  id: string,
  newStatus: 'Menunggu Verifikasi' | 'Terverifikasi'
): Promise<void> {
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  const path = `${REGISTRATIONS_COLLECTION}/${safeId}`;
  try {
    await updateDoc(doc(db, REGISTRATIONS_COLLECTION, safeId), {
      statusVerifikasi: newStatus,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteRegistrationFromFirestore(id: string): Promise<void> {
  const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 128);
  const path = `${REGISTRATIONS_COLLECTION}/${safeId}`;
  try {
    await deleteDoc(doc(db, REGISTRATIONS_COLLECTION, safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToAllRegistrations(
  onData: (registrations: SubmittedRegistration[]) => void
): () => void {
  const q = query(
    collection(db, REGISTRATIONS_COLLECTION),
    where('pernyataanBenar', '==', true),
    limit(500)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const sortedDocs = [...snapshot.docs].sort((a, b) => {
        const aData = a.data();
        const bData = b.data();
        const aTime =
          typeof aData.createdAt?.toMillis === 'function' ? aData.createdAt.toMillis() : Date.now();
        const bTime =
          typeof bData.createdAt?.toMillis === 'function' ? bData.createdAt.toMillis() : Date.now();
        return bTime - aTime;
      });
      const items: SubmittedRegistration[] = sortedDocs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: d.id || docSnap.id,
          nomorRegistrasi: d.nomorRegistrasi || '',
          tanggalDaftar: d.tanggalDaftar || '',
          namaSekolah: d.namaSekolah || '',
          namaKepalaSekolah: d.namaKepalaSekolah || '',
          nipKepalaSekolah: d.nipKepalaSekolah || '',
          namaPembinaPutra: d.namaPembinaPutra || '',
          nipPembinaPutra: d.nipPembinaPutra || '',
          namaPembinaPutra2: d.namaPembinaPutra2 || '',
          nipPembinaPutra2: d.nipPembinaPutra2 || '',
          namaPembinaPutri: d.namaPembinaPutri || '',
          nipPembinaPutri: d.nipPembinaPutri || '',
          namaPembinaPutri2: d.namaPembinaPutri2 || '',
          nipPembinaPutri2: d.nipPembinaPutri2 || '',
          namaReguPutra: d.namaReguPutra || '',
          namaReguPutri: d.namaReguPutri || '',
          pesertaPutra: Array.isArray(d.pesertaPutra) ? d.pesertaPutra : Array(8).fill(''),
          tempatLahirPutra: Array.isArray(d.tempatLahirPutra)
            ? d.tempatLahirPutra
            : Array(8).fill(''),
          tanggalLahirPutra: Array.isArray(d.tanggalLahirPutra)
            ? d.tanggalLahirPutra
            : Array(8).fill(''),
          pesertaPutri: Array.isArray(d.pesertaPutri) ? d.pesertaPutri : Array(8).fill(''),
          tempatLahirPutri: Array.isArray(d.tempatLahirPutri)
            ? d.tempatLahirPutri
            : Array(8).fill(''),
          tanggalLahirPutri: Array.isArray(d.tanggalLahirPutri)
            ? d.tanggalLahirPutri
            : Array(8).fill(''),
          jumlahRegu: typeof d.jumlahRegu === 'number' ? d.jumlahRegu : 2,
          totalBiaya: typeof d.totalBiaya === 'number' ? d.totalBiaya : 2600000,
          statusVerifikasi:
            d.statusVerifikasi === 'Terverifikasi' ? 'Terverifikasi' : 'Menunggu Verifikasi',
          pernyataanBenar: Boolean(d.pernyataanBenar),
          buktiPembayaran: d.buktiPembayaran || null,
        };
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, REGISTRATIONS_COLLECTION);
    }
  );
}
