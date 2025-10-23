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

  // Animación de hora actual: añade clase `now` a la celda correspondiente.
  // Modo de prueba: fuerza una fila/columna como "actual". Úsalo solo temporalmente.
  // Para la prueba que pediste: Jueves a las 17:00 -> dayIndex = 3 (0=Lunes), slotIndex = 2 (17:00-18:00)
  const TEST_OVERRIDE = { enabled: false, dayIndex: 3, slotIndex: 2 };

  function clearNowClasses(){
    document.querySelectorAll('#schedule td.now').forEach(n=> n.classList.remove('now'));
  }

  function getCurrentSlotIndex(){
    // Determinar la franja horaria actual según HORARIO.times
    const now = new Date();
    const minutes = now.getHours()*60 + now.getMinutes();
    for(let i=0;i<HORARIO.times.length;i++){
      const range = HORARIO.times[i].split('-').map(s=>s.trim());
      const startParts = range[0].split(':').map(Number);
      const endParts = range[1].split(':').map(Number);
      const startMin = startParts[0]*60 + startParts[1];
      const endMin = endParts[0]*60 + endParts[1];
      if(minutes >= startMin && minutes < endMin) return i;
    }
    return -1;
  }

  function applyNowAnimation(){
    clearNowClasses();
    const table = document.querySelector('#schedule table');
    if(!table) return;
    const rows = table.querySelectorAll('tbody tr');
    // Si TEST_OVERRIDE está activo, usar slot y day específicos
    if(TEST_OVERRIDE && TEST_OVERRIDE.enabled){
      const s = TEST_OVERRIDE.slotIndex;
      const dayCol = TEST_OVERRIDE.dayIndex + 1; // porque col 0 es la hora
      if(rows[s]){
        const row = rows[s];
        const target = row.querySelectorAll('td')[dayCol];
        if(target && target.textContent.trim()){
          target.classList.add('now');
          // comprobar siguiente franja en la misma columna
          if(rows[s+1]){
            const nextCell = rows[s+1].querySelectorAll('td')[dayCol];
            if(nextCell && nextCell.textContent.trim() && nextCell.textContent.trim() === target.textContent.trim()){
              nextCell.classList.add('now');
            }
          }
        }
      }
      return;
    }

    const idx = getCurrentSlotIndex();
    if(idx === -1) return;
    if(!rows[idx]) return;
    const currentRow = rows[idx];
    const cells = currentRow.querySelectorAll('td'); // primer td es la hora
    // cells[1] corresponde al Lunes, etc.
    for(let col=1; col<cells.length; col++){
      const cell = cells[col];
      const currentText = cell.textContent.trim();
      if(!currentText) continue;
      // marca actual
      cell.classList.add('now');
      // comprobar siguiente franja para la misma columna
      if(rows[idx+1]){
        const nextCell = rows[idx+1].querySelectorAll('td')[col];
        if(nextCell){
          const nextText = nextCell.textContent.trim();
          if(nextText && nextText === currentText){
            nextCell.classList.add('now');
          }
        }
      }
    }
  }

  // Inicializar y refrescar cada 30s
  applyNowAnimation();
  setInterval(applyNowAnimation, 30*1000);
});