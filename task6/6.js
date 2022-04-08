elem = document.getElementById('table')
createTable()
function createTable() {
    const table = document.createElement('table')
    for (let i = 0; i < 5; i++) {
        const tr = document.createElement('tr')
        for (let j = 0; j < 5; j++) {
            const td = document.createElement('td')
            table.appendChild(td)
            td.addEventListener('click', function (){
                pixelPainting(td)
            })
        }
        table.appendChild(tr)
    }
    elem.appendChild(table)
}
function pixelPainting(td) {
    if (td.style.backgroundColor === 'black') {
        td.style.backgroundColor = ''
    } else {
        td.style.backgroundColor = 'black'
    }
}

//инициализировать входные сигналы x
//инициализировать веса


const activation_sigmoid = x => 1 / (1 + Math.exp(-x)) //сигмоида

function predict(n) {
    let summ = 0
    for(let i = 0; i < n; i++) {
        summ += weight[x[i]] * x[i] //вес + сам сигнал
    }
    return activation_sigmoid(summ)
}
/*
const canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    w = canvas.width,
    h = canvas.height;

let mouse = { x:0, y:0};
let draw = false;
context.lineWidth=50;

canvas.addEventListener("mousedown", function(e){

    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
    draw = true;
    context.beginPath();
    context.moveTo(mouse.x, mouse.y);
});
canvas.addEventListener("mousemove", function(e){

    if(draw === true){
        mouse.x = e.pageX - canvas.offsetLeft;
        mouse.y = e.pageY - canvas.offsetTop;
        context.lineTo(mouse.x, mouse.y);
        context.stroke();
    }
});
canvas.addEventListener("mouseup", function(e){

    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
    context.closePath();
    draw = false;
});*/
