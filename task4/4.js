const elem = document.getElementById('plane');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let n = 0;

function createVertex(parent, x, y) {
    const vertex = document.createElement('canvas');
    vertex.classList.add('round');
    vertex.id = n++;
    vertex.style.top = y + "px";
    vertex.style.left = x + "px";
    parent.appendChild(vertex);
}
