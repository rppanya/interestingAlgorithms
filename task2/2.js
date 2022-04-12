const canvas = document.querySelector('#canvas');
const canvas1 = document.querySelector('#canvas1');
const canvas2 = document.querySelector('#canvas2');
const canvasColors = document.querySelector('#showColors');
const ctx = canvas.getContext("2d");
const ctx1 = canvas1.getContext("2d");
const ctx2 = canvas2.getContext("2d");
const ctxColors = canvasColors.getContext("2d");
canvasColors.height = 30;
canvasColors.width = 1300;
canvas.height = canvas1.height = canvas2.height = 400;
canvas.width = canvas1.width = canvas2.width = 400;
const INF = 1000000;
let points = [], canSetDots = true, distance = [];



class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//class for cluster elements in hierarchical
class PointAndNum{
    constructor(point, number) {
        this.point = point;
        this.number = number;
    }
}

//class to remember necessary data when connecting clusters in hierarchical
class Minimum{
    constructor(dist, num1, num2){
        this.dist = dist;
        this.num1 = num1;
        this.num2 = num2;
    }
}

const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b);

//initial distances and clusters
function fillDists(cluster){
    for(let i = 0; i < points.length; i++){
        distance[i] = [];
        cluster[i] = [];
    }
    for(let i = 0; i < points.length; i++){
        let clust = new PointAndNum(points[i], i);
        cluster[i].push(clust);
        for(let j = 0;j < points.length; j++){
            distance[i].push(0);
        }
    }
}

//formula
function euclideanDist(point1, point2){
    return (point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y);
}

//count distances between points
function countDists(){
    for(let i = 0; i < points.length - 1; i++){
        for(let j = i + 1;j < points.length; j++){
            let dist = euclideanDist(points[i], points[j])
            distance[i][j] = dist;
            distance[j][i] = dist;
        }
    }
}

function clearAll(){
    document.getElementById("canvas2").style.backgroundColor = 'transparent';
    document.getElementById("canvas1").style.backgroundColor = 'transparent';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctxColors.clearRect(0, 0, canvasColors.width, canvasColors.height);
    points = [];
    distance = [];
    canSetDots = true;
    console.clear();
}

//position of dot for points array and for draw
function startPos(event){
    if(canSetDots) {
        const p = new Point(event.clientX, event.clientY);
        points.push(p);
        draw(event);
        ctx.beginPath();
    }
}

//draw dots where click
function draw(event){
    ctx.lineWidth = 7;
    ctx.lineCap = "square";
    ctx.strokeStyle = 'black';
    ctx.lineTo(event.clientX - 10, event.clientY - 10);
    ctx.stroke();
    ctx.beginPath();
}

function makeColor(colorNum, colors){
    if (colors < 1) colors = 1;
    // defaults to one color - avoid divide by zero
    return colorNum * (360 / colors) % 360;
}

//paints a dot in definite color
function paintClusterElement(cl, color, methodNum){
    ctx.lineWidth = ctx1.lineWidth = ctx2.lineWidth = 12;
    ctx.lineCap = ctx1.lineCap = ctx2.lineCap = "square";
    ctx.strokeStyle = ctx1.strokeStyle = ctx2.strokeStyle = color;

    if(methodNum === 1) {
        ctx.lineTo(cl.point.x - 10, cl.point.y - 10);
        ctx.stroke();
        ctx.beginPath();
    }
    else
    if(methodNum === 2) {
        ctx1.lineTo(points[cl].x - 10, points[cl].y - 10);
        ctx1.stroke();
        ctx1.beginPath();
    }
    else {
        ctx2.lineTo(cl.x - 10, cl.y - 10);
        ctx2.stroke();
        ctx2.beginPath();
    }
}

