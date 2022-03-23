const elem = document.getElementById('plane');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let n = 0;
let mutationPercent = 50;

function createVertex(parent, x, y) {
    const vertex = document.createElement('div');
    vertex.classList.add('round')
    vertex.id = n++;
    vertex.style.top = y + "px";
    vertex.style.left = x + "px";
    parent.appendChild(vertex);

}

let cityDistance = []; //массив с расстояниями между городами
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

function shuffle(array) { //перемешивает массив чисел
    for (let j, x, i = array.length; i; j = parseInt(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x) {}
    return true;
}

function firstPopulation() { //создает начальную популяцию из 10ти особей
    cityDistanceInitial();
    let population = [], fitness = [];
    for (let i=0; i<10; i++) {
        population[i]=[];
        for (let j=0; j<n; j++) {
            population[i][j]=j;
        }
        shuffle(population[i]);
        fitness[i]=individualFitness(population[i])
    }
    /*console.log(population);
    console.log(fitness);*/
}

function individualFitness(individual) { //считает приспособленность особи (длину маршрута)
    let fitness = 0;
    for (let i=0; i<individual.length-1; i++) {
        fitness+=cityDistance[individual[i]][individual[i+1]];
    }
    return fitness;
}

function crossing(first, second) { //скрещивание
    let breakingPoint = Math.floor(Math.random()*(n)); //выбор точки останова (что-то не так)
    let firstChild = [], secondChild = [];
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
            secondChild[i]=first()[j++]
    }
    if (secondChild.length !== n) {
        for (let i=0; i<n; i++) {
            if (secondChild.findIndex( currentValue => currentValue === i ) === -1) {
                secondChild.push(i);
            }
        }
    }
    /*console.log(firstChild)
    console.log(secondChild)*/
}

function mutation(individual) {
    let random = Math.floor(Math.random()*100);
    if (random<mutationPercent) {
        let t1 = Math.floor(Math.random()*n);
        let t2 = Math.floor(Math.random()*n);
        let t = individual[t1];
        individual[t1]=individual[t2];
        individual[t2]=t;
    }
    /*console.log(individual);*/
    return individual;
}

function compare(a, b) { // критерий для сортировки особей в популяции
    if (individualFitness(a)<individualFitness(b)) {
        return -1;
    }
    else if (individualFitness(a)===individualFitness(b)){
        return 0;
    }
    else {
        return 1;
    }
}

function pathOutput(individual) {
    ctx.beginPath();
    for (let i=0; i<individual.length-1; i++) {
        const from = document.getElementById(i);
        const to = document.getElementById((i+1));
        ctx.moveTo(to.offsetLeft-60, to.offsetTop-60);
        ctx.lineTo(from.offsetLeft-60, from.offsetTop-60);
        ctx.stroke();
    }

}