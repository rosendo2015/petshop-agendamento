import dayjs from "dayjs";

// Seleciona os containers de cada período
const periodMorning = document.querySelector(".card:nth-of-type(1)");
const periodAfternoon = document.querySelector(".card:nth-of-type(2)");
const periodNight = document.querySelector(".card:nth-of-type(3)");

export function schedulesShow({ dailySchedules }) {
  try {
    // Limpa os agendamentos existentes
    periodMorning.querySelectorAll(".agendamentos").forEach(el => el.remove());
    periodAfternoon.querySelectorAll(".agendamentos").forEach(el => el.remove());
    periodNight.querySelectorAll(".agendamentos").forEach(el => el.remove());

    // Renderiza cada agendamento
    dailySchedules.forEach((schedule) => {
      const item = document.createElement("div");
      item.classList.add("agendamentos");
      item.setAttribute("data-id", schedule.id);

      // Wrapper com horário e identificação
      const wrapperInfo = document.createElement("div");
      wrapperInfo.classList.add("wrapper-info");

      const horario = document.createElement("div");
      horario.classList.add("horario");
      horario.innerHTML = `<span>${dayjs(schedule.when).format("HH:mm")}</span>`;

      const identification = document.createElement("div");
      identification.classList.add("identification");
      identification.innerHTML = `<span>${schedule.pet}</span><span>/</span><span>${schedule.tutor}</span>`;

      wrapperInfo.append(horario, identification);

      // Serviço
      const servico = document.createElement("div");
      servico.classList.add("servico");
      servico.innerHTML = `<span>${schedule.service}</span>`;

      // Botão de remover
      const remover = document.createElement("div");
      remover.classList.add("remover");
      remover.innerHTML = `<a href="#" data-id="${schedule.id}">Remover agendamento</a>`;

      // Monta o item
      item.append(wrapperInfo, servico, remover);

      // Decide em qual período inserir
      const hour = dayjs(schedule.when).hour();
      if (hour >= 9 && hour <= 12) {
        periodMorning.appendChild(item);
      } else if (hour > 12 && hour <= 18) {
        periodAfternoon.appendChild(item);
      } else {
        periodNight.appendChild(item);
      }
    });
  } catch (error) {
    alert("Não foi possível exibir os agendamentos.");
    console.log(error);
  }
}