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
    for (let i=0; i<all.length; i++) {
        if (all[i].style.backgroundColor==="green") {
            all[i].style.backgroundColor="";
        }
    }
    let p = document.getElementById((y-1)+(x-1)*Math.sqrt(all.length));
    p.style.backgroundColor="green";
    start=(y-1)+(x-1)*Math.sqrt(all.length);
}
function finishPoint(x, y) {
    let all=document.querySelectorAll('td');
    for (let i=0; i<all.length; i++) {
        if (all[i].style.backgroundColor==="red") {
            all[i].style.backgroundColor="";
        }
    }
    let p = document.getElementById((y-1)+(x-1)*Math.sqrt(all.length));
    p.style.backgroundColor="red";
    finish=(y-1)+(x-1)*Math.sqrt(all.length);
    finishX=x-1;
    finishY=y-1;
    createMatrix()
}

function createMatrix() {
    let all=document.querySelectorAll('td');
    let matrix = new Array(Math.sqrt(all.length));
    for (let i=0; i<matrix.length; i++) {
        matrix[i]=new Array(Math.sqrt(all.length));
    }

    for (let x=0; x<Math.sqrt(all.length); x++) {
        for (let y = 0; y<Math.sqrt(all.length); y++) {
            let p = document.getElementById((y) + (x)*Math.sqrt(all.length));
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
    let numberMatrix = new Array(matrix.length);
    for (let i=0; i<matrix.length; i++) {
        numberMatrix[i]=new Array(matrix.length);
    }
    for (let i=0; i<numberMatrix.length; i++) {
        for (let j=0; j<numberMatrix.length; j++) {
            numberMatrix[i][j]=i*numberMatrix.length+j
        }
    }
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
                    adjMatrix[numberMatrix[i][j]][numberMatrix[i][j+1]]=1;
                    adjMatrix[numberMatrix[i][j+1]][numberMatrix[i][j]]=1
                }
                if (i<matrix.length-1 && matrix[i+1][j]===1) {
                    adjMatrix[numberMatrix[i][j]][numberMatrix[i+1][j]]=1;
                    adjMatrix[numberMatrix[i+1][j]][numberMatrix[i][j]]=1;
                }
                if (i>1 && matrix[i-1][j]===1) {
                    adjMatrix[numberMatrix[i][j]][numberMatrix[i-1][j]]=1;
                    adjMatrix[numberMatrix[i-1][j]][numberMatrix[i][j]]=1;
                }
                if (j>1 && matrix[i][j-1]===1) {
                    adjMatrix[numberMatrix[i][j]][numberMatrix[i][j-1]]=1;
                    adjMatrix[numberMatrix[i][j-1]][numberMatrix[i][j]]=1;
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
    return Math.abs(startX - finishX) + Math.abs(startY - finishY);
}

function pathOutput(previous, finish) {
    let cur = document.getElementById(previous[finish].toString())
    if (cur.style.backgroundColor !== "green") {
        cur.style.backgroundColor = "grey";
    }
pathOutput(previous, previous[finish])
}

const aStar = function () {

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
        var lowestPriority = Number.MAX_VALUE;
        var lowestPriorityIndex = -1;
        for (let i=0; i<priorities.length; i++) {
            if (priorities[i] < lowestPriority && !visited[i]) {
                lowestPriority = priorities[i];
                lowestPriorityIndex = i;
            }
        }
        if (lowestPriorityIndex === -1) {
            //все вершины посещены, пути нет
            return -1;
        }
        else if (lowestPriorityIndex === finish) {
            console.log(previous);
            pathOutput(previous, finish);
            return previous;
        }

        for (let i=0; i<map[lowestPriorityIndex].length; i++) {
            if (map[lowestPriorityIndex][i] !== 0 && !visited[i]) {
                if (distances[lowestPriorityIndex]+map[lowestPriorityIndex][i] < distances[i]) {
                    distances[i] = distances[lowestPriorityIndex] + map[lowestPriorityIndex][i];
                    priorities[i] = distances[i] + heuristic(map, i, 2, 2);
                }
                previous[i]=lowestPriorityIndex;
            }
        }
        visited[lowestPriorityIndex]=true;
    }
}

