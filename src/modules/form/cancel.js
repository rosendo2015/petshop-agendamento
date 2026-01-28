import { schedulesDay } from "../schedules/load.js";
import { scheduleCancel } from "../../services/schedule-cancel.js";

const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", async (event) => {
    if (event.target.tagName === "A" && event.target.closest(".remover")) {
      const id = event.target.dataset.id;
      if (id) {
        const isConfirm = confirm("Deseja realmente cancelar o agendamento?");
        if (isConfirm) {
          await scheduleCancel({ id });
          schedulesDay();
        }
      }
    }
  });
});