// login.js
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { app } from "./firebase.js"; // assuming firebase.js exports your app

const form = document.getElementById("form");
const errorMsg = document.getElementById("error-message");

const auth = getAuth(app);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    errorMsg.textContent = "Please enter both email and password.";
    errorMsg.style.color = "red";
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful!");
      window.location.href = "board.html"; // your protected page
    })
    .catch((error) => {
      errorMsg.textContent = error.message;
      errorMsg.style.color = "red";
    });
});
