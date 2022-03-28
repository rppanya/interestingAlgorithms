const elem = document.getElementById('plane');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ALPHA = 2, BETA = 2;
let n = 0;
let cityDistance = [];

function createVertex(parent, x, y) {
    const vertex = document.createElement('div');
    vertex.classList.add('round')
    vertex.textContent = n.toString();
    vertex.id = n++;
    vertex.style.top = y + "px";
    vertex.style.left = x + "px";
    parent.appendChild(vertex);
}

function cityDistanceInitial() {
    for (let i=0; i<n; i++) {
        cityDistance[i]=[];
        for (let j=0; j<n; j++) {
            const idI = document.getElementById(i);
            const idJ = document.getElementById(j);
            cityDistance[i][j]=parseInt(Math.sqrt(Math.pow(Math.abs(idJ.offsetTop-idI.offsetTop),2)+Math.pow(Math.abs(idJ.offsetLeft-idI.offsetLeft),2)));
        }
    }
    console.log(cityDistance);
}
