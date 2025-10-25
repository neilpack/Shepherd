import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6ZBvAd5WE2dQ_iVdfVuF_uYq546B8QgI",
  authDomain: "iminister-map.firebaseapp.com",
  projectId: "iminister-map"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
