const elem = document.getElementById('table')
function createTable(parent, n) {
    clearMap('all')
    let fc = parent.firstChild
    while (fc) {
        parent.removeChild(fc)
        fc = parent.firstChild
    }
    let counter = 0
    const table = document.createElement('table')
    for (let i = 0; i < n; i++) {
        const tr = document.createElement('tr')
        for (let j = 0; j < n; j++) {
            const td = document.createElement('td')
            td.id = counter.toString()
            counter++
            table.appendChild(td)
            td.addEventListener('click',function(){
                barriers(td)
            })
        }
        table.appendChild(tr)
    }
    parent.appendChild(table)
    for (let i = 0; i < 4; i++) {
        document.getElementsByClassName('point')[i].max = n
    }
}

function barriers(td) {
    if (td.style.backgroundColor === 'black') {
        td.style.backgroundColor = ''
    } else {
        td.style.backgroundColor = 'black'
    }
}

let start, finish, finishX, finishY
function startPoint(x, y) {
    clearMap('path')
    let all = document.querySelectorAll('td')
    if (x !== '' && y !== '') {
        for (let i = 0; i < all.length; i++) {
            if (all[i].style.backgroundColor === 'green') {
                all[i].style.backgroundColor = ''
            } else if (all[i].style.backgroundColor === 'darkgreen') {
                all[i].style.backgroundColor = 'black'
            }
        }
        let p = document.getElementById((y - 1) + (x - 1) * Math.sqrt(all.length))
        if (p.style.backgroundColor !== 'red' && p.style.backgroundColor !== 'darkred') {
            if (p.style.backgroundColor === 'black') {
                p.style.backgroundColor = 'darkgreen'
            } else {
                p.style.backgroundColor = 'green'
            }
        }
        start = (y - 1) + (x - 1) * Math.sqrt(all.length)
    }
}
function finishPoint(x, y) {
    clearMap('path')
    let all = document.querySelectorAll('td')
    if (x !== '' && y !== '') {
        for (let i = 0; i < all.length; i++) {
            if (all[i].style.backgroundColor === 'red') {
                all[i].style.backgroundColor = ''
            } else if (all[i].style.backgroundColor === 'darkred') {
                all[i].style.backgroundColor = 'black'
            }
        }
        let p = document.getElementById((y - 1) + (x - 1) * Math.sqrt(all.length))
        if (p.style.backgroundColor !== 'green' && p.style.background !== 'darkgreen') {
            if (p.style.backgroundColor === 'black') {
                p.style.backgroundColor = 'darkred'
            } else {
                p.style.backgroundColor = 'red'
            }
        }

        finish = (y - 1) + (x - 1) * Math.sqrt(all.length)
        finishX = x - 1
        finishY = y - 1
    }
}


let maze = []
const cleaner = { //cage cleaner to create a maze
    x: 0,
    y: 0,
}
function moveCleaner(size) {
    const directions = []
    if (cleaner.x > 0) {
        directions.push( [-2,0] )
    }
    if (cleaner.x < size - 1) {
        if (cleaner.x + 2 >= size) {
            maze[cleaner.y][cleaner.x + 1] = 0
        } else {
            directions.push( [2,0] )
        }
    }
    if (cleaner.y > 0){
        directions.push( [0,-2] )
    }
    if (cleaner.y < size - 1) {
        if (cleaner.y + 2 >= size) {
            maze[cleaner.y + 1][cleaner.x] = 0
        } else {
            directions.push( [0,2] )
        }
    }
    const [dx, dy] = directions[Math.floor(Math.random() * directions.length)]
    cleaner.x += dx
    cleaner.y += dy
    if (maze[cleaner.y][cleaner.x] === 1) {
        maze[cleaner.y][cleaner.x] = 0
        maze[cleaner.y - dy / 2][cleaner.x - dx / 2] = 0
    }
}
function stopCleaner(size) {
    for (let y = 0; y < size; y += 2) {
        for (let x = 0; x < size; x += 2) {
            if (maze[y][x] === 1)
                return false
        }
    }
    return true
}
function createMaze(n) {
    const size = n
    if (size <= 2) {
        return
    }
    clearMap('barriers')
    clearMap('path')
    for (let i = 0; i < size; i++) {
        maze[i] = []
        for (let j = 0; j < size; j++) {
            maze[i][j] = 1
        }
    }

    maze[cleaner.y][cleaner.x] = 0
    while (true) {
        moveCleaner(size)
        if (stopCleaner(size)) {
            break
        }
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cur = document.getElementById(i * size + j)
            if (maze[i][j] === 1 && cur.style.backgroundColor === '') {
                cur.style.backgroundColor = 'black'
            }
        }
    }
}


function createMatrix() {
    let all = document.querySelectorAll('td')
    let matrix = new Array( Math.sqrt(all.length) )
    for (let i = 0; i < matrix.length; i++) {
        matrix[i] = new Array( Math.sqrt(all.length) )
    }
    for (let x = 0; x < Math.sqrt(all.length); x++) {
        for (let y = 0; y < Math.sqrt(all.length); y++) {
            let p = document.getElementById(y + x * Math.sqrt(all.length))
            if (p.style.backgroundColor !== 'black') {
                matrix[x][y] = 1
            } else {
                matrix[x][y] = 0
            }
        }
    }
    return matrix
}

