// signup.js
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { app } from "./firebase.js";

const auth = getAuth(app);

const form = document.getElementById("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm-password");

const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const confirmError = document.getElementById("confirm-error");
const firebaseError = document.getElementById("firebase-error");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Reset errors
  document.querySelectorAll(".error").forEach(e => e.style.display = "none");

  let valid = true;

  // Local validation
  if (!emailInput.value.trim()) {
    emailError.style.display = "block";
    valid = false;
  }

  if (!passwordInput.value.trim()) {
    passwordError.style.display = "block";
    valid = false;
  }

  if (confirmInput.value !== passwordInput.value) {
    confirmError.style.display = "block";
    valid = false;
  }

  if (!valid) return;

  // ✅ Create account with Firebase
  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then(() => {
      alert("Account created successfully!");
      window.location.href = "board.html"; // redirect after successful signup
    })
    .catch((error) => {
      firebaseError.textContent = error.message;
      firebaseError.style.display = "block";
    });
});
