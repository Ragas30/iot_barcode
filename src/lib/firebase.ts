import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { DatabaseError } from "@/src/lib/errors";

function createFirebaseApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  try {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (error) {
    const detail =
      error instanceof Error && error.message
        ? ` Detail: ${error.message}`
        : "";
    throw new DatabaseError(`Konfigurasi Firebase tidak valid.${detail}`);
  }
}

export function getDb() {
  const app = createFirebaseApp();

  if (!app) {
    return null;
  }

  try {
    return getFirestore(app);
  } catch (error) {
    const detail =
      error instanceof Error && error.message
        ? ` Detail: ${error.message}`
        : "";
    throw new DatabaseError(`Gagal menginisialisasi Firestore.${detail}`);
  }
}
