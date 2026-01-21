// Seleciona elementos
const modal = document.getElementById("modal");
const btn = document.getElementById("openModal");
const span = document.querySelector(".close");

// Abre o modal
btn.onclick = function() {
  modal.style.display = "block";
}

// Fecha ao clicar no X
span.onclick = function() {
  modal.style.display = "none";
}

// Fecha ao clicar fora do modal
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}