function showColors(){
    let k = document.getElementById("clCount").value;
    k = parseInt(k);
    const canvasColors = document.querySelector('#showColors');
    const ctxColors = canvasColors.getContext("2d");
    canvasColors.height = 30;
    canvasColors.width = 1300;

    for(let i = 0; i < k; i++){
        ctxColors.lineWidth = 18;
        ctxColors.lineCap = "square";
        ctxColors.strokeStyle = "hsl( " + makeColor(i, k) + ", 100%, 50% )";
        ctxColors.lineTo(40 * (i + 1), 13);
        ctxColors.stroke();
        ctxColors.beginPath();
    }
}


//-----------------------------------------------------------------------------------------------------------------------------------------------


//connect clusters with minimum distance between the nearest elements in them
function connectMinDistClusters(cluster) {
    let k = document.getElementById("clCount").value;
    k = parseInt(k);

    while(cluster.length !== k) {
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
            for (let i = 0; i < cluster[curMin.num2].length; i++) {
                cluster[curMin.num1].push(cluster[curMin.num2][i]);
            }
            cluster.splice(curMin.num2, 1);
   }
}

function hierarchicalClustering(){
    let clusterH = [];
    fillDists(clusterH);
    countDists();
    connectMinDistClusters(clusterH);

    let k = document.getElementById("clCount").value;
    k = parseInt(k);
    for(let i = 0; i < clusterH.length; i++){
        let color = "hsl( " + makeColor(i, k) + ", 100%, 50% )";
        for(let j = 0; j < clusterH[i].length; j++){
            paintClusterElement(clusterH[i][j], color, 1);
        }
    }

    canSetDots = false;
}


//-----------------------------------------------------------------------------------------------------------------------------------------------


function primAlgo(matrix, pCount){
    let visited = new Array(pCount).fill(false);
    visited[0] = true;
    let row, col;

    for(let h = 0; h < pCount - 1; h++) {
        let minEdge = INF;
        row = 0;
        col = 0;
        for (let i = 0; i < pCount; i++) {
            for (let j = 0; j < pCount; j++) {
                if(!visited[j] && visited[i] && distance[i][j] !== 0 && distance[i][j] < minEdge){
                    minEdge = distance[i][j];
                    row = i;
                    col = j;
                }
            }
        }
        matrix[row][col] = matrix[col][row] = distance[row][col];
        visited[col] = true;
    }
}

function DFS(dist, visited, verNum, curVer, curComponent){
    visited[curVer] = true;
    curComponent.push(curVer);
    for(let i = 0; i < verNum; i++){
        if(!visited[i] && dist[curVer][i] !== 0){
            DFS(dist, visited, verNum, i, curComponent);
        }
    }
}

function findConnectingComponents(dist, pCount, k, connectComp){
    let visited = new Array(pCount).fill(false);
    for(let i = 0; i < pCount; i++){
        if(!visited[i]){
            let curComponent = [];
            DFS(dist, visited, pCount, i, curComponent);
            connectComp.push(curComponent);
        }
    }
}

function fillMatrix(matrix, size){
    for(let i = 0; i < size; i++){
        for(let j = 0; j < size; j++){
            matrix[i][j] = 0;
        }
    }
}

function deleteBiggestEdges(dist, count, pCount){
    let imax = 0, jmax = 0, counter = 1;
    while(counter < count){
        let maxEdge = dist[0][0];
        for(let i = 0; i < pCount; i++){
            for(let j = 0; j < pCount; j++){
                if(dist[i][j] > maxEdge){
                    maxEdge = dist[i][j];
                    imax = i;
                    jmax = j;
                }
            }
        }
        dist[imax][jmax] = dist[jmax][imax] = 0;
        counter++;
    }
}

function minSpanningTreeClustering(){
    let k = document.getElementById("clCount").value;
    k = parseInt(k);
    let clusterSpan = [], dist = [];
    for(let i = 0; i < points.length; i++){
        dist[i] = [];
    }
    fillMatrix(dist, points.length);

    primAlgo(dist, points.length);
    deleteBiggestEdges(dist, k, points.length);
    findConnectingComponents(dist, points.length, k, clusterSpan);

    for(let i = 0; i < k; i++){
        let color = "hsl( " + makeColor(i, k) + ", 100%, 50% )";
        for(let j = 0; j < clusterSpan[i].length; j++){
            paintClusterElement(clusterSpan[i][j], color, 2);
        }
    }
}


