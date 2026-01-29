import { schedulesDay } from "../schedules/load.js";

// Lista de datas disponíveis (pode ser dinâmica futuramente)
const availableDates = [
  "2026-01-27",
  "2026-01-28"  
];

const dateSelector = document.getElementById("date-selector");

export function setupDateSelector() {
  // Preenche o select com as datas
  availableDates.forEach(date => {
    const option = document.createElement("option");
    option.value = date;
    option.textContent = formatDate(date);
    dateSelector.appendChild(option);
  });

  // Define a data inicial
  dateSelector.value = availableDates[0];

  // Atualiza input de data invisível (usado pelo sistema)
  const inputDate = document.getElementById("date");
  inputDate.value = availableDates[0];

  // Reage à mudança de data
  dateSelector.onchange = () => {
    inputDate.value = dateSelector.value;
    schedulesDay();
  };
}

// Formata para dd/mm/yyyy
function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}