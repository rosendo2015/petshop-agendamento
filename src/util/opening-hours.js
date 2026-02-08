import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

export function gerarHorarios(inicio = "09:00", fim = "21:00", intervaloMinutos = 30, ocupados = [], dataSelecionada) {
  const horarios = [];
  let horaAtual = dayjs(inicio, "HH:mm");
  const horaFim = dayjs(fim, "HH:mm");

  // pega o dia selecionado e o horário atual
  const hoje = dayjs();
  const diaSelecionado = dayjs(dataSelecionada, "YYYY-MM-DD");

  while (horaAtual.isBefore(horaFim) || horaAtual.isSame(horaFim)) {
    const horaFormatada = horaAtual.format("HH:mm");

    // monta objeto datetime completo (data + hora)
    const horarioCompleto = dayjs(`${dataSelecionada} ${horaFormatada}`, "YYYY-MM-DD HH:mm");

    // regra: bloquear intervalo 12:00–13:00 e 18:00–19:00
    const horaNum = parseInt(horaAtual.format("HH"), 10);
    const minutoNum = parseInt(horaAtual.format("mm"), 10);
    const dentroDoAlmoco = horaNum === 12 || (horaNum === 13 && minutoNum === 0);
    const dentroDoIntervaloTarde = horaNum === 18 || (horaNum === 19 && minutoNum === 0);

    // só adiciona se não estiver ocupado, não for intervalo bloqueado e não tiver passado
    if (!dentroDoAlmoco && !dentroDoIntervaloTarde) {
      if (!ocupados.includes(horaFormatada) && horarioCompleto.isAfter(hoje)) {
        horarios.push(horaFormatada);
      }
    }

    horaAtual = horaAtual.add(intervaloMinutos, "minute");
  }

  return horarios;
}