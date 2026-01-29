import dayjs from "dayjs";

const morning = document.getElementById("period-morning");
const afternoon = document.getElementById("period-afternoon");
const night = document.getElementById("period-night");

export async function carregarAgendamentos() {
  try {
    const resposta = await fetch("http://localhost:3333/schedules");
    const data = await resposta.json();

    // Limpa listas
    morning.innerHTML = "";
    afternoon.innerHTML = "";
    night.innerHTML = "";

    data.forEach(schedule => {
      const item = document.createElement("li");
      item.innerHTML = `
        <div class="wrapper-info">
          <div class="horario"><span>${dayjs(schedule.when).format("HH:mm")}</span></div>
          <div class="identification">
            <span>${schedule.pet}</span>
            <span>/</span>
            <span>${schedule.tutor}</span>
          </div>
        </div>
        <div class="servico"><span>${schedule.service}</span></div>
        <div class="remover"><a href="#" data-id="${schedule.id}">Remover</a></div>
      `;

      const hour = dayjs(schedule.when).hour();
      if (hour <= 12) {
        morning.appendChild(item);
      } else if (hour > 12 && hour <= 18) {
        afternoon.appendChild(item);
      } else {
        night.appendChild(item);
      }
    });
  } catch (err) {
    alert("Não foi possível buscar os agendamentos do dia selecionado.");
    console.error(err);
  }
  item.querySelector(".remover a").addEventListener("click", async (e) => {
  e.preventDefault();
  const confirmacao = confirm("Deseja remover este agendamento?");
  if (confirmacao) {
    await fetch(`http://localhost:3333/schedules/${schedule.id}`, {
      method: "DELETE"
    });
    carregarAgendamentos();
  }
});
}