import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

export function gerarHorarios(inicio = "09:00", fim = "21:00", intervaloMinutos = 30, ocupados = []) {
  const horarios = [];
  let horaAtual = dayjs(inicio, "HH:mm");
  const horaFim = dayjs(fim, "HH:mm");

  while (horaAtual.isBefore(horaFim) || horaAtual.isSame(horaFim)) {
    const horaFormatada = horaAtual.format("HH:mm");

    // regra: bloquear intervalo 12:00–13:00 e 18:00–19:00
    const horaNum = parseInt(horaAtual.format("HH"), 10);
    const minutoNum = parseInt(horaAtual.format("mm"), 10);

    const dentroDoAlmoco = horaNum === 12 || (horaNum === 13 && minutoNum === 0);
    const dentroDoIntervaloTarde = horaNum === 18 || (horaNum === 19 && minutoNum === 0);

    if (!dentroDoAlmoco && !dentroDoIntervaloTarde) {
      if (!ocupados.includes(horaFormatada)) {
        horarios.push(horaFormatada);
      }
    }

    horaAtual = horaAtual.add(intervaloMinutos, "minute");
  }

  return horarios;
}