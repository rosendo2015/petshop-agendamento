import dayjs from "dayjs";
import { gerarHorarios } from "../../util/opening-hours.js";

const selectHour = document.querySelector(".modal-content #hour");
const inputDateModal = document.querySelector(".modal-content #date");
const inputDateSelector = document.getElementById("date-selector");
const formAgendamento = document.querySelector(".modal-content");
const dateSelector = document.getElementById("date-selector");

dateSelector.value = dayjs(new Date()).format("YYYY-MM-DD");
inputDateModal.value = dayjs(new Date()).format("YYYY-MM-DD");
inputDateModal.min = dayjs(new Date()).format("YYYY-MM-DD");

// Buscar agendamentos (lê server.json + mescla com alterações locais)
async function buscarAgendamentos(dataSelecionada) {
  const resp = await fetch('http://localhost:3333/schedules');
  const json = await resp.json();
  let agendamentos = Array.isArray(json.schedules) ? json.schedules : [];

  // mescla agendamentos salvos localmente (persistência no client)
  const local = JSON.parse(localStorage.getItem('localSchedules') || '[]');
  const removed = JSON.parse(localStorage.getItem('removedSchedules') || '[]');

  // aplica remoções locais
  agendamentos = agendamentos.filter(a => !removed.includes(a.id));

  // adiciona locais (não duplicar ids)
  const ids = new Set(agendamentos.map(a => a.id));
  local.forEach(a => { if (!ids.has(a.id)) agendamentos.push(a); });

  // filtra por data, se informada
  if (dataSelecionada) {
    agendamentos = agendamentos.filter(a => a.data === dataSelecionada);
  }

  return agendamentos;
}

// Atualizar horários disponíveis (apenas no modal)
async function atualizarHorarios(dataSelecionada) {
  const agendamentos = await buscarAgendamentos(dataSelecionada);
  const ocupados = agendamentos.map((a) => a.hora);
  const horariosDisponiveis = gerarHorarios(
    "08:00",
    "22:00",
    30,
    ocupados,
    dataSelecionada,
  );

  selectHour.innerHTML = "";

  if (horariosDisponiveis.length === 0) {
    const option = document.createElement("option");
    option.textContent = "Nenhum horário disponível";
    option.disabled = true;
    selectHour.appendChild(option);
    return;
  }

  horariosDisponiveis.forEach((hora) => {
    const option = document.createElement("option");
    option.value = hora;
    option.textContent = hora;
    selectHour.appendChild(option);
  });
}

// Atualizar cards (apenas pelo date-selector)
async function atualizarCards(dataSelecionada) {
  const agendamentos = await buscarAgendamentos(dataSelecionada);

  // limpa os ULs
  const morning = document.getElementById("period-morning");
  const afternoon = document.getElementById("period-afternoon");
  const night = document.getElementById("period-night");

  morning.innerHTML = "";
  afternoon.innerHTML = "";
  night.innerHTML = "";

  // separa por período
  const periodMorning = agendamentos.filter((a) => {
    const h = parseInt(a.hora.split(":")[0], 10);
    return h >= 8 && h < 13;
  });

  const periodAfternoon = agendamentos.filter((a) => {
    const h = parseInt(a.hora.split(":")[0], 10);
    return h >= 13 && h < 18;
  });

  const periodNight = agendamentos.filter((a) => {
    const h = parseInt(a.hora.split(":")[0], 10);
    return h >= 18 && h <= 22;
  });

  // função auxiliar para renderizar com separador
  function renderPeriod(list, container) {
    list.forEach((a, index) => {
      const li = document.createElement("li");
      li.classList.add("agendamentos");
      li.innerHTML = `
        <div class="wrapper-info">
          <div class="horario"><span>${a.hora}</span></div>
          <div class="identification">
            <span class="pet">${a.pet || "Sem nome"}</span>
            <span>/</span>
            <span class="tutor">${a.tutor || "Sem tutor"}</span>
          </div>
        </div>
        <div class="servico">
          <span>${a.servico || "Serviço não informado"}</span>
        </div>
        <div class="remover">
          <a href="#" data-id="${a.id}">Remover agendamento</a>
        </div>
      `;

      container.appendChild(li);

      // adiciona separador se houver mais de um e não for o último
      if (list.length > 1 && index < list.length - 1) {
        const divisor = document.createElement("div");
        divisor.classList.add("divisor");
        container.appendChild(divisor);
      }
    });
  }

  renderPeriod(periodMorning, morning);
  renderPeriod(periodAfternoon, afternoon);
  renderPeriod(periodNight, night);
}
// Eventos
inputDateModal.addEventListener("change", (e) => {
  atualizarHorarios(e.target.value);
});

inputDateSelector.addEventListener("change", (e) => {
  atualizarCards(e.target.value);
});

// Inicializa
atualizarCards(inputDateSelector.value);
atualizarHorarios(inputDateModal.value);

// Salvar novo agendamento
// Persiste o novo agendamento apenas no cliente (localStorage)
async function salvarAgendamento(dados) {
  const local = JSON.parse(localStorage.getItem('localSchedules') || '[]');
  const id = Date.now().toString(36);
  const novo = Object.assign({ id }, dados);
  local.push(novo);
  localStorage.setItem('localSchedules', JSON.stringify(local));
}

// Captura envio do formulário
formAgendamento.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tutorInput = formAgendamento.querySelector("#tutor");
  const petInput = formAgendamento.querySelector("#pet");
  const phoneInput = formAgendamento.querySelector("#phone");
  const serviceInput = formAgendamento.querySelector("#service-description");

  // validação: impedir envio vazio
  if (
    !tutorInput.value.trim() ||
    !petInput.value.trim() ||
    !phoneInput.value.trim() ||
    !serviceInput.value.trim() ||
    !inputDateModal.value ||
    !selectHour.value
  ) {
    alert("Por favor, preencha todos os campos antes de agendar.");
    return; // interrompe o envio
  }

  const novoAgendamento = {
    data: inputDateModal.value,
    hora: selectHour.value,
    tutor: tutorInput.value,
    pet: petInput.value,
    telefone: phoneInput.value,
    servico: serviceInput.value,
  };

  await salvarAgendamento(novoAgendamento);

  alert("Agendamento salvo com sucesso!");
  atualizarHorarios(inputDateModal.value);
  atualizarCards(inputDateSelector.value);

  // limpa e fecha modal
  formAgendamento.reset();
  document.getElementById("modal").style.display = "none";
});

// Remove agendamento localmente (marca remoção em localStorage)
async function removerAgendamento(id, dataSelecionada) {
  const removed = JSON.parse(localStorage.getItem('removedSchedules') || '[]');
  if (!removed.includes(id)) removed.push(id);
  localStorage.setItem('removedSchedules', JSON.stringify(removed));

  // também remove de localSchedules caso exista
  const local = JSON.parse(localStorage.getItem('localSchedules') || '[]');
  const filtered = local.filter(a => a.id !== id);
  localStorage.setItem('localSchedules', JSON.stringify(filtered));

  // Atualiza os cards e horários depois da remoção
  atualizarCards(dataSelecionada);
  atualizarHorarios(dataSelecionada);
}

document.addEventListener("click", (e) => {
  if (e.target.matches(".remover a")) {
    e.preventDefault();
    const id = e.target.getAttribute("data-id");
    const dataSelecionada = inputDateSelector.value; // pega a data atual dos cards
    removerAgendamento(id, dataSelecionada);
  }
});
