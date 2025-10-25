const colors = {
  one: "#fef3bd",
  two: "#ffd6a5"
};

const notes = [
  { id: 1, title: "Yard Help", content: "Brother Smith needs help Saturday", color: colors[0], x: 1, y: 2 },
  { id: 2, title: "Meal Train", content: "Sign up to bring dinner", color: colors[1], x: 2, y: 3 }
];



const board = document.getElementById("board");
notes.forEach(note => {
  const section = document.createElement("section");
  section.className = "note";
  section.style.backgroundColor = note.color;
  section.textContent = `${note.title}: ${note.content}`;
  board.appendChild(section);
});