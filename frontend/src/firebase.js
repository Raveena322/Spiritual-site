import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDJqO9RaBWzQzxHRSdHHAj823hCS-JCT_4',
  authDomain: 'spiritual-app-99c47.firebaseapp.com',
  projectId: 'spiritual-app-99c47',
  storageBucket: 'spiritual-app-99c47.firebasestorage.app',
  messagingSenderId: '518120577862',
  appId: '1:518120577862:web:463b1f9e4238b81eb26347',
  measurementId: 'G-RE0Y7E6F9Y',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
