/* ============================================================
   ROSETTA REPORTES · Lógica del landing
   Lista todas las semanas publicadas leyendo data/index.json
   ============================================================ */

const $ = (sel) => document.querySelector(sel);
const fmt = (n, d = 2) => Number(n).toFixed(d);

async function cargarIndice() {
  try {
    const response = await fetch('data/index.json');
    if (!response.ok) throw new Error('No se pudo cargar el índice');
    return await response.json();
  } catch (error) {
    console.error('Error cargando índice:', error);
    return null;
  }
}

async function cargarSemana(num) {
  try {
    const response = await fetch(`data/semana-${num}.json`);
    if (!response.ok) throw new Error(`Semana ${num} no encontrada`);
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function init() {
  const indice = await cargarIndice();
  if (!indice) {
    $('#weeks-grid').innerHTML = '<div class="empty-state"><div class="icon">⚠️</div><h3>No se pudo cargar el índice</h3><p>Verifica que exista el archivo data/index.json</p></div>';
    return;
  }

  // Meta info del proyecto
  $('#proyecto-nombre').textContent = indice.proyecto.nombre;
  $('#proyecto-ubicacion').textContent = indice.proyecto.ubicacion;
  $('#proyecto-duracion').textContent = `${indice.proyecto.total_semanas} semanas`;
  $('#proyecto-monto').textContent = '$' + (indice.proyecto.valor_total_mxn / 1000000).toFixed(2) + 'M MXN';

  // Cargar los datos de cada semana publicada
  const grid = $('#weeks-grid');
  const countEl = $('#weeks-count');

  if (!indice.semanas_publicadas || indice.semanas_publicadas.length === 0) {
    grid.innerHTML = '<div class="empty-state"><div class="icon">📋</div><h3>Aún no hay reportes publicados</h3><p>Los reportes semanales aparecerán aquí conforme se publiquen.</p></div>';
    countEl.textContent = '0 publicadas';
    return;
  }

  countEl.textContent = `${indice.semanas_publicadas.length} de ${indice.proyecto.total_semanas} publicadas`;

  // Cargar datos de cada semana en paralelo para mostrar stats
  const semanas = [...indice.semanas_publicadas].sort((a, b) => parseInt(a) - parseInt(b)); // antigua primero
  const datosPromesas = semanas.map(num => cargarSemana(num));
  const todosDatos = await Promise.all(datosPromesas);

  grid.innerHTML = '';
  semanas.forEach((num, i) => {
    const data = todosDatos[i];
    if (!data) return;

    const g = data.avance_global;
    const esUltima = i === semanas.length - 1;
    const variacionSign = g.variacion_pct >= 0 ? '+' : '';
    const variacionClass = g.variacion_pct >= 0 ? 'accent' : 'negative';

    const card = document.createElement('a');
    card.className = 'week-card fade-up';
    card.href = `semana.html?num=${num}`;
    card.innerHTML = `
      <div class="week-card-top">
        <div class="week-card-num">
          ${num}
          <small>Semana</small>
        </div>
        ${esUltima ? '<div class="week-card-badge">Reciente</div>' : ''}
      </div>
      <div class="week-card-date">${data.semana.periodo}</div>
      <div class="week-card-stats">
        <div class="week-card-stat">
          <span class="lbl">Programado</span>
          <span class="val">${fmt(g.programado_pct)}%</span>
        </div>
        <div class="week-card-stat">
          <span class="lbl">Real</span>
          <span class="val accent">${fmt(g.real_pct)}%</span>
        </div>
        <div class="week-card-stat">
          <span class="lbl">Var.</span>
          <span class="val ${variacionClass}">${variacionSign}${fmt(g.variacion_pct)}%</span>
        </div>
      </div>
      <div class="week-card-arrow">→</div>
    `;
    grid.appendChild(card);
  });

  // Animaciones
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
}

document.addEventListener('DOMContentLoaded', init);
