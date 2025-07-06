// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBF024N2VB7ZVNX8ZGZNSzEzpD2tr9JE8g",
  authDomain: "upground-87278.firebaseapp.com",
  projectId: "upground-87278",
  storageBucket: "yupground-87278.appspot.com",
  messagingSenderId: "67609038503",
  appId: "1:67609038503:web:1e39ff71effa4f6ea7d582"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
