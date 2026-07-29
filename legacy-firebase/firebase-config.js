import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAW1UAPpvI0dZW5WZXQKvthm1wuWD0PlRE",
  authDomain: "binta-ice-cream-suarl.firebaseapp.com",
  projectId: "binta-ice-cream-suarl",
  storageBucket: "binta-ice-cream-suarl.firebasestorage.app",
  messagingSenderId: "280570372937",
  appId: "1:280570372937:web:acadbf6fd985c5a3ebb098",
  measurementId: "G-4CSE8WB9XR"
};

const app = initializeApp(firebaseConfig);
let analytics = null;

try {
  analytics = getAnalytics(app);
} catch (err) {
  console.warn("Analytics indisponible pour cette page.", err);
}

export { app, analytics, firebaseConfig };
