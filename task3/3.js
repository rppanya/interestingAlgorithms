const elem = document.getElementById('plane')
const canvas = document.getElementById('canvasMain')
const ctx = canvas.getContext('2d')

let bestPath,
n = 0, counter = 0,
population = [],
cityDistance = [],
isFirstPopulation = true

function createVertex(parent, x, y) {
    if ( isFirstPopulation && x < 650 && x > 80 && y > 80 && y < 650) {
        const vertex = document.createElement('div')
        vertex.classList.add('round')
        vertex.textContent = n.toString()
        vertex.id = n++
        vertex.style.top = y - 10 + "px"
        vertex.style.left = x - 10 + "px"
        parent.appendChild(vertex)
    }
}

const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b)

function cityDistanceInitial() {
    for (let i = 0; i < n; i++) {
        cityDistance[i] = []
        for (let j = 0; j < n; j++) {
            const idI = document.getElementById(i)
            const idJ = document.getElementById(j)
            cityDistance[i][j] = parseInt( Math.sqrt(Math.pow( Math.abs(idJ.offsetTop - idI.offsetTop),2) + Math.pow( Math.abs(idJ.offsetLeft - idI.offsetLeft),2)))
        }
    }
}

function shuffle(array) {
    for (let j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x) {}
    return true
}

function firstPopulation() {
    cityDistanceInitial()
    for (let i = 0; i < n; i++) {
        population[i] = []
        for (let j = 0; j < n; j++) {
            population[i][j] = j
        }
        shuffle(population[i])
        population[i].push(population[i][0])
    }
}

//calculates fitness of an individual (route length)
function individualFitness(individual) {
    let fitness = 0
    for (let i = 0; i < individual.length - 1; i++) {
        fitness += cityDistance[individual[i]][individual[i+1]]
    }
    return fitness
}

//crossing and updating individuals in the population
function crossing(first, second) {
    let breakingPoint = Math.floor(Math.random() * (n - 1) + 1) //choose a breakpoint
    let firstChild = [],  secondChild = []

    for (let i = 0; i < breakingPoint; i++) {
        firstChild[i] = first[i]
        secondChild[i] = second[i]
    }
    for (let i = breakingPoint, j = breakingPoint; i < n && j < n; i++) {
        if (firstChild.findIndex( currentValue => currentValue === second[j] ) === -1)
            firstChild[i] = second[j++]
    }
    if (firstChild.length !== n) {
        for (let i = 0; i < n; i++) {
            if (firstChild.findIndex( currentValue => currentValue === i ) === -1) {
                firstChild.push(i)
            }
        }
    }
    for (let i = breakingPoint, j = breakingPoint; i < n && j < n; i++) {
        if (secondChild.findIndex( currentValue => currentValue === first[j] ) === -1)
            secondChild[i] = first[j++]
    }
    if (secondChild.length !== n) {
        for (let i = 0; i < n; i++) {
            if (secondChild.findIndex( currentValue => currentValue === i ) === -1) {
                secondChild.push(i)
            }
        }
    }

    firstChild = mutation(firstChild)
    secondChild = mutation(secondChild)
    firstChild.push(firstChild[0])
    secondChild.push(secondChild[0])

    let flag1 = true, flag2 = true, toDel = 0
    for (let i = 0; i < population.length; i++){
        if(equals(population[i], firstChild)){
            flag1 = false
        }
        if(equals(population[i], secondChild)){
            flag2 = false
        }
    }
    if (flag1){
        population.push(firstChild)
        toDel++
    }
    if (flag2){
        population.push(secondChild)
        toDel++
    }
    population.sort(function (a, b) {
        return individualFitness(a) - individualFitness(b)
    })
    for (let k = 0; k < toDel; k++) {
        population.pop()
    }
}

function mutation(individual) {
    let random = Math.floor(Math.random() * 100)
    if (random < 50) { //mutation percent = 50
        let t1 = Math.floor(Math.random() * individual.length)
        let t2 = Math.floor(Math.random() * individual.length)
        for (let i = 0; i < Math.abs(t1 - t2) / 2; i++) {
            let t = individual[Math.min(t1, t2) + i]
            individual[Math.min(t1, t2) + i] = individual[Math.max(t1, t2) - i]
            individual[Math.max(t1, t2) - i] = t
        }
    }
    return individual
}

function pathOutput(individual, str = '') {
    ctx.beginPath()
    for (let i = 0; i < individual.length - 1; i++) {
        let from = document.getElementById(individual[i])
        let to = document.getElementById(individual[i+1])
        ctx.moveTo(to.offsetLeft - 50, to.offsetTop - 50)
        ctx.lineTo(from.offsetLeft - 50, from.offsetTop - 50)
        ctx.stroke()
    }
    document.getElementById('bestCurPath').textContent = population[0] + str
    document.getElementById('pathLen').textContent = individualFitness(population[0]).toString()
}

function clearPaths() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

let timerId
function time() {
    timerId = setInterval(genetic, 100)
}

//genetic algorithm that works with one new generation
function genetic() {
    if (n === 0) {
        clearTimeout(timerId)
        return
    }
    if ( isFirstPopulation ) {
        firstPopulation()
        population.sort(function (a, b) {
            return individualFitness(a) - individualFitness(b)
        })
        isFirstPopulation = false
    }

    while( counter <  Math.pow(n, 2) && (bestPath === population[0] || bestPath === undefined)) {
        bestPath = population[0]

        let firstParent = Math.floor(Math.random() * population.length)
        let secondParent = Math.floor(Math.random() * population.length)
        crossing(population[firstParent], population[secondParent])

        if(bestPath === population[0]) {
            counter++
            if(counter === Math.pow(n, 2)){
                clearPaths()
                pathOutput(population[0], ' - is final best individual')
                clearTimeout(timerId)
                return
            }
        } else {
            counter = 0
        }
        clearPaths()
        pathOutput(population[0])
    }
    bestPath = undefined
}

function clearAll() {
    document.getElementById('bestCurPath').textContent = '_'
    document.getElementById('pathLen').textContent = '_'
    clearPaths()
    for (let i = 0; i < n; i++) {
        document.getElementById(i).remove()
    }
    bestPath = undefined
    n = 0
    counter = 0
    population = []
    cityDistance = []
    isFirstPopulation = true
}