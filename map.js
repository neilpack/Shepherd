import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6ZBvAd5WE2dQ_iVdfVuF_uYq546B8QgI",
  authDomain: "iminister-map.firebaseapp.com",
  projectId: "iminister-map",
  storageBucket: "iminister-map.firebasestorage.app",
  messagingSenderId: "986772471255",
  appId: "1:986772471255:web:a3e3d5ec49f61a27815f92",
  measurementId: "G-TXWMLGM1G7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let map, geocoder;
let addPinMode = false;
let tempLatLng = null;
let markerPreview = null;

const addPinBtn = document.getElementById("addPinBtn");
const messageDiv = document.getElementById("message");
const pinModal = document.getElementById("pinModal");
const pinForm = document.getElementById("pinForm");

// Map initialization
window.initMap = async function() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 43.816, lng: -111.784 }
  });

  geocoder = new google.maps.Geocoder();

  // Load pins from Firestore
  try {
    const snapshot = await getDocs(collection(db, "pins"));
    snapshot.forEach(doc => addMarker(doc.data()));
  } catch (err) {
    console.error(err);
    showMessage("Error loading pins", 3000);
  }

  addPinBtn.addEventListener("click", () => {
    addPinMode = true;
    pinModal.style.display = "flex";
    showMessage("Click map or enter address to add pin", 3000);
  });

  map.addListener("click", event => {
    if (!addPinMode) return;
    tempLatLng = event.latLng;
    previewPin();
  });

  pinForm.addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("pinName").value;
    const needed = document.getElementById("pinNeeded").value;
    const date = document.getElementById("pinDate").value;
    const time = document.getElementById("pinTime").value;
    const address = document.getElementById("pinAddress").value;

    if (address && !tempLatLng) await geocodeAddress(address);
    if (!name || !tempLatLng) return alert("Enter a valid location.");

    const newPin = {
      name,
      needed,
      date,
      time,
      lat: tempLatLng.lat(),
      lng: tempLatLng.lng()
    };

    try {
      await addDoc(collection(db, "pins"), newPin);
      addMarker(newPin);
      showMessage("Pin added!", 2000);
    } catch (err) {
      console.error(err);
      showMessage("Error adding pin", 2500);
    }
    resetPin();
  });

  pinModal.addEventListener("click", e => {
    if (e.target === pinModal) resetPin();
  });
};

function showMessage(text, duration = 2000) {
  messageDiv.textContent = text;
  messageDiv.style.opacity = 1;
  setTimeout(() => messageDiv.style.opacity = 0, duration);
}

async function geocodeAddress(address) {
  return new Promise(resolve => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        tempLatLng = results[0].geometry.location;
        map.setCenter(tempLatLng);
        previewPin();
        resolve(tempLatLng);
      } else {
        showMessage("Address not found", 2500);
        resolve(null);
      }
    });
  });
}

function addMarker(pin) {
  const marker = new google.maps.Marker({
    position: { lat: pin.lat, lng: pin.lng },
    map,
    title: pin.name,
    icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `<div>
      <strong>${pin.name}</strong><br>
      Needed: ${pin.needed}<br>
      Date: ${pin.date}<br>
      Time: ${pin.time}
    </div>`
  });

  marker.addListener("click", () => infoWindow.open(map, marker));
}

function previewPin() {
  if (markerPreview) markerPreview.setMap(null);
  markerPreview = new google.maps.Marker({
    position: tempLatLng,
    map,
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
  });
}

function resetPin() {
  addPinMode = false;
  pinModal.style.display = "none";
  pinForm.reset();
  tempLatLng = null;
  if (markerPreview) markerPreview.setMap(null);
}
