const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");
let points = [];
canvas.height = 500;
canvas.width = 500;
let cluster = [];
let distance = [];

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function fillDists(){
    for(let i = 0; i < points.length; i++){
        distance[i] = [];
        cluster[i] = [];
    }
    for(let i = 0; i < points.length; i++){
        for(let j = 0;j < points.length; j++){
            distance[i].push(0);
        }
    }
}

function euclideanDist(point1, point2){
    return (point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y);
}

function hierarchicalClust(){

}

function countDists(){
    for(let i = 0; i < points.length; i++){
        for(let j = i + 1;j < points.length; j++){
            let dist = euclideanDist(points[i], points[j])
            distance[i][j] = dist;
            distance[j][i] = dist;
        }
    }
}

function paintDot(px, py){
    ctx.lineWidth = 10;
    ctx.lineCap = "square";
    ctx.strokeStyle = 'green';

    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.beginPath();
}

function paintDots(){
    fillDists();
    countDists();
    for(let i=0;i<points.length;i++){
        for(let j=0;j<points.length;j++){
            console.log(distance[i][j]);
        }
    }
    for(let i = 0; i < points.length; i++)
    {
        paintDot(points[i].x, points[i].y);
    }
}

function startPos(event){
    let p = new Point(event.clientX, event.clientY);
    points.push(p);
    cluster.push(p);
    draw(event);
    ctx.beginPath();
}

function draw(event){
    ctx.lineWidth = 5;
    ctx.lineCap = "square";
    ctx.strokeStyle = 'black';
    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
    ctx.beginPath();
}

canvas.addEventListener('click', startPos);
