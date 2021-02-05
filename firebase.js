import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBkAjMWBMtXu6q3cjkcyqEWrYeD44Hk_Uk',
  authDomain: 'social-app-f3bf0.firebaseapp.com',
  projectId: 'social-app-f3bf0',
  storageBucket: 'social-app-f3bf0.appspot.com',
  messagingSenderId: '140041550038',
  appId: '1:140041550038:web:4c082cb17f12e009cbb177',
};

let app;
//sPola til 1.08 i videion,just inalize fire base onec more cleaner cod
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app;
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
