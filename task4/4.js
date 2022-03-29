const elem = document.getElementById('plane');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let n = 0;
const ALPHA = 1, BETA = 1;
let distance = [], pheromones = [], p = [], path = [];

function createVertex(parent, x, y) {
    const vertex = document.createElement('div');
    vertex.classList.add('round')
    vertex.textContent = n.toString();
    vertex.id = n++;
    vertex.style.top = y + "px";
    vertex.style.left = x + "px";
    parent.appendChild(vertex);
}

//расстояния между вершинами графа
function distanceInitial() {
    for (let i = 0; i < n ; i++) {
        distance[i]=[];
        for (let j=0; j<n; j++) {
            const idI = document.getElementById(i.toString());
            const idJ = document.getElementById(j.toString());
            distance[i][j]=parseInt(Math.sqrt(Math.pow(Math.abs(idJ.offsetTop-idI.offsetTop),2)+Math.pow(Math.abs(idJ.offsetLeft-idI.offsetLeft),2)));
        }
    }
}

//длина пути
function pathLength() {
    let result = 0;
    for (let i = 0; i < n - 1; i++) {
        // result += cityDistance[i][i+1];
    }
    return result;
}

//феромоны
function pheromonesInitial() {
    for (let i = 0; i < n ; i++) {
        pheromones[i]=[];
        for (let j=0; j<n; j++) {
            pheromones[i][j] = 0.02;
        }
    }
}

//обновление феромонов
function updatePheromones() {

}

//выбираем вершину, в которую пойдет муравей
function vertexSelection() {
    let sum = 0, x = 0, y = 0;
    let unpavedVertices = [];
    for (let i = 0; i < n; i++) {
        if (!(i in path)) {
            unpavedVertices = unpavedVertices.push(i);
        }
    }
    unpavedVertices.forEach(function(vertex) {
        x = Math.pow(pheromones[path[-1]][vertex],ALPHA);
        y = Math.pow(1/(distance[path[-1][vertex]]),BETA);
        sum += x*y;
    });
    unpavedVertices.forEach(function(vertex) {
        x = Math.pow(pheromones[path[-1]][vertex],ALPHA);
        y = Math.pow(1/(distance[path[-1][vertex]]),BETA);
        if (vertex !== 0) {
            p[-1][vertex] = (x * y) / sum + p[-1][vertex - 1];
        }
        else {
            p[-1][vertex] = (x * y) / sum;
        }
    });
    let rand = Math.random();
    unpavedVertices.forEach(function(vertex) {
        if (rand < p[-1][vertex]) {
            return vertex;
        }
    });
}

function updatePath() {
    path = path.push(Math.floor(Math.random()*(n-1)));
    while (path.length < n) {
        path = path.push(vertexSelection());
    }
    return path;
}

function antColony() {

}

