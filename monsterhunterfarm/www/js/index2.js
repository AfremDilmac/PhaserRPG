/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 'use strict';

 import { initializeApp } from 'firebase/app';
 import {
   getAuth,
   onAuthStateChanged,
   GoogleAuthProvider,
   signInWithRedirect,
   signOut,
 } from 'firebase/auth';
 import { getPerformance } from 'firebase/performance';
 
 import {config, getFirebaseConfig} from './firebase-config.js';
 
 document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
 // Signs-in Friendly Chat.
 async function signIn() {
   // Sign in Firebase using popup auth and Google as the identity provider.
   var provider = new GoogleAuthProvider();
   await signInWithRedirect(getAuth(), provider);
 }
 
 // Signs-out of Friendly Chat.
 function signOutUser() {
   // TODO 2: Sign out of Firebase.
	// Sign out of Firebase.
	signOut(getAuth());
 }
 
 // Initiate firebase auth
 function initFirebaseAuth() {
   // TODO 3: Subscribe to the user's signed-in status
	// Listen to auth state changes.
	onAuthStateChanged(getAuth(), authStateObserver);
 }
 
 // Returns the signed-in user's profile Pic URL.
 function getProfilePicUrl() {
   // TODO 4: Return the user's profile pic URL.
   return getAuth().currentUser.photoURL || '/images/profile_placeholder.png';
 }
 
 // Returns the signed-in user's display name.
 function getUserName() {
   // TODO 5: Return the user's display name.
   return getAuth().currentUser.displayName;
 }
 
 // Returns true if a user is signed-in.
 function isUserSignedIn() {
   // TODO 6: Return true if a user is signed-in.
   return !!getAuth().currentUser;
 }

 
 // Triggers when the auth state change for instance when the user signs-in or signs-out.
 function authStateObserver(user) {
   if (user) {
	 // User is signed in!
	 // Get the signed-in user's profile pic and name.
	 var profilePicUrl = getProfilePicUrl();
	 var userName = getUserName();
 
	 // Set the user's profile pic and name.
	 userPicElement.style.backgroundImage =
	   'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
	 userNameElement.textContent = userName;
 
	 // Show user's profile and sign-out button.
	 userNameElement.removeAttribute('hidden');
	 userPicElement.removeAttribute('hidden');
	 signOutButtonElement.removeAttribute('hidden');
 
	 // Hide sign-in button.
	 signInButtonElement.setAttribute('hidden', 'true');
	 document.location.href = 'game.html'
 
	 // We save the Firebase Messaging Device token and enable notifications.
	 saveMessagingDeviceToken();
   } else {
	 // User is signed out!
	 // Hide user's profile and sign-out button.
	 userNameElement.setAttribute('hidden', 'true');
	 userPicElement.setAttribute('hidden', 'true');
	 signOutButtonElement.setAttribute('hidden', 'true');
 
	 // Show sign-in button.
	 signInButtonElement.removeAttribute('hidden');
   }
 }
 
 
 // Adds a size to Google Profile pics URLs.
 function addSizeToGoogleProfilePic(url) {
   if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
	 return url + '?sz=150';
   }
   return url;
 }


 
 // Shortcuts to DOM Elements.

 var userPicElement = document.getElementById('user-pic');
 var userNameElement = document.getElementById('user-name');
 var signInButtonElement = document.getElementById('sign-in');
 var signOutButtonElement = document.getElementById('sign-out');
 
 // Saves message on form submit.
 signOutButtonElement.addEventListener('click', signOutUser);
 signInButtonElement.addEventListener('click', signIn);

 
 const firebaseAppConfig = getFirebaseConfig();
 // TODO 0: Initialize Firebase
 initializeApp(firebaseAppConfig);
 // TODO 12: Initialize Firebase Performance Monitoring
 getPerformance();
 initFirebaseAuth();
}