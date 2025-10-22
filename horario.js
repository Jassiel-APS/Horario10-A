// Horario data (Grupo 10°A-IDGS) - Septiembre-Diciembre 2025
const HORARIO = {
  times: [
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00"
  ],
  days: ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
  matrix: [
    ["","Inglés IX","","Inglés IX","", ""],
    ["Aplicaciones web progresivas (CC10/CECADEC)","Aplicaciones web progresivas (CC10/CECADEC)","Gestión Proc. Des. Soft (CC11/D4)","","Des. móvil integral (CC1/CEDIM)",""],
    ["Aplicaciones web progresivas (CC10/CECADEC)","Optativa I (CC11/D4)","Inglés IX (A5/D1)","Integradora (A6/D1)","Negociación empresarial (Sala 4 Doc 4)",""],
    ["Gestión Proc. Des. Soft (CC1/CEDIM)","Optativa I (CC11/D4)","Inglés IX (A5/D1)","Integradora (A6/D1)","Gestión Proc. Des. Soft (CC10/CECADEC)",""],
    ["Optativa I (CC11/D4)","Des. móvil integral (CA3/D4)","Negociación empresarial (A4/D1)","Des. móvil integral (CC2/CEDIM)","Gestión Proc. Des. Soft (CC10/CECADEC)",""],
    ["Des. móvil integral (CC2/CEDIM)","Des. móvil integral (CA3/D4)","Optativa I (CC11/D4)","Des. móvil integral (CC2/CEDIM)","",""]
  ]
};

function renderSchedule(filter = ''){
  const wrapper = document.getElementById('schedule');
  if(!wrapper) return;
  wrapper.innerHTML = '';
  const table = document.createElement('table');
  table.className = 'schedule-table';
  // header
  const thead = document.createElement('thead');
  const hRow = document.createElement('tr');
  hRow.appendChild(document.createElement('th')); // corner
  HORARIO.days.forEach(d => { const th = document.createElement('th'); th.textContent = d; hRow.appendChild(th); });
  thead.appendChild(hRow);
  table.appendChild(thead);
  // body
  const tbody = document.createElement('tbody');
  HORARIO.times.forEach((t, r) =>{
    const tr = document.createElement('tr');
    const timeCell = document.createElement('td'); timeCell.textContent = t; tr.appendChild(timeCell);
    HORARIO.days.forEach((_, c) =>{
      const td = document.createElement('td');
      const text = (HORARIO.matrix[r] && HORARIO.matrix[r][c]) ? HORARIO.matrix[r][c] : '';
      if(filter && !text.toLowerCase().includes(filter.toLowerCase())){
        td.innerHTML = '&nbsp;';
      } else {
        td.textContent = text;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrapper.appendChild(table);
}

document.addEventListener('DOMContentLoaded', ()=>{
  const input = document.getElementById('search');
  const clear = document.getElementById('clear');
  renderSchedule();
  if(input) input.addEventListener('input', ()=> renderSchedule(input.value));
  if(clear) clear.addEventListener('click', ()=>{ if(input) input.value=''; renderSchedule(); });
  // Print button
  const printBtn = document.getElementById('print');
  if(printBtn) printBtn.addEventListener('click', ()=> window.print());
  // Theme toggle (persist)
  const themeBtn = document.getElementById('theme');
  const current = localStorage.getItem('hu_theme');
  if(current === 'dark') document.body.classList.add('dark');
  if(themeBtn) themeBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('dark');
    localStorage.setItem('hu_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });
});