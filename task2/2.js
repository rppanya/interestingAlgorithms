const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");
canvas.height = 593;
canvas.width = 700;
let points = [];
let cluster = [];
let distance = [];
let counter = 0;
let canSetDots = true;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//class for cluster elements
class PointAndNum{
    constructor(point, number) {
        this.point = point;
        this.number = number;
    }
}

//class to remember necessary data when connecting clusters
class Minimum{
    constructor(dist, num1, num2){
        this.dist = dist;
        this.num1 = num1;
        this.num2 = num2;
    }
}

//initial distances and clusters
function fillDists(){
    for(let i = 0; i < points.length; i++){
        distance[i] = [];
        cluster[i] = [cluster[i]];
    }
    for(let i = 0; i < points.length; i++){
        for(let j = 0;j < points.length; j++){
            distance[i].push(0);
        }
    }
}

//formula
function euclideanDist(point1, point2){
    return (point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y);
}

//counts distances between points
function countDists(){
    for(let i = 0; i < points.length - 1; i++){
        for(let j = i + 1;j < points.length; j++){
            let dist = euclideanDist(points[i], points[j])
            distance[i][j] = dist;
            distance[j][i] = dist;
        }
    }
}

//paints a dot in random color
function paintDot(px, py){
    ctx.lineWidth = 10;
    ctx.lineCap = "square";
    ctx.strokeStyle = 'green';

    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.beginPath();
}

function clearAll(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
    distance = [];
    cluster = [];
    counter = 0;
    canSetDots = true;
}

//connect clusters with minimum distance between the nearest elements in them
function connectMinDistClusters(clusterCount) {
    let diffSum = 0;
    if(clusterCount === ""){
        clusterCount = 0;
    }
    clusterCount = parseInt(clusterCount);

    if(clusterCount > cluster.length && clusterCount !== 0){
        alert("CLUSTERS COUNT IS BIGGER THEN DOTS COUNT");
        return;
    }

    let count = 0;
    while(cluster.length !== clusterCount) {
        if(cluster.length > 1) {
            let curMin = new Minimum(distance[cluster[0][0].number][cluster[1][0].number], 0, 1);
            for (let i = 0; i < cluster.length - 1; i++) {
                for (let j = i + 1; j < cluster.length; j++) {
                    for (let h = 0; h < cluster[i].length; h++) {
                        for (let k = 0; k < cluster[j].length; k++) {
                            if (distance[cluster[i][h].number][cluster[j][k].number] < curMin.dist) {
                                curMin.dist = distance[cluster[i][h].number][cluster[j][k].number];
                                curMin.num1 = i;
                                curMin.num2 = j;
                            }
                        }
                    }
                }
            }

                if (curMin.dist < 4 * (diffSum / count) || curMin.dist < 18000 || clusterCount !== 0) {
                    for (let i = 0; i < cluster[curMin.num2].length; i++) {
                        cluster[curMin.num1].push(cluster[curMin.num2][i]);
                    }
                    diffSum += curMin.dist;
                    count++;
                    cluster.splice(curMin.num2, 1);
                } else {
                    break;
                }
        } else {
            break;
        }
   }

   for(let i = 0; i < cluster.length; i++){
       let color = Math.floor(Math.random()*16777215).toString(16);
       for(let j = 0; j < cluster[i].length; j++){
            paintClusterElement(cluster[i][j], color);
       }
   }
}

//paints a dot in definite color
function paintClusterElement(cl, color){
        ctx.lineWidth = 12;
        ctx.lineCap = "square";
        ctx.strokeStyle = "#" + color;

        ctx.lineTo(cl.point.x, cl.point.y);
        ctx.stroke();
        ctx.beginPath();
}

//initial button pressed function
function hierarchicalClustering(){
    if(points.length === 0){
        alert("INSERT DOTS");
        return;
    }
    if(canSetDots) {
        fillDists();
        countDists();
        connectMinDistClusters(document.getElementById("clCount").value);
    }
    canSetDots = false;
}

//position of dot for (clusters and points arrays) and for draw
function startPos(event){
    if(canSetDots) {
        let p = new Point(event.clientX, event.clientY);
        let clust = new PointAndNum(p, counter);
        points.push(p);
        cluster.push(clust);
        counter++;
        draw(event);
        ctx.beginPath();
    }
}

//draws dots where click
function draw(event){
    ctx.lineWidth = 7;
    ctx.lineCap = "square";
    ctx.strokeStyle = 'black';
    ctx.lineTo(event.clientX, event.clientY);
    ctx.stroke();
    ctx.beginPath();
}

canvas.addEventListener('click', startPos);
