const elem = document.getElementById('table');
function createTable(parent, n) {

    let fc = parent.firstChild;
    while(fc) {
        parent.removeChild(fc);
        fc = parent.firstChild;
    }
    let counter=0;
    const table = document.createElement('table');
    for (let i=0; i<n; i++) {
        const tr = document.createElement('tr')
        for (let j=0; j<n; j++) {
            const td = document.createElement('td')
            td.id = counter.toString();
            counter++;
            table.appendChild(td);
            td.addEventListener("click",function(){
                barriers(td);
            });
        }
        table.appendChild(tr);

    }
    parent.appendChild(table);
    document.getElementById('startX').max=Math.sqrt(counter)
    document.getElementById('startY').max=Math.sqrt(counter)
    document.getElementById('finishX').max=Math.sqrt(counter)
    document.getElementById('finishY').max=Math.sqrt(counter)

}

function barriers(td) {

    if (td.style.backgroundColor === "black") {
        td.style.backgroundColor = "";
    }
    else {
        td.style.backgroundColor = "black";
    }
}

let start, finish, finishX, finishY, startX, startY;
function startPoint(x, y) {
    clearMap("path")
    let all=document.querySelectorAll('td');
    if (x!=="" && y!=="" && x<=Math.sqrt(all.length) && y<=Math.sqrt(all.length)) {
        for (let i=0; i<all.length; i++) {
            if (all[i].style.backgroundColor==="green") {
                all[i].style.backgroundColor="";
            }
            if (all[i].style.backgroundColor==="darkgreen") {
                all[i].style.backgroundColor="black"
            }
        }
        let p = document.getElementById(((y-1)+(x-1)*Math.sqrt(all.length)).toString());
        if (p.style.backgroundColor==="black") {
            p.style.backgroundColor="darkgreen";
        }
        else {
            p.style.backgroundColor="green";
        }
        start=(y-1)+(x-1)*Math.sqrt(all.length);
        startX=x; startY=y;
    }
}
function finishPoint(x, y) {
    clearMap("path")
    let all=document.querySelectorAll('td');
    if (x!=="" && y!=="" && x>0 && y>0 && x<=Math.sqrt(all.length) && y<=Math.sqrt(all.length)) {
        for (let i = 0; i < all.length; i++) {
            if (all[i].style.backgroundColor === "red") {
                all[i].style.backgroundColor = "";
            }
            if (all[i].style.backgroundColor === "darkred") {
                all[i].style.backgroundColor = "black";
            }
        }
        let p = document.getElementById(((y - 1) + (x - 1) * Math.sqrt(all.length)).toString());
        if (p.style.backgroundColor==="black") {
            p.style.backgroundColor="darkred"
        }
        else {
            p.style.backgroundColor = "red";
        }
        finish = (y - 1) + (x - 1) * Math.sqrt(all.length);
        finishX = x - 1;
        finishY = y - 1;
    }
}

function createMatrix() {
    let all=document.querySelectorAll('td');
    let matrix = new Array(Math.sqrt(all.length));
    for (let i=0; i<matrix.length; i++) {
        matrix[i]=new Array(Math.sqrt(all.length));
    }
    for (let x=0; x<Math.sqrt(all.length); x++) {
        for (let y = 0; y<Math.sqrt(all.length); y++) {
            let p = document.getElementById(((y) + (x)*Math.sqrt(all.length)).toString());
            if (p.style.backgroundColor !== "black") {
                matrix[x][y] = 1;
            } else {
                matrix[x][y] = 0;
            }
        }
    }
    return matrix;
}

function adjMatrix(matrix) {
    let adjMatrix = new Array(matrix.length*matrix.length);
    for (let i=0; i<adjMatrix.length; i++) {
        adjMatrix[i]=new Array(matrix.length*matrix.length);
    }
    for (let i=0; i<adjMatrix.length; i++) {
        for (let j=0; j<adjMatrix.length; j++) {
            adjMatrix[i][j]=0
        }
    }

    for (let i=0; i<matrix.length; i++) {
        for (let j=0; j<matrix.length; j++) {
            if (matrix[i][j]===1) {
                if (j<matrix.length-1 && matrix[i][j+1]===1) {
                    adjMatrix[i*matrix.length+j][i*matrix.length+j+1]=1;
                    adjMatrix[i*matrix.length+j+1][i*matrix.length+j]=1
                }
                if (i<matrix.length-1 && matrix[i+1][j]===1) {
                    adjMatrix[i*matrix.length+j][(i+1)*matrix.length+j]=1;
                    adjMatrix[(i+1)*matrix.length+j][i*matrix.length+j]=1;
                }
                if (i>1 && matrix[i-1][j]===1) {
                    adjMatrix[i*matrix.length+j][(i-1)*matrix.length+j]=1;
                    adjMatrix[(i-1)*matrix.length+j][i*matrix.length+j]=1;
                }
                if (j>1 && matrix[i][j-1]===1) {
                    adjMatrix[(i)*matrix.length+j][i*matrix.length+j-1]=1;
                    adjMatrix[(i)*matrix.length+j-1][(i)*matrix.length+j]=1;
                }
            }
        }
    }
    return adjMatrix;
}

