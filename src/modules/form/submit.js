import dayjs from "dayjs";
import { schedulesDay } from "../schedules/load.js";
import { scheduleNew } from "../../services/schedule-new.js";

const form = document.querySelector("form");

form.onsubmit = async (event) => {
  event.preventDefault();

  const tutor = document.getElementById("tutor").value.trim();
  const pet = document.getElementById("pet").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const service = document.getElementById("service-description").value.trim();
  const date = document.getElementById("date").value;
  const hour = document.getElementById("hour").value;

  if (!tutor || !pet || !service || !date || !hour) {
    return alert("Preencha todos os campos!");
  }

  const when = dayjs(`${date} ${hour}`).toISOString();
  const id = new Date().getTime();

  await scheduleNew({ id, tutor, pet, phone, service, when });
  await schedulesDay();

  form.reset();
  document.querySelector(".modal").classList.remove("active");
};