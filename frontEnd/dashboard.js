// ativa os ícones
feather.replace()



/* ======================
MENU ATIVO
====================== */

const menuLinks = document.querySelectorAll("nav a")

menuLinks.forEach(link => {

link.addEventListener("click", () => {

menuLinks.forEach(l => l.classList.remove("active"))

link.classList.add("active")

})

})



/* ======================
ANIMAÇÃO DOS CARDS
====================== */

const cards = document.querySelectorAll(".category-card")

cards.forEach((card,i)=>{

card.style.opacity="0"
card.style.transform="translateY(20px)"

setTimeout(()=>{

card.style.transition="0.6s"
card.style.opacity="1"
card.style.transform="translateY(0)"

},150*i)

})



/* ======================
BOTÃO EXPLORAR
====================== */

const exploreBtn = document.querySelector(".btn-primary")

if(exploreBtn){

exploreBtn.addEventListener("click",()=>{

alert("Abrindo produtos")

})

}



/* ======================
VERIFICA LOGIN (SIMULAÇÃO)
====================== */

function checkLogin(){

const user = localStorage.getItem("user")

if(!user){

window.location.href="index.html"

}

}

checkLogin()