//-----------------------------------------------------------------------------------------------------------------------------------------------


function recomputeCentroids(centroid, clusterK, clCount){
    for(let i = 0; i < clCount; i++){
        if(clusterK[i].length > 0) {
            let sumX = 0, sumY = 0;
            for (let j = 0; j < clusterK[i].length; j++) {
                sumX += clusterK[i][j].x;
                sumY += clusterK[i][j].y;
            }
            let newX = sumX / clusterK[i].length, newY = sumY / clusterK[i].length;
            centroid[i] = new Point(newX, newY);
        }
    }
}

//distribution over nearest clusters
function pointsToNearestCentroid(centroid, clusterK){
    for(let i = 0; i < points.length; i++){
        let centroidInd = findNearestCentroidIndex(points[i], centroid);
        clusterK[centroidInd].push(points[i]);
    }
}

function findNearestCentroidIndex(point, centroid){
    let minLen = euclideanDist(point, centroid[0]), minInd = 0;
    for(let i = 1; i < centroid.length; i++){
        let dist = euclideanDist(point, centroid[i]);
        if(dist < minLen){
            minLen = dist;
            minInd = i;
        }
    }
    return minInd;
}

function initialCentroids(centroid, clCount){
    centroid[0] = points[Math.floor(Math.random() * points.length)];
    for(let step = 0; step < clCount - 1; step++) {
        let sum = 0;
        for (let i = 0; i < points.length; i++) {
            sum += euclideanDist(points[i], centroid[findNearestCentroidIndex(points[i], centroid)]);
        }
        let rand = Math.floor(Math.random() * points.length);
        sum = 0;
        for (let i = 0; i < points.length; i++) {
            sum += euclideanDist(points[i], centroid[findNearestCentroidIndex(points[i], centroid)]);
            if(sum > rand){
                centroid.push(points[i]);
                break;
            }
        }
    }
}

function kMeansClustering(){
    let centroid = [], clusterK;
    let k = document.getElementById("clCount").value;
    k = parseInt(k);
    initialCentroids(centroid, k);
    let change = true, oldCentroid = [];

    while(change){
        clusterK = [];
        for(let i = 0; i < k; i++){
            clusterK[i] = [];
        }
        change = false;

        for(let i = 0; i < centroid.length; i++){
            let newX = centroid[i].x, newY = centroid[i].y;
            oldCentroid[i] = new Point(newX, newY);
        }
        pointsToNearestCentroid(centroid, clusterK);
        recomputeCentroids(centroid, clusterK, k);
        if(!equals(oldCentroid, centroid)){
            change = true;
        }
    }

    for(let i = 0; i < k; i++){
        let color = "hsl( " + makeColor(i, k) + ", 100%, 50% )";
        for(let j = 0; j < clusterK[i].length; j++){
            paintClusterElement(clusterK[i][j], color, 3);
        }
    }
}


//-----------------------------------------------------------------------------------------------------------------------------------------------


function mainBut(){
    document.getElementById("canvas2").style.backgroundColor = 'white';
    document.getElementById("canvas1").style.backgroundColor = 'white';
    if(points.length === 0){
        alert("INSERT DOTS");
        return;
    }
    let k = document.getElementById("clCount").value;
    k = parseInt(k);
    if(k > points.length && k !== 0){
        alert("CLUSTERS COUNT IS BIGGER THEN DOTS COUNT");
        return;
    }

    if(canSetDots && k > 0) {
        hierarchicalClustering();
        minSpanningTreeClustering();
        kMeansClustering();
        showColors();
    }
}

canvas.addEventListener('click', startPos);