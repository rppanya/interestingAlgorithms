const elem = document.getElementById('plane');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let n = 0;
const ALPHA = 2, BETA = 2;
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
        result += cityDistance[i][i+1];
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
    console.log(path);
    for (let i = 0; i < n; i++) {
        if (path.includes(i) === false) {
            unpavedVertices.push(i);
        }
    }
    console.log(unpavedVertices);
    for (let i = 0; i < unpavedVertices.length; i++) {
        x = Math.pow(pheromones[path[path.length - 1]][unpavedVertices[i]], ALPHA);
        y = Math.pow(1/(distance[path[path.length - 1]][unpavedVertices[i]]), BETA);
        sum += x*y;
    }
    for(let i = 0; i < n; i++){
        p[i] = [];
    }
    for(let i = 0; i < unpavedVertices.length; i++){
        let vertex = unpavedVertices[i];
        x = Math.pow(pheromones[path[path.length - 1]][vertex],ALPHA);
        y = Math.pow(1/(distance[path[path.length - 1]][vertex]),BETA);
        if (vertex !== unpavedVertices[0]) {
            p[path[path.length - 1]][vertex] = (x * y) / sum + p[path[path.length - 1]][unpavedVertices[i - 1]];
        }
        else {
            p[path[path.length - 1]][vertex] = (x * y) / sum;
        }
    }
    let rand = Math.random();
    for(let i = 0; i < unpavedVertices.length; i++){
        if (rand <= p[path[path.length - 1]][unpavedVertices[i]]) {
            return unpavedVertices[i];
        }
    }
}

function updatePath() {
    path.push(Math.round(Math.random()*(n - 1)));
    while (path.length < n) {
        path.push(vertexSelection());
    }
    return path;
}

function mainButton(){
    distanceInitial();
    pheromonesInitial();
    console.log(distance);
    console.log(pheromones);
    console.log(n);
    console.log("PATH")
    console.log(updatePath());
}