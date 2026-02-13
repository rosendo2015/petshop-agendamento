const fs = require("fs");
const dayjs = require("dayjs");

const startDate = dayjs("2026-02-13");
const endDate = dayjs("2026-12-31");

const tutors = ["Junior", "Maria", "Carlos", "Fernanda", "João", "Patrícia", "Mateus", "Juliana", "Rodrigo", "Larissa"];
const pets = ["Tigrero", "Mimimi", "Bidu", "Pingo", "Lili", "Maya", "Kira", "Lola", "Spike", "Nico"];
const servicos = ["Banho", "Tosa", "Vacina", "Consulta", "Ração", "Vermifugação"];

let schedules = [];
let idCounter = 1000;

for (let d = startDate; d.isBefore(endDate) || d.isSame(endDate); d = d.add(1, "day")) {
  // gerar 1 a 3 agendamentos por dia
  const qtd = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < qtd; i++) {
    const hora = 8 + Math.floor(Math.random() * 13); // entre 8h e 20h
    const minuto = Math.random() > 0.5 ? "00" : "30";

    schedules.push({
      id: "id" + (idCounter++),
      data: d.format("YYYY-MM-DD"),
      hora: `${hora.toString().padStart(2, "0")}:${minuto}`,
      tutor: tutors[Math.floor(Math.random() * tutors.length)],
      pet: pets[Math.floor(Math.random() * pets.length)],
      telefone: "(85) 9" + Math.floor(100000000 + Math.random() * 899999999),
      servico: servicos[Math.floor(Math.random() * servicos.length)]
    });
  }
}

// limitar a 300 registros
schedules = schedules.slice(0, 300);

fs.writeFileSync("server.json", JSON.stringify({ schedules }, null, 2));
