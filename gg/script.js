const kit = document.getElementById("kit")
const ugh1 = document.getElementById("ugh1")
const ugh2 = document.getElementById("ugh2")
document.addEventListener("keydown",function(event){
    jump();
});
function jump() {
    if (kit.classList !== "jump") {
        kit.classList.add("jump")
    }
    setTimeout(function () {
        kit.classList.remove("jump")
    }, 300)
}

let isAlive = setInterval(function() {
    let kitTop = parseInt(window.getComputedStyle(kit).getPropertyValue("top"));
    let ugh1Left = parseInt(window.getComputedStyle(ugh1).getPropertyValue("left"));
    let ugh2Left = parseInt(window.getComputedStyle(ugh2).getPropertyValue("left"));
    if (((ugh1Left<80 && ugh1Left>0)||(ugh2Left<80 && ugh2Left>0)) && kitTop>=220) {
        alert("GAME OVER!")
    }
}, 10)
