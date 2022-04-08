const elem = document.getElementById('plane');
const canvas = document.getElementById("canvasMain");
const ctx = canvas.getContext("2d");

let isFirst = true, minLen, timer, curMin, counter = 0;
let n = 0;
const ALPHA = 1, BETA = 1, EVAPORATION = 0.64;
let distance = [], pheromones = [], p = [], path = [];

function time(){
    if(n > 0) {
        timer = setInterval(antALgo, 500);
    }
}

function createVertex(parent, x, y) {
    if(isFirst) {
        const vertex = document.createElement('div');
        vertex.classList.add('round')
        vertex.textContent = n.toString();
        vertex.id = n++;
        vertex.style.top = y + "px";
        vertex.style.left = x + "px";
        parent.appendChild(vertex);
    }
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
function pathLength(antPath) {
    let pathLen = 0;
        for (let i = 0; i < antPath.length - 1; i++) {
            pathLen += distance[antPath[i]][antPath[i + 1]];
        }
        return pathLen;
}

function pheromonesInitial() {
    for (let i = 0; i < n ; i++) {
        pheromones[i]=[];
        for (let j=0; j<n; j++) {
            pheromones[i][j] = 0.02;
        }
    }
}

function updatePheromones() {
    for(let i = 0; i < n; i++){
        for(let j = i + 1; j < n; j++){
            pheromones[i][j] *= EVAPORATION;
            pheromones[j][i] = pheromones[i][j];
        }
    }
}

//выбираем вершину, в которую пойдет муравей
function vertexSelection() {
    let sum = 0, x = 0, y = 0;
    let unpavedVertices = [];
    for (let i = 0; i < n; i++) {
        if (path.includes(i) === false) {
            unpavedVertices.push(i);
        }
    }
        for (let i = 0; i < unpavedVertices.length; i++) {
            x = Math.pow(pheromones[path[path.length - 1]][unpavedVertices[i]], ALPHA);
            y = Math.pow(1 / (distance[path[path.length - 1]][unpavedVertices[i]]), BETA);
            sum += x * y;
        }
        for (let i = 0; i < n; i++) {
            p[i] = [];
        }

        for (let i = 0; i < unpavedVertices.length; i++) {
            let vertex = unpavedVertices[i];
            x = Math.pow(pheromones[path[path.length - 1]][vertex], ALPHA);
            y = Math.pow(1 / (distance[path[path.length - 1]][vertex]), BETA);
            if (vertex !== unpavedVertices[0]) {
                p[path[path.length - 1]][vertex] = (x * y) / sum + p[path[path.length - 1]][unpavedVertices[i - 1]];
            } else {
                if (path[path.length - 1] !== undefined)
                    p[path[path.length - 1]][vertex] = (x * y) / sum;
            }
        }
        let rand = Math.random();
        for (let i = 0; i < unpavedVertices.length; i++) {
            if (rand <= p[path[path.length - 1]][unpavedVertices[i]]) {
                pheromones[path[path.length - 1]][unpavedVertices[i]] += 1 / distance[path[path.length - 1]][unpavedVertices[i]];
                pheromones[unpavedVertices[i]][path[path.length - 1]] = pheromones[path[path.length - 1]][unpavedVertices[i]];
                return unpavedVertices[i];
            }
        }
}

function oneAntCycle() {
    curMin = minLen;
    for (let k = 0; k < n; k++) {
        path.push(k);
        while (path.length < n) {
            path.push(vertexSelection());
        }
        path[path.length] = path[0];
        let curLen = pathLength(path);
        if (curLen < minLen || minLen === undefined) {
            counter = 0;
            minLen = curLen;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pathOutput(path);
        }
        counter++;
        if (counter === n * n) {
            document.getElementById("bestCurPath").textContent += " - best of the best";
            clearTimeout(timer);
            return;
        }
        path = [];
    }
}

function pathOutput(antPath) {
    ctx.beginPath();
    for (let i = 0; i < antPath.length - 1; i++) {
        let from = document.getElementById(antPath[i]);
        let to = document.getElementById(antPath[i + 1]);
        ctx.moveTo(to.offsetLeft - 50, to.offsetTop - 50);
        ctx.lineTo(from.offsetLeft - 50, from.offsetTop - 50);
        ctx.stroke();
    }
    document.getElementById("bestCurPath").textContent = antPath;
    document.getElementById("pathLen").textContent = pathLength(antPath).toString();
}

function antALgo() {
    if (isFirst) {
        distanceInitial();
        pheromonesInitial();
        isFirst = false;
    }
    else {
        while(counter < n * n && (curMin === undefined || curMin === minLen)) {
            updatePheromones();
            oneAntCycle();
        }
        curMin = undefined;
    }
}

function clearPaths() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearAll() {
    document.getElementById("bestCurPath").textContent = "_";
    document.getElementById("pathLen").textContent = "_";
    clearPaths();
    clearTimeout(timer);
    for (let i=0; i<n; i++) {
        document.getElementById(i.toString()).remove();
    }
    curMin = undefined;
    minLen = undefined;
    n = 0;
    counter = 0;
    distance = [];
    pheromones = [];
    p = [];
    path = [];
    isFirst = true;
    console.clear()
}