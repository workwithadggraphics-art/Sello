// Sello — shared Firebase setup, imported by index.html, admin.html, and providers.html.
//
// SETUP (one time):
// 1. Go to console.firebase.google.com → create a project (or reuse one).
// 2. Build > Firestore Database > Create database (start in production mode).
// 3. Build > Authentication > Sign-in method > enable "Email/Password" AND "Google".
//    (Email/Password is for you, the admin. Google is for providers signing
//    up on providers.html.)
// 4. Authentication > Users > Add user → this becomes your admin login.
// 5. Authentication > Settings > Authorized domains → Add domain →
//    add your Vercel domain (e.g. sellong.vercel.app), or Google sign-in
//    popups will fail on the live site.
// 6. Project settings (gear icon) > General > Your apps > Add app > Web (</>) 
//    → copy the firebaseConfig object it gives you and paste it below.
// 7. In Firestore > Rules, paste the rules below (with YOUR admin email
//    filled in) and Publish.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZZgfuX2ZsyuXHSlvNgVpmI44eGinvIHg",
  authDomain: "sello-c6671.firebaseapp.com",
  projectId: "sello-c6671",
  storageBucket: "sello-c6671.firebasestorage.app",
  messagingSenderId: "65053299199",
  appId: "1:65053299199:web:0840d0a1318ad7a17217ca"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/*
FIRESTORE SECURITY RULES — paste into Firestore > Rules and Publish.
Replace "admin@sello.app" below with the EXACT email you created under
Authentication > Users — this is how the rules tell "the admin" apart
from "a provider who happens to be signed in with Google".

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null && request.auth.token.email == 'admin@sello.app';
    }

    match /providers/{providerId} {
      allow read: if true;   // anyone can browse the storefront

      // A provider can create their OWN listing, but it must start pending —
      // only the admin can create something already marked approved.
      allow create: if
        (isAdmin() && request.resource.data.status == 'approved') ||
        (request.auth != null
          && request.resource.data.ownerUid == request.auth.uid
          && request.resource.data.status == 'pending');

      // The admin can edit/approve/reject anything. A provider can edit
      // their own listing's details but cannot change its status themselves.
      allow update: if
        isAdmin() ||
        (request.auth != null
          && request.auth.uid == resource.data.ownerUid
          && request.resource.data.status == resource.data.status);

      // The admin can remove anything; a provider can remove their own.
      allow delete: if
        isAdmin() ||
        (request.auth != null && request.auth.uid == resource.data.ownerUid);
    }

    match /reviews/{reviewId} {
      allow read: if true;                 // anyone can see reviews
      allow create: if
        request.resource.data.keys().hasAll(['providerId','name','text','stars','createdAt'])
        && request.resource.data.stars is int
        && request.resource.data.stars >= 1
        && request.resource.data.stars <= 5
        && request.resource.data.text is string
        && request.resource.data.text.size() < 1000;  // customers can post a review
      allow update, delete: if isAdmin();  // admin can moderate
    }
  }
}
*/
