import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAt83pxqXHDni2QUy4XYmRyhemkxonQ2wA",
  authDomain: "worshiptoolmusic.firebaseapp.com",
  projectId: "worshiptoolmusic",
  storageBucket: "worshiptoolmusic.firebasestorage.app",
  messagingSenderId: "374930765958",
  appId: "1:374930765958:web:e25bce74d3172c55867907"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export function subscribeCollection(colName, callback, onError) {
  return onSnapshot(
    collection(db, colName),
    (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(docs);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

export function subscribeDoc(colName, docId, callback, onError) {
  return onSnapshot(
    doc(db, colName, docId),
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data());
      } else {
        callback(null);
      }
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

export async function fbAdd(col, data) {
  const ref = await addDoc(collection(db, col), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function fbUpdate(col, id, data) {
  await updateDoc(doc(db, col, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function fbDelete(col, id) {
  await deleteDoc(doc(db, col, id));
}

export async function fbSetDoc(col, id, data) {
  await setDoc(doc(db, col, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
