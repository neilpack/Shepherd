const colors = {
  one: "#fef3bd",
  two: "#ffd6a5"
};

const notes = [
  { id: 1, title: "Yard Help", content: "Brother Smith needs help Saturday", color: colors.one, x: 8, y: 2 },
  { id: 2, title: "Meal Train", content: "Sign up to bring dinner", color: colors.two, x: 4, y: 3 }
];

const usedCoords = new Set();

// --------------------------------------------------------------------------------
function renderNotes() {
    const board = document.getElementById("board");
    board.innerHTML = ""; // clear existing notes
    
    notes.forEach(note => {
    const section = document.createElement("section");

    //Info in the sticky note
    section.className = "note";
    section.style.backgroundColor = note.color;
    section.textContent = `${note.title}: ${note.content}`;

    // Position on grid
    section.style.gridColumnStart = note.x;
    section.style.gridRowStart = note.y;

    // adds the click to remove
    section.addEventListener("click", () => {
      const confirmDelete = confirm("Remove sticky note?");
      if (confirmDelete) {
        notes.splice(index, 1); // Remove from notes array
        usedCoords.delete(`${note.x},${note.y}`); // Remove coordinates from usedCoords
        renderNotes();
        console.log(notes);
      }
    });

    board.appendChild(section);
});
}

// -------------------------------------------------------------------------------

const modal = document.getElementById('myModal');
const openBtn = document.getElementById('openModalBtn');
const closeBtn = document.getElementById('closeModalBtn');
const submitNoteBtn = document.getElementById('submitNoteBtn');

openBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal if click outside content
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// ---------------------------------------------------------------------------------

// Adds note into array
function addNote(title, content, color, x, y) {
  const newId = notes.length ? notes[notes.length - 1].id + 1 : 1;
  const newNote = { id: newId, title, content, color, x, y};
  notes.push(newNote);
  console.log("Added note:", newNote);
  renderNotes();
}

// ensures the coords are unique on the board (prevents weird overlap)
function getUniqueCoords() {
    let x, y, key;
    do {
        x = getRandomInRange(1, 12);
        y = getRandomInRange(1, 4);
        key = `${x},${y}`;
    } while (usedCoords.has(key));

    usedCoords.add(key);
    //usedCoords.delete(`${note.x},${note.y}`) this will be used to delete thiss
    return { x, y };
}

//click add note button
submitNoteBtn.addEventListener('click', () => {

    // Maximum notes = columns * rows
    const maxNotes = 12 * 4;
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

// -----------------------------------------------------------------------------------------
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomColor() {
    const colorValues = Object.values(colors);
    const randomIndex = Math.floor(Math.random() * colorValues.length);
    return colorValues[randomIndex];
}

// -----------------------------------------------------------------------------------------

renderNotes();