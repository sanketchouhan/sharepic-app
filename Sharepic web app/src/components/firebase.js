import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2erL6u_VfdWn24yhKBAkgSlzu9qivEGs",
  authDomain: "sharepic-app.firebaseapp.com",
  databaseURL: "https://sharepic-app.firebaseio.com",
  projectId: "sharepic-app",
  storageBucket: "sharepic-app.appspot.com",
  messagingSenderId: "859634332379",
  appId: "1:859634332379:web:70abeb2890a8e84023d2fe",
  measurementId: "G-8H8HT429GM"
};


firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
