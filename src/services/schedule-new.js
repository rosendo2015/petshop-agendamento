import { apiConfig } from "./api-config.js";

export async function scheduleNew({ id, tutor, pet, phone, service, when }) {
  try {
    await fetch(`${apiConfig.baseURL}/schedules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, tutor, pet, phone, service, when })
    });
    alert("Agendamento realizado com sucesso!");
  } catch (error) {
    console.log(error);
    alert("Não foi possível agendar. Tente mais tarde.");
  }
}