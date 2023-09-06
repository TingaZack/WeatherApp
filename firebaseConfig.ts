import {initializeApp} from 'firebase/app';
import {getStorage} from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';
import {getDatabase, ref, onValue, off} from 'firebase/database';
import {getAuth} from 'firebase/auth';
import {getAnalytics} from 'firebase/analytics';
// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBfcHaz9Bkc4N8cZrzxTCnwpy9ZjTOY3uU',
  authDomain: 'testpro-8f08c.firebaseapp.com',
  databaseURL: 'https://testpro-8f08c.firebaseio.com',
  projectId: 'testpro-8f08c',
  storageBucket: 'testpro-8f08c.appspot.com',
  messagingSenderId: '253140486405',
  appId: '1:253140486405:web:520f36f96f9297267c4f6c',
  measurementId: 'G-W48S6SMZQW',
};
// Firebase storage reference
// const storage = getStorage(firebaseConfig);
// export default storage;
// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
const analytics = getAnalytics(FIREBASE_APP);
export const REALTIME_DB = getDatabase();
export const STORAGE = getStorage(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIRESTORE_AUTH = getAuth(FIREBASE_APP);
