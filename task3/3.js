const elem = document.getElementById('plane');
function createVertex(parent, x, y) {
    const vertex = document.createElement('div');
    vertex.style.display ="inline-block"
    vertex.style.backgroundColor = "red";
    vertex.style.width = "30px";
    vertex.style.height = "30px";
    vertex.style.borderRadius = "50%";
    vertex.style.position="fixed";
    vertex.style.top=y + "px";
    vertex.style.left=x+"px";
    parent.appendChild(vertex);

}

