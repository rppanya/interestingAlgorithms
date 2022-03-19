const elem = document.getElementById('table');

function createTable(parent, n) {

    let fc = parent.firstChild;
    while(fc) {
        parent.removeChild(fc);
        fc = parent.firstChild;
    }
    const table = document.createElement('table');
    for (let i=0; i<n; i++) {
        const tr = document.createElement('tr')
        for (let j=0; j<n; j++) {
            const td = document.createElement('td')
            td.id = j+" "+i;
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

function startPoint(x, y) {
    let all=document.querySelectorAll('td');
    for (let i=0; i<all.length; i++) {
        if (all[i].style.backgroundColor==="green") {
            all[i].style.backgroundColor="";
        }
    }
    let p = document.getElementById((y-1)+" "+(x-1));
    p.style.backgroundColor="green";
}
function finishPoint(x, y) {
    let all=document.querySelectorAll('td');
    for (let i=0; i<all.length; i++) {
        if (all[i].style.backgroundColor==="red") {
            all[i].style.backgroundColor="";
        }
    }
    let p = document.getElementById((y-1)+" "+(x-1));
    p.style.backgroundColor="red";
    createMatrix()
}

//тут нужно написать функцию, расчитывающую h, например расстояние по прямой между двумя клетками
function createMatrix() {
    let all=document.querySelectorAll('td');
    let matrix = new Array(Math.sqrt(all.length));
    for (let i=0; i<matrix.length; i++) {
        matrix[i]=new Array(Math.sqrt(all.length));
    }

    for (let x=0; x<Math.sqrt(all.length); x++) {
        for (let y = 0; y<Math.sqrt(all.length); y++) {
            let p = document.getElementById((y) + " " + (x));
            if (p.style.backgroundColor !== "black") {
                matrix[x][y] = 1;
            } else {
                matrix[x][y] = 0;
            }
        }
    }

    adjMatrix(matrix);
}

function adjMatrix(matrix) {
    let numberMatrix = matrix
    console.log(matrix);
    for (let i=0; i<numberMatrix.length; i++) {
        for (let j=0; j<numberMatrix.length; j++) {
            numberMatrix[i][j]=i*numberMatrix.length+j
        }
    }

    let adjMatrix = new Array(matrix.length*matrix.length);
    for (let i=0; i<adjMatrix.length; i++) {
        matrix[i]=new Array(matrix.length*matrix.length);
    }
    for (let i=0; i<adjMatrix.length; i++) {
        for (let j=0; j<adjMatrix.length; j++) {
            adjMatrix[i][j]=0
        }
    }
    for (let i=0; i<matrix.length; i++) {
        for (let j=0; j<matrix.length; j++) {
            if (j<matrix.length-1 && matrix[i][j+1]===1) {
                adjMatrix[numberMatrix[i][j]][numberMatrix[i][j+1]]=1;
            }
            if (i<matrix.length-1 && matrix[i+1][j]===1) {
                adjMatrix[numberMatrix[i][j]][numberMatrix[i+1][j]]=1;
            }
            if (i>1 && matrix[i-1][j]===1) {
                adjMatrix[numberMatrix[i][j]][numberMatrix[i-1][j]]=1;
            }
            if (j>1 && matrix[i][j-1]===1) {
                adjMatrix[numberMatrix[i][j]][numberMatrix[i][j-1]]=1;
            }
        }
    }
    console.log(adjMatrix)
}

//тут нужно написать функцию, расчитывающую h, например расстояние по прямой между двумя клетками
const heuristic = function (startX, startY, finishX, finishY) {
    return Math.abs(startX - finishX) + Math.abs(startY - finishY);
}


//в эту функцию нужно будет передать массив map в виде матрицы смежности графа, построенного на основе карты
// h - эвристическая оценка расстояния между точками(точно меньше фактического расстояния)

const aStar = function (map, h, start, finish) {

    let distances = []; //массив с расстояниями от старта до всех вершин
    for (let i=0; i<map.length; i++) distances[i]=Number.MAX_VALUE;
    distances[start] = 0;

    let priorities = []; //массив с элементами, которые нужно посетить
    for (var i=0; i<map.length; i++) priorities[i]=Number.MAX_VALUE;
    priorities[start]=h[start][finish];

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
        } else if (lowestPriorityIndex === finish) {
            return previous;
        }

        for (let i=0; i<map[lowestPriorityIndex].length; i++) {
            if (map[lowestPriorityIndex][i] !== 0 && !visited[i]) {
                if (distances[lowestPriorityIndex]+map[lowestPriorityIndex][i] < distances[i]) {
                    distances[i] = distances[lowestPriorityIndex] + map[lowestPriorityIndex][i];
                    priorities[i] = distances[i] + h[i][finish];
                }
                previous[i]=lowestPriorityIndex;
            }
        }
        visited[lowestPriorityIndex]=true;
    }
}
