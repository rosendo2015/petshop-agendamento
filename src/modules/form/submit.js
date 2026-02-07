import dayjs from "dayjs";
import { gerarHorarios } from "../../util/opening-hours.js";

const selectHour = document.querySelector(".modal-content #hour");
const inputDateModal = document.querySelector(".modal-content #date");
const inputDateSelector = document.getElementById("date-selector");
const formAgendamento = document.querySelector(".modal-content");
const dateSelector = document.getElementById("date-selector")

dateSelector.value = dayjs(new Date()).format('YYYY-MM-DD')
inputDateModal.value = dayjs(new Date()).format('YYYY-MM-DD')
inputDateModal.min = dayjs(new Date()).format('YYYY-MM-DD')

// Buscar agendamentos da API
async function buscarAgendamentos(dataSelecionada) {
  const response = await fetch(`http://localhost:3333/schedules?data=${dataSelecionada}`);
  const agendamentos = await response.json();
  return agendamentos;
}

// Atualizar horários disponíveis (apenas no modal)
async function atualizarHorarios(dataSelecionada) {
  const agendamentos = await buscarAgendamentos(dataSelecionada);
  const ocupados = agendamentos.map(a => a.hora);
  const horariosDisponiveis = gerarHorarios("08:00", "22:00", 30, ocupados);

  selectHour.innerHTML = "";

  if (horariosDisponiveis.length === 0) {
    const option = document.createElement("option");
    option.textContent = "Nenhum horário disponível";
    option.disabled = true;
    selectHour.appendChild(option);
    return;
  }

  horariosDisponiveis.forEach(hora => {
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
  document.getElementById("period-morning").innerHTML = "";
  document.getElementById("period-afternoon").innerHTML = "";
  document.getElementById("period-night").innerHTML = "";

  agendamentos.forEach(a => {
    const li = document.createElement("li");
    li.classList.add("agendamentos");
    li.innerHTML = `
      <div class="wrapper-info">
        <div class="horario"><span>${a.hora}</span></div>
        <div class="identification">
          <span class="pet">${a.pet}</span>
          <span>/</span>
          <span class="tutor">${a.tutor}</span>
        </div>
      </div>
      <div class="servico">
        <span>${a.servico}</span>
      </div>
      <div class="remover">
        <a href="#" data-id="${a.id}">Remover agendamento</a>
      </div>
    `;

    const horaNum = parseInt(a.hora.split(":")[0], 10);
    if (horaNum >= 8 && horaNum < 12) {
      document.getElementById("period-morning").appendChild(li);
    } else if (horaNum >= 13 && horaNum < 18) {
      document.getElementById("period-afternoon").appendChild(li);
    } else if (horaNum >= 19 && horaNum <= 22) {
      document.getElementById("period-night").appendChild(li);
    }
  });
}

// Eventos
inputDateModal.addEventListener("change", e => {
  atualizarHorarios(e.target.value);
});

inputDateSelector.addEventListener("change", e => {
  atualizarCards(e.target.value);
});

// Inicializa
atualizarCards(inputDateSelector.value);
atualizarHorarios(inputDateModal.value);

// Salvar novo agendamento
async function salvarAgendamento(dados) {
  await fetch("http://localhost:3333/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
}




// Captura envio do formulário
formAgendamento.addEventListener("submit", async e => {
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
    servico: serviceInput.value
  };

  await salvarAgendamento(novoAgendamento);

  alert("Agendamento salvo com sucesso!");
  atualizarHorarios(inputDateModal.value);
  atualizarCards(inputDateSelector.value);

  // limpa e fecha modal
  formAgendamento.reset();
  document.getElementById("modal").style.display = "none";
});

async function removerAgendamento(id, dataSelecionada) {
  await fetch(`http://localhost:3333/schedules/${id}`, {
    method: "DELETE"
  });

  // Atualiza os cards e horários depois da remoção
  atualizarCards(dataSelecionada);
  atualizarHorarios(dataSelecionada);
}

document.addEventListener("click", e => {
  if (e.target.matches(".remover a")) {
    e.preventDefault();
    const id = e.target.getAttribute("data-id");
    const dataSelecionada = inputDateSelector.value; // pega a data atual dos cards
    removerAgendamento(id, dataSelecionada);
  }
});