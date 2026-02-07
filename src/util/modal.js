const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.querySelector(".close");
const formAgendamento = document.querySelector(".modal-content");

// abrir modal
openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
});

// fechar modal pelo X
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
  formAgendamento.reset(); // limpa os campos ao fechar
});

// fechar modal clicando fora
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
    formAgendamento.reset();
  }
});