function heuristic (map, start) {
    let sq = Math.sqrt(map.length);
    let start_X, start_Y;
    let numberMatrix = new Array(sq);
    for (let i=0; i<sq; i++) {
        numberMatrix[i]=new Array(sq);
    }
    for (let i=0; i<numberMatrix.length; i++) {
        for (let j=0; j<numberMatrix.length; j++) {
            numberMatrix[i][j]=i*numberMatrix.length+j
            if (numberMatrix[i][j] === start) {
                start_X = i;
                start_Y = j;
                break;
            }
        }
    } //можно получить координаты элемента по id, без numberMatrix как-то
    return Math.abs(Math.pow((start_X - finishX),2)+ Math.pow((start_Y - finishY), 2));
}

const pathOutput = (previous, finish) => {
    if (previous[finish] !== undefined) {
        let cur = document.getElementById(previous[finish])
        if (cur.style.backgroundColor !== "green" && cur.style.backgroundColor !== "darkgreen" && cur.style.backgroundColor !== "red" && cur.style.backgroundColor !== "darkred") {
            cur.style.backgroundColor = "blue";
        }
        pathOutput(previous, previous[finish])
    }
};

function clearMap(condition) {
    document.getElementById("noPath").textContent = "";
    let all=document.querySelectorAll("td");
    if (condition==="all"){
        for (let i=0; i<all.length; i++) {
            all[i].style.backgroundColor="";
        }
        start = 0; finish = 0;
        document.getElementById("startX").value="";
        document.getElementById("startY").value="";
        document.getElementById("finishX").value="";
        document.getElementById("finishY").value="";
    } else if (condition==="path") {
        for (let i=0; i<all.length; i++) {
            if (all[i].style.backgroundColor==="blue") {
                all[i].style.backgroundColor="";
            }
        }
    } else if (condition ==="barriers") {
        for (let i=0; i<all.length; i++) {
            if (all[i].style.backgroundColor==="black") {
                all[i].style.backgroundColor="";
            }
        }
    }
}


function aStar() {
    clearMap("path");
    document.getElementById("noPath").textContent = "";
    let map=adjMatrix(createMatrix())

    let queue = [], visited = [], previous = [], fromStart = [];

    for (let i=0; i<map.length; i++) {
        fromStart[i]=1e9; //массив с расстояниями от старта
        queue[i]=1e9; //массив с элементами, которые нужно посетить
    }
    queue[start]=heuristic(map, start);
    fromStart[start] = 0;

    while(true) {
        let current = 1e9;
        let currentIndex = -1;
        for (let i=0; i<queue.length; i++) {
            if (queue[i] < current && !visited[i]) {
                current = queue[i];
                currentIndex = i;
            }
        }   //среди элементов очереди ищем элемент с наименьшим значением
        if (currentIndex === finish) {

            console.log(previous)
            console.log(queue)
            pathOutput(previous, finish);
            return;
        }
        else if (currentIndex === -1) {
            document.getElementById("noPath").textContent = "No path"
            return;
        }

        for (let i=0; i<map[currentIndex].length; i++) {
            if (map[currentIndex][i] === 1 && !visited[i]) {
                if (fromStart[currentIndex]+1 < fromStart[i]) {
                    previous[i] = currentIndex;
                    fromStart[i] = fromStart[currentIndex] + 1;
                    queue[i] = fromStart[i] + heuristic(map, i);
                }

            }
        }
        visited[currentIndex]=true;
    }
}

let maze=[]
const tractor = {
    x: 0,
    y: 0,
}
let size
function moveTractor() {
    const directions=[]
    if (tractor.x > 0) {
        directions.push([-2,0])
    }
    if (tractor.x<size-1) {
        if (tractor.x+2>=size) {
            maze[tractor.y][tractor.x+1]=0
        }
        else {
            directions.push([2,0])
        }
    }
    if (tractor.y > 0){
        directions.push([0,-2])
    }
    if (tractor.y<size-1 ) {
        if (tractor.y+2>=size) {
            maze[tractor.y+1][tractor.x]=0
        }
        else {
            directions.push([0,2])
        }
    }
    const [dx, dy] = directions[Math.floor(Math.random()*directions.length)]
    tractor.x += dx
    tractor.y += dy

    if (maze[tractor.y][tractor.x]===1) {
        maze[tractor.y][tractor.x]=0
        maze[tractor.y - dy/2][tractor.x - dx/2]=0
    }
}
function stopTractor() {
    for (let y=0; y<size; y+=2) {
        for (let x=0; x<size; x+=2) {
            if (maze[y][x]===1)
                return false
        }
    }
    return true
}

function createMaze(n) {
    size=n
    if (size<=0) {
        return
    }
    clearMap('barriers')
    clearMap('path')
    for (let i=0; i<size; i++) {
        maze[i]=[]
        for (let j=0; j<size; j++) {
            maze[i][j]=1
        }
    }

    maze[tractor.y][tractor.x]=0;
    while(true) {
        moveTractor();

        if (stopTractor()) {
            break
        }
    }

    for (let i=0; i<size; i++) {
        for (let j=0; j<size; j++) {
            let cur=document.getElementById(i*size+j)
            if (maze[i][j]===1 && cur.style.backgroundColor==="") {
                cur.style.backgroundColor="black"
            }
        }
    }
}



