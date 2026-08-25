// Sello — shared Firebase setup, imported by both index.html and admin.html.
//
// SETUP (one time):
// 1. Go to console.firebase.google.com → create a project (or reuse one).
// 2. Build > Firestore Database > Create database (start in production mode).
// 3. Build > Authentication > Sign-in method > enable "Email/Password".
// 4. Authentication > Users > Add user → this becomes your admin login
//    (this is what admin.html signs in with — there is no public sign-up).
// 5. Project settings (gear icon) > General > Your apps > Add app > Web (</>) 
//    → copy the firebaseConfig object it gives you and paste it below.
// 6. In Firestore > Rules, paste the rules from firestore.rules.txt (see notes
//    at the bottom of this file) and Publish.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

/*
FIRESTORE SECURITY RULES — paste into Firestore > Rules and Publish:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /providers/{providerId} {
      allow read: if true;                 // anyone can browse the storefront
      allow create, update, delete: if request.auth != null;  // admin only
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
      allow update, delete: if request.auth != null;  // admin can moderate
    }
  }
}
*/