function adjacencyMatrix(matrix) {
    let adjMatrix = new Array(matrix.length * matrix.length)
    for (let i = 0; i < adjMatrix.length; i++) {
        adjMatrix[i] = new Array(matrix.length * matrix.length)
    }
    for (let i = 0; i < adjMatrix.length; i++) {
        for (let j = 0; j < adjMatrix.length; j++) {
            adjMatrix[i][j] = 0
        }
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            if (matrix[i][j] === 1) {
                if (j < matrix.length - 1 && matrix[i][j + 1] === 1) {
                    adjMatrix[i * matrix.length + j][i * matrix.length + j + 1] = 1
                    adjMatrix[i * matrix.length + j + 1][i * matrix.length + j] = 1
                }
                if (i < matrix.length - 1 && matrix[i + 1][j] === 1) {
                    adjMatrix[i * matrix.length + j][(i + 1) * matrix.length + j] = 1
                    adjMatrix[(i + 1) * matrix.length + j][i * matrix.length + j] = 1
                }
                if (i > 1 && matrix[i - 1][j] === 1) {
                    adjMatrix[i * matrix.length + j][(i - 1) * matrix.length + j] = 1
                    adjMatrix[(i - 1) * matrix.length + j][i * matrix.length + j] = 1
                }
                if (j > 1 && matrix[i][j - 1] === 1) {
                    adjMatrix[i * matrix.length + j][i * matrix.length + j - 1] = 1
                    adjMatrix[i * matrix.length + j - 1][i * matrix.length + j] = 1
                }
            }
        }
    }
    return adjMatrix
}

function heuristic(map, start) {
    let size = Math.sqrt(map.length)
    let deltaX = Math.trunc(start / size) - finishX
    let deltaY = start % size - finishY
    return Math.sqrt(Math.pow(deltaX,2)+ Math.pow(deltaY, 2)) //Euclidean heuristic
}

const pathOutput = (previous, finish) => {
    if (previous[finish] !== undefined) {
        let cur = document.getElementById(previous[finish])
        if (cur.style.backgroundColor !== 'green' && cur.style.backgroundColor !== 'darkgreen' &&
            cur.style.backgroundColor !== 'red' && cur.style.backgroundColor !== 'darkred') {
            cur.style.backgroundColor = 'blue'
        }
        pathOutput(previous, previous[finish])
    }
}

function waitingCellsOutput(queue) {
    for (let i = 0; i < queue.length; i++) {
        if (queue[i] < 1e9) {
            const cur = document.getElementById(i)
            if (cur.style.backgroundColor === '') {
                cur.style.backgroundColor = 'white'
            }
        }
    }
}

function clearMap(condition) {
    clearInterval(timer)
    document.getElementById('noPath').textContent = ''
    let all = document.querySelectorAll('td')
    if (condition === 'all') {
        for (let i = 0; i < all.length; i++) {
            all[i].style.backgroundColor = ''
        }
        start = undefined
        finish = undefined
        for (let i = 0; i < 4; i++) {
            document.getElementsByClassName('point')[i].value = ''
        }
    } else if (condition === 'path') {
        for (let i = 0; i < all.length; i++) {
            if (all[i].style.backgroundColor === 'blue' || all[i].style.backgroundColor === 'white' || all[i].style.backgroundColor === 'lightgrey') {
                all[i].style.backgroundColor = ''
            }
        }
    } else if (condition === 'barriers') {
        for (let i = 0; i < all.length; i++) {
            if (all[i].style.backgroundColor === 'black') {
                all[i].style.backgroundColor = ''
            }
        }
    }
}

let timer
function aStar() {
    clearMap('path')
    document.getElementById('noPath').textContent = ''
    if (start === undefined || finish === undefined) {
        document.getElementById('noPath').textContent = 'No path'
    }
    let map = adjacencyMatrix( createMatrix() )

    let queue = [], visited = [], previous = [], fromStart = []

    for (let i=0; i<map.length; i++) {
        fromStart[i] = 1e9 //array with distances from start
        queue[i] = 1e9 //array with distances of elements to be visited
    }
    queue[start] = heuristic(map, start)
    fromStart[start] = 0

    timer = setInterval(() => {
        let current = 1e9
        let currentIndex = -1
        for (let i=0; i<queue.length; i++) {
            if (queue[i] < current && !visited[i]) {
                current = queue[i]
                currentIndex = i
            }
        }

        if (currentIndex === finish) {
            pathOutput(previous, finish)
            clearInterval(timer)
            return
        } else if (currentIndex === -1) {
            document.getElementById('noPath').textContent = 'No path'
            clearInterval(timer)
            return
        }
        if (currentIndex !== start) {
            document.getElementById(currentIndex).style.backgroundColor = 'lightgrey'
        }
        waitingCellsOutput(queue)
        for (let i=0; i<map[currentIndex].length; i++) {
            if (map[currentIndex][i] === 1 && !visited[i]) {
                if (fromStart[currentIndex] + 1 < fromStart[i]) {
                    previous[i] = currentIndex
                    fromStart[i] = fromStart[currentIndex] + 1
                    queue[i] = fromStart[i] + heuristic(map, i)
                }

            }
        }
        visited[currentIndex] = true
    }, 50)
}





