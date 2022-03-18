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
    return matrix;
}

