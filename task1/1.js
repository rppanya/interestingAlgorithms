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

let start, finish, finishX, finishY, startX, startY;
function startPoint(x, y) {
    startX=x; startY=y;
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

function heuristic (map, start) {
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
    } //можно получить координаты элемента по id, без numberMatrix как-то
    return Math.sqrt(Math.pow((startX - finishX),2)+ Math.pow((startY - finishY), 2));
}

const pathOutput = (previous, finish) => {
    if (previous[finish] !== undefined) {
        let cur = document.getElementById(previous[finish])
        if (cur.style.backgroundColor !== "green" && cur.style.backgroundColor !== "red") {
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
    if (finish<start) {
        let t = finish;
        finish = start;
        start = t;
    }
    let map=adjMatrix(createMatrix())

    let queue = [], visited = [], previous = [], fromStart = [];
    for (let i=0; i<map.length; i++) {
        queue[i]=1e9;
    }  //массив с элементами, которые нужно посетить
    queue[start]=heuristic(map, start);

    for (let i=0; i<map.length; i++) {
        fromStart[i]=1e9;
    }   //массив с расстояниями от старта
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

function maze(size) {
    if (size<=0) {
        return
    }
    clearMap('barriers')
    clearMap('path')
    let maze=[]
    for (let i=0; i<size; i++) {
        maze[i]=[]
        for (let j=0; j<size; j++) {
            maze[i][j]=1
        }
    }
    let x, y
    if (startX!==undefined && startY!==undefined) {
        x = startX-1; y = startY-1
    }
    else {
        x=Math.floor(Math.random()*size); y=Math.floor(Math.random()*size)
    }

    maze[x][y]=0

    let check = []

    if (y-2 >= 0) {
        check.push( { x0: x, y0: y-2 });
    }
    if (y+2 < size) {
        check.push({ x0: x, y0: y+2})
    }
    if (x-2 >= 0) {
        check.push({ x0: x-2, y0: y})
    }
    if (x+2 < size) {
        check.push({ x0: x+2, y0: y})
    }

    while (check.length > 0) {
        let index = Math.floor(Math.random()*check.length)
        x = check[index].x0
        y = check[index].y0
        maze[x][y]=0
        check.splice(index, 1)
        let direction = ["north", "south", "east", "west", "top", "bottom", "right", "left"]
        while (direction.length>0) {
            let dirIndex = Math.floor(Math.random()*direction.length)
            switch (direction[dirIndex]) {
                case "north" :
                    if (y-2 >= 0 && maze[x][y-2]===0) {
                        maze[x][y-1]=0
                        direction.splice(0, direction.length)
                    }
                    break;
                case "south" :
                    if (y+2 < size && maze[x][y+2]===0) {
                        maze[x][y+1]=0
                        direction.splice(0, direction.length)
                    }
                    break;
                case "east" :
                    if (x-2 >= 0 && maze[x-2][y]===0) {
                        maze[x-1][y]=0
                        direction.splice(0, direction.length)
                    }
                    break;
                case "west" :
                    if (x+2 < size && maze[x+2][y]===0) {
                        maze[x+1][y]=0
                        direction.splice(0, direction.length)
                    }
                    break;
                case "top" :
                    if (y-1 === 0 && maze[x][y-1]===1) {
                        maze[x][y-1]=0
                        direction.splice(0, direction.length)
                    }
                    break;
                case "bottom" :
                    if (y+1 === size-1 && maze[x][y+1]===1) {
                        maze[x][y+1]=0
                        direction.splice(0, direction.length)
                    }
                    break;
                case "right" :
                    if (x+1 === size-1 && maze[x+1][y]===1) {
                        maze[x+1][y]=0
                        direction.splice(0, direction.length)
                    }
                    break;
                case "left" :
                    if (x-1 === 0 && maze[x-1][y]===1) {
                        maze[x-1][y]=0
                        direction.splice(0, direction.length)
                    }
                    break;
            }
            direction.splice(dirIndex, 1)
        }

        if (y-2 >= 0 && maze[x][y-2]===1) {
            check.push( { x0: x, y0: y-2 });
        }
        if (y+2 < size && maze[x][y+2]===1) {
            check.push({ x0: x, y0: y+2})
        }
        if (x-2 >= 0 && maze[x-2][y]===1) {
            check.push({ x0: x-2, y0: y})
        }
        if (x+2 < size && maze[x+2][y]===1) {
            check.push({ x0: x+2, y0: y})
        }
    }
    console.log(maze)
    for (let i=0; i<size; i++) {
        for (let j=0; j<size; j++) {
            let cur=document.getElementById(i*size+j)
            if (maze[i][j]===1 && cur.style.backgroundColor==="") {
                cur.style.backgroundColor="black"
            }
        }
    }
}



