const colors = {
  one: "#fef3bd",
  two: "#ffd6a5"
};

const notes = [
  { id: 1, title: "Yard Help", content: "Brother Smith needs help Saturday", color: colors.one, x: 8, y: 2 },
  { id: 2, title: "Meal Train", content: "Sign up to bring dinner", color: colors.two, x: 4, y: 3 }
];


// --------------------------------------------------------------------------------

const board = document.getElementById("board");
notes.forEach(note => {
  const section = document.createElement("section");

  //Info in the sticky note
  section.className = "note";
  section.style.backgroundColor = note.color;
  section.textContent = `${note.title}: ${note.content}`;

  // Position on grid
  section.style.gridColumnStart = note.x;
  section.style.gridRowStart = note.y;

  board.appendChild(section);
});

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

// Add note function
function addNote(title, content) {
  const newId = notes.length ? notes[notes.length - 1].id + 1 : 1;
  const newNote = { id: newId, title, content };
  notes.push(newNote);
  console.log("Added note:", newNote);
}

// Hook up the submit button
submitNoteBtn.addEventListener('click', () => {
  const title = document.getElementById('noteTitle').value;
  const content = document.getElementById('noteContent').value;

  if (!content.trim()) {
    alert("Please write something for your note!");
    return;
  }

  addNote(title, content);

  // Clear input fields
  document.getElementById('noteTitle').value = '';
  document.getElementById('noteContent').value = '';

  modal.style.display = 'none'; // Hide modal
});
