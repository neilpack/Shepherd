// -------------------------------------------------------------------------------- VARIABLES
const colors = {
  one: "#fef3bd",
  two: "#ffd6a5"
};

const notes = [
  { id: 1, title: "Yard Help", content: "Brother Smith needs help Saturday", color: colors.one, x: 8, y: 2 },
  { id: 2, title: "Meal Train", content: "Sign up to bring dinner", color: colors.two, x: 4, y: 3 }
];

const usedCoords = new Set();

// -------------------------------------------------------------------------------- FIREBASE
import { db } from "./firebase.js";
import { doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Upload array
await setDoc(doc(db, "data", "arrayDoc"), { values: notes });

// Listen for real-time updates
onSnapshot(doc(db, "data", "arrayDoc"), (docSnap) => {
  if (docSnap.exists()) {
    const arr = docSnap.data().values;
    console.log("Array:", arr);
    // your existing logic here
  }
});

async function uploadNotes() {
  await setDoc(doc(db, "data", "arrayData"), {values: notes });
}


// -------------------------------------------------------------------------------- RENDER NOTES
function renderNotes() {
    const board = document.getElementById("board");
    board.innerHTML = ""; // clear existing notes

    if (notes.length === 0) {
        board.classList.add('BONUS');
        } else {
        board.classList.remove('BONUS');
        }
    
    notes.forEach((note, index) => {
        const section = document.createElement("section");

        //Info in the sticky note
        section.className = "note";
        section.style.backgroundColor = note.color;
        section.textContent = `${note.title}: ${note.content}`;

        // Position on grid
        section.style.gridColumnStart = note.x;
        section.style.gridRowStart = note.y;

        //adds clicking ability to each note
        section.addEventListener("click", () => {
            noteToRemoveIndex = index; // save which note
            removeModal.style.display = "flex"; // open modal
        });

        board.appendChild(section);
    });
}


// ------------------------------------------------------------------------------- MODALS

const modal = document.getElementById('myModal');
const openBtn = document.getElementById('openModalBtn');
const closeAddBtn = document.getElementById('closeAddModalBtn');
const submitNoteBtn = document.getElementById('submitNoteBtn');

openBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeAddBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

//if clicked out of content
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// REMOVE NOTE MODAL
const removeModal = document.getElementById('removeModal');
const closeRemoveBtn = document.getElementById('closeRemoveModalBtn');
const removeNoteBtn = document.getElementById('removeNoteBtn');

let noteToRemoveIndex = null;

closeRemoveBtn.addEventListener('click', () => {
  removeModal.style.display = 'none';
});

//if click out of content
window.addEventListener('click', (e) => {
  if (e.target === removeModal) removeModal.style.display = 'none';
});

// Remove note
removeNoteBtn.addEventListener('click', () => {
  if (noteToRemoveIndex !== null) {
    const note = notes[noteToRemoveIndex];
    usedCoords.delete(`${note.x},${note.y}`);
    notes.splice(noteToRemoveIndex, 1);
    noteToRemoveIndex = null;
    removeModal.style.display = 'none'; // hide REMOVE modal
    renderNotes();
  }
});

// --------------------------------------------------------------------------------- ADDING NOTE FUNCTIONS

// Adds note into array
function addNote(title, content, color, x, y) {
  const newId = notes.length ? notes[notes.length - 1].id + 1 : 1;
  const newNote = { id: newId, title, content, color, x, y};
  notes.push(newNote);
  console.log("Added note:", newNote);
  renderNotes();
  uploadNotes();
}

// ensures the coords are unique on the board (prevents weird overlap)
function getUniqueCoords() {
    let x, y, key;
    do {
        x = getRandomInRange(1, 10);
        y = getRandomInRange(1, 3);
        key = `${x},${y}`;
    } while (usedCoords.has(key));

    usedCoords.add(key);
    return { x, y };
}

//click add note button
submitNoteBtn.addEventListener('click', () => {

    // Maximum notes = columns * rows
    const maxNotes = 10 * 3;
    if (notes.length >= maxNotes) {
        alert("Too many notes on the board at once! Please remove a note first.");
        return;
    }

    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;

    if (!content.trim()) {
        alert("Please write something for your note!");
        return;
    }

    const color = getRandomColor();
    const { x, y } = getUniqueCoords();

    addNote(title, content, color, x, y);

    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';

    modal.style.display = 'none'; // Hide modal
});

// ----------------------------------------------------------------------------------------- HELPER FUNCTIONS
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomColor() {
    const colorValues = Object.values(colors);
    const randomIndex = Math.floor(Math.random() * colorValues.length);
    return colorValues[randomIndex];
}
// ----------------------------------------------------------------------------------------- RUN

renderNotes();
