import dayjs from "dayjs";
import { apiConfig } from "./api-config.js";

export async function scheduleFetchByDay({ date }) {
  try {
    const response = await fetch(`${apiConfig.baseURL}/schedules`);
    if (!response.ok) throw new Error("Erro na resposta da API");

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Formato inválido");

    const dailySchedules = data.filter((schedule) =>
      dayjs(date).isSame(schedule.when, "day")
    );

    return dailySchedules;
  } catch (error) {
    console.log("Erro ao buscar agendamentos:", error);
    alert("Não foi possível buscar os agendamentos do dia selecionado.");
    return [];
  }
}