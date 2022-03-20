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
}

function barriers(td) {

    if (td.style.backgroundColor === "black") {
        td.style.backgroundColor = "";
    }
    else {
        td.style.backgroundColor = "black";
    }
}

let start, finish, finishX, finishY;
function startPoint(x, y) {
    let all=document.querySelectorAll('td');
    if (x!=="" && y!=="" && x>0 && y>0 && x<=Math.sqrt(all.length) && y<=Math.sqrt(all.length)) {
        for (let i=0; i<all.length; i++) {
            if (all[i].style.backgroundColor==="green") {
                all[i].style.backgroundColor="";
            }
        }
        let p = document.getElementById(((y-1)+(x-1)*Math.sqrt(all.length)).toString());
        p.style.backgroundColor="green";
        start=(y-1)+(x-1)*Math.sqrt(all.length);
    }
}
function finishPoint(x, y) {
    let all=document.querySelectorAll('td');
    if (x!=="" && y!=="" && x>0 && y>0 && x<=Math.sqrt(all.length) && y<=Math.sqrt(all.length)) {

        for (let i = 0; i < all.length; i++) {
            if (all[i].style.backgroundColor === "red") {
                all[i].style.backgroundColor = "";
            }
        }
        let p = document.getElementById(((y - 1) + (x - 1) * Math.sqrt(all.length)).toString());
        p.style.backgroundColor = "red";
        finish = (y - 1) + (x - 1) * Math.sqrt(all.length);
        finishX = x - 1;
        finishY = y - 1;
        createMatrix()
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
                    adjMatrix[(i-1)*matrix.length+j][(i-1)*matrix.length+j]=1;
                }
                if (j>1 && matrix[i][j-1]===1) {
                    adjMatrix[(i)*matrix.length+j][(i-1)*matrix.length+j-1]=1;
                    adjMatrix[(i)*matrix.length+j-1][(i)*matrix.length+j]=1;
                }
            }
        }
    }
    return adjMatrix;
}

function heuristic (map, start, finishX, finishY) {
    let sq = Math.sqrt(map.length);
    let startX, startY;
    let numberMatrix = new Array(sq);
    for (let i=0; i<sq; i++) {
        numberMatrix[i]=new Array(sq);
    }
    for (let i=0; i<numberMatrix.length; i++) {
        for (let j=0; j<numberMatrix.length; j++) {
            numberMatrix[i][j]=i*numberMatrix.length+j
            if (numberMatrix[i][j] === start) {
                startX = i;
                startY = j;
                break;
            }
        }
    }
    return Math.max(Math.abs(startX - finishX), Math.abs(startY - finishY));
}

const pathOutput = (previous, finish) => {
    let cur = document.getElementById(previous[finish].toString())
    if (cur.style.backgroundColor !== "green") {
        cur.style.backgroundColor = "blue";
    }
pathOutput(previous, previous[finish])
};

function aStar() {
    clearMap("path");
    document.getElementById("noPath").textContent = "";
    let map=adjMatrix(createMatrix())
    let distances = []; //массив с расстояниями от старта до всех вершин
    for (let i=0; i<map.length; i++) distances[i]=Number.MAX_VALUE;
    distances[start] = 0;
    let priorities = []; //массив с элементами, которые нужно посетить
    for (let i=0; i<map.length; i++) priorities[i]=Number.MAX_VALUE;
    priorities[start]=heuristic(map, start, finishX, finishY);

    let visited = []; //массив с посещенными вершинами

    let previous = []; //для каждой вершины будем хранить предыдущую в пути
    previous[start]=-1;
    while(true) {

        //среди непосещенных узлов ищем узел с наибольшим приоритетом (наименьшим значением)
        let lowestPriority = Number.MAX_VALUE;
        let lowestPriorityIndex = -1;
        for (let i=0; i<priorities.length; i++) {
            if (priorities[i] < lowestPriority && !visited[i]) {
                lowestPriority = priorities[i];
                lowestPriorityIndex = i;
            }
        }
        if (lowestPriorityIndex === -1) {
            document.getElementById("noPath").textContent = "No path"
            return -1;
        }
        else if (lowestPriorityIndex === finish) {
            pathOutput(previous, finish);
            return previous;
        }

        for (let i=0; i<map[lowestPriorityIndex].length; i++) {
            if (map[lowestPriorityIndex][i] !== 0 && !visited[i]) {
                if (distances[lowestPriorityIndex]+map[lowestPriorityIndex][i] < distances[i]) {
                    distances[i] = distances[lowestPriorityIndex] + map[lowestPriorityIndex][i];
                    priorities[i] = distances[i] + heuristic(map, i, finishX, finishY);
                    previous[i]=lowestPriorityIndex;
                }
            }
        }
        visited[lowestPriorityIndex]=true;
    }
}

function clearMap(condition) {
    let all=document.querySelectorAll("td");
    if (condition==="all"){
        for (let i=0; i<all.length; i++) {
        all[i].style.backgroundColor="";
        }
        /*document.getElementById("startX").value="";
        document.getElementById("startY").value="";
        document.getElementById("finishX").value="";
        document.getElementById("finishY").value="";
*/ //очистка координат страта и финиша, проблема в том что createPath выводит путь из бывшего старта в бывший финиш
    } else if (condition==="path") {
        for (let i=0; i<all.length; i++) {
            if (all[i].style.backgroundColor==="blue") {
                all[i].style.backgroundColor="";
            }
        }
    }
}

