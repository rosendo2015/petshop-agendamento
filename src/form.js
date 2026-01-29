import { carregarAgendamentos } from "./agendamentos.js";

const form = document.querySelector(".modal-content");
const closeBtn = document.querySelector(".close");

form.onsubmit = async (event) => {
  event.preventDefault();

  const tutor = document.getElementById("tutor").value.trim();
  const pet = document.getElementById("pet").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const service = document.getElementById("service-description").value.trim();
  const date = document.getElementById("date").value;
  const hour = document.getElementById("hour").value;

  if (!tutor || !pet || !phone || !service || !date || !hour) {
    return alert("Preencha todos os campos!");
  }

  const when = `${date}T${hour}:00`;
  const id = new Date().getTime();

  try {
    await fetch("http://localhost:3333/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, tutor, pet, phone, service, when })
    });

    alert("Agendamento realizado com sucesso!");
    carregarAgendamentos(); // atualiza a lista
    form.reset();           // limpa os campos
    closeBtn.click();       // fecha o modal
  } catch (err) {
    alert("Erro ao salvar agendamento.");
    console.error(err);
  }
};