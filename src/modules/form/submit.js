import dayjs from "dayjs";
const form = document.querySelector('form'); 

const selectedDate = document.getElementById('date');
const selectedTime = document.getElementById('hour'); 
const inputToday = dayjs().format('YYYY-MM-DD');
const inputTime = dayjs().format('HH:mm');
selectedDate.value = inputToday;
selectedDate.min = inputToday;
selectedTime.value = inputTime;
selectedTime.min = inputTime;

form.onsubmit = (event)=>{
    event.preventDefault();

    console.log('ENVIADO');
}