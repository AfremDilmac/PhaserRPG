/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */
 import { initializeApp } from "firebase/app";
const config = {
  apiKey: "AIzaSyCVpqAdI0IuCwCQMB7s8CWr_YvNNXkg1xE",
  authDomain: "friendlychat-f967b.firebaseapp.com",
  projectId: "friendlychat-f967b",
  storageBucket: "friendlychat-f967b.appspot.com",
  messagingSenderId: "801773284429",
  appId: "1:801773284429:web:fbfe4d03b27af9aa140004"
};
// Initialize Firebase
const app = initializeApp(config);
export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}
