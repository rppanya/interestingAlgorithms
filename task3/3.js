const elem = document.getElementById('plane');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let bestPath;
let n = 0;
let counter = 0;
let mutationPercent = 50;
let population = [];
let fitness = [];
let firstChild, secondChild;
let cityDistance = []; //массив с расстояниями между городами
let isFirstPopulation = true;

function createVertex(parent, x, y) {
    const vertex = document.createElement('div');
    vertex.classList.add('round')
    vertex.text
    vertex.textContent = n.toString();
    vertex.id = n++;
    vertex.style.top = y + "px";
    vertex.style.left = x + "px";
    parent.appendChild(vertex);
}

function cityDistanceInitial() {
    for (let i=0; i<n; i++) {
        cityDistance[i]=[];
        for (let j=0; j<n; j++) {
            const idI = document.getElementById(i);
            const idJ = document.getElementById(j);
            cityDistance[i][j]=parseInt(Math.sqrt(Math.pow(Math.abs(idJ.offsetTop-idI.offsetTop),2)+Math.pow(Math.abs(idJ.offsetLeft-idI.offsetLeft),2)));
        }
    }
    /*console.log(cityDistance)*/
}

//перемешивает массив чисел
function shuffle(array) {
    for (let j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x) {}
    return true;
}

//создает начальную популяцию
function firstPopulation() {
    cityDistanceInitial();

    for (let i=0; i<n/2; i++) {
        population[i]=[];
        for (let j=0; j<n; j++) {
            population[i][j]=j;
        }
        shuffle(population[i]);
        population[i].push(population[i][0]);
        console.log("Population ", i);
        console.log(population[i]);
        fitness[i]=individualFitness(population[i])
    }

    //console.log(population);
    //console.log(fitness);
}

//считает приспособленность особи (длину маршрута)
function individualFitness(individual) {
    let fitness = 0;
    for (let i=0; i<individual.length-1; i++) {
        fitness+=cityDistance[individual[i]][individual[i+1]];
    }

    return fitness;
}

//скрещивание
function crossing(first, second) {
    let breakingPoint = Math.floor(Math.random() * (n - 1) + 1); //выбор точки останова (что-то не так)
    firstChild = [];
    secondChild = [];
    for (let i=0; i<breakingPoint; i++) {
        firstChild[i]=first[i];
        secondChild[i]=second[i];
    }
    for (let i = breakingPoint, j = breakingPoint; i<n && j<n; i++) {
        if (firstChild.findIndex( currentValue => currentValue === second[j] ) === -1)
            firstChild[i]=second[j++]
    }
    if (firstChild.length !== n) {
        for (let i=0; i<n; i++) {
            if (firstChild.findIndex( currentValue => currentValue === i ) === -1) {
                firstChild.push(i);
            }
        }
    }
    for (let i = breakingPoint, j = breakingPoint; i<n && j<n; i++) {
        if (secondChild.findIndex( currentValue => currentValue === first[j] ) === -1)
            secondChild[i]=first[j++]
    }
    if (secondChild.length !== n) {
        for (let i=0; i<n; i++) {
            if (secondChild.findIndex( currentValue => currentValue === i ) === -1) {
                secondChild.push(i);
            }
        }
    }
    firstChild.push(firstChild[0]);
    secondChild.push(secondChild[0]);
    /*console.log(firstChild)
    console.log(secondChild)*/
}

function mutation(individual) {
    let random = Math.floor(Math.random()*100);
    if (random<mutationPercent) {
        let t1 = Math.floor(Math.random()*(n-1) + 1);
        let t2 = Math.floor(Math.random()*(n-1) + 1);
        let t = individual[t1];
        individual[t1]=individual[t2];
        individual[t2]=t;
    }
    /*console.log(individual);*/
    return individual;
}

function pathOutput(individual) {
    ctx.beginPath();
    for (let i=0; i<individual.length-1; i++) {
        let from = document.getElementById(individual[i]);
        let to = document.getElementById(individual[i+1]);
        ctx.moveTo(to.offsetLeft-60, to.offsetTop-60);
        ctx.lineTo(from.offsetLeft-60, from.offsetTop-60);
        ctx.stroke();
    }
}

function clearPaths() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function genetic() {
    if(isFirstPopulation) {
        firstPopulation();
        population.sort(function (a, b) {
            return individualFitness(a) - individualFitness(b);
        });
        isFirstPopulation = false;
    }

    while(counter <  n*n*n && (bestPath === population[0] || bestPath === undefined)) {
        bestPath = population[0];
        let firstParent = Math.floor(Math.random() * population.length);
        let secondParent = Math.floor(Math.random() * population.length);
        crossing(population[firstParent], population[secondParent]);

        firstChild = mutation(firstChild);
        secondChild = mutation(secondChild);
        population.push(firstChild)
        population.push(secondChild);

        population.sort(function (a, b) {
            return individualFitness(a) - individualFitness(b);
        });
        population.pop();
        population.pop();
        console.log(population[0]);
        console.log(individualFitness(population[0]));
        if(bestPath === population[0]) {
            counter++;
        }
        else{
            counter = 0;
        }
        clearPaths();
        pathOutput(population[0]);
        document.getElementById("bestCurPath").textContent = population[0];
        document.getElementById("pathLen").textContent = individualFitness(population[0]);
       // counter++;
    }
    bestPath = undefined;
}
