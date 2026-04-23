/* ============================================================
   ROSETTA REPORTES · Lógica del reporte semanal
   Carga un JSON según ?num=XX en la URL y renderiza todo
   ============================================================ */

// ============ UTILIDADES ============
const $ = (sel) => document.querySelector(sel);
const fmt = (n, d = 2) => Number(n).toFixed(d);
const fmtMoney = (n) => {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// ============ OBTENER SEMANA DE LA URL ============
function obtenerNumSemana() {
  const params = new URLSearchParams(window.location.search);
  const num = params.get('num');
  if (!num) return null;
  return num.padStart(2, '0'); // "2" -> "02"
}

// ============ CARGAR DATOS ============
async function cargarReporte(numSemana) {
  try {
    const response = await fetch(`data/semana-${numSemana}.json`);
    if (!response.ok) throw new Error('Reporte no encontrado');
    return await response.json();
  } catch (error) {
    console.error('Error cargando reporte:', error);
    return null;
  }
}

// ============ RENDERIZAR HERO ============
function renderHero(data) {
  $('#hero-semana-num').textContent = data.semana.numero;
  $('#hero-proyecto').textContent = data.proyecto.nombre;
  $('#hero-ubicacion').textContent = data.proyecto.ubicacion;
  $('#hero-gerencia').textContent = data.proyecto.gerencia;
  $('#hero-periodo').textContent = data.semana.periodo;
  document.title = `${data.proyecto.nombre_corto} · Semana ${data.semana.numero} | Metta`;
}

// ============ RENDERIZAR KPIs GLOBAL ============
function renderKPIs(data) {
  const g = data.avance_global;
  $('#kpi-programado').dataset.target = g.programado_pct;
  $('#kpi-real').dataset.target = g.real_pct;
  $('#kpi-variacion').dataset.target = Math.abs(g.variacion_pct);

  $('#kpi-programado-money').textContent = fmtMoney(g.programado_mxn) + ' MXN';
  $('#kpi-real-money').textContent = fmtMoney(g.real_mxn) + ' MXN';

  const diff = g.real_mxn - g.programado_mxn;
  const tipo = diff >= 0 ? 'adelanto' : 'atraso';
  $('#kpi-variacion-money').textContent = fmtMoney(Math.abs(diff)) + ' ' + tipo;

  // Clases dinámicas de color según signo
  const varEl = $('#kpi-variacion');
  const varParent = varEl.parentElement;
  varParent.classList.remove('positive', 'negative');
  varParent.classList.add(g.variacion_pct >= 0 ? 'positive' : 'negative');

  const realParent = $('#kpi-real').parentElement;
  realParent.classList.remove('positive', 'negative');
  if (g.variacion_pct > 0) realParent.classList.add('positive');
  if (g.variacion_pct < 0) realParent.classList.add('negative');

  // Signo del prefijo de variación
  $('#kpi-variacion-sign').textContent = g.variacion_pct >= 0 ? '+' : '-';
}

// ============ RENDERIZAR ACTIVIDADES ============
function renderActividades(data) {
  const semActual = data.semana.numero;
  const semSig = String(parseInt(semActual) + 1).padStart(2, '0');
  $('#act-realizadas-sub').textContent = `Semana ${semActual}`;
  $('#act-programadas-sub').textContent = `Semana ${semSig}`;

  const ulRealizadas = $('#act-realizadas-list');
  const ulProgramadas = $('#act-programadas-list');

  ulRealizadas.innerHTML = data.actividades.realizadas.length
    ? data.actividades.realizadas.map(a => `<li>${a}</li>`).join('')
    : '<li style="color:var(--ink-mute);font-style:italic">Sin actividades registradas</li>';

  ulProgramadas.innerHTML = data.actividades.programadas.length
    ? data.actividades.programadas.map(a => `<li>${a}</li>`).join('')
    : '<li style="color:var(--ink-mute);font-style:italic">Sin actividades programadas</li>';
}

// ============ RENDERIZAR PROBLEMAS CRÍTICOS ============
function renderProblemas(data) {
  const tbody = $('#problemas-tbody');
  if (!data.problemas || !data.problemas.length) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--ink-mute);font-style:italic;padding:2rem">Sin problemas críticos registrados esta semana</td></tr>';
    return;
  }

  tbody.innerHTML = data.problemas.map(p => {
    const statusClass = p.estatus.toLowerCase().includes('observ') ? 'status-observado' : 'status-tramitado';
    return `
      <tr>
        <td>${p.descripcion}</td>
        <td><span class="status-badge ${statusClass}">${p.estatus}</span></td>
        <td class="mono">${p.fecha_limite || '—'}</td>
        <td>${p.responsable}</td>
      </tr>
    `;
  }).join('');
}

// ============ RENDERIZAR AVANCE POR LOTE ============
function renderAvanceLotes(data) {
  const lista = $('#lotes-list');
  lista.innerHTML = '';

  // Orden según definido en el JSON, o el default
  const orden = data.orden_lotes || Object.keys(data.lotes);

  orden.forEach(num => {
    const d = data.lotes[num];
    if (!d) return;

    const progPct = d.programado;
    const realPct = d.real;
    const varClass = d.variacion >= 0 ? 'pos' : 'neg';
    const varSign = d.variacion >= 0 ? '+' : '';

    const card = document.createElement('div');
    card.className = 'lote-card fade-up';
    card.innerHTML = `
      <div class="lote-identity">
        <div class="name">Lote ${num}</div>
        <div class="modelo">${d.modelo}</div>
        <div class="mza">Manzana ${d.mza}</div>
      </div>
      <div class="bars-stack">
        <div class="bar-row">
          <span class="bar-tag">Programado</span>
          <div class="bar-container"><div class="bar-fill prog" data-width="${progPct}"></div></div>
          <span class="bar-value">${fmt(d.programado)}%</span>
        </div>
        <div class="bar-row">
          <span class="bar-tag">Real</span>
          <div class="bar-container"><div class="bar-fill real" data-width="${realPct}"></div></div>
          <span class="bar-value">${fmt(d.real)}%</span>
        </div>
      </div>
      <div class="variation-pill">
        <div class="lbl">Variación</div>
        <div class="val ${varClass}">${varSign}${fmt(d.variacion)}%</div>
      </div>
    `;
    lista.appendChild(card);
  });
}

// ============ RENDERIZAR CURVA S + DONA ============
function renderGraficas(data) {
  const g = data.avance_global;
  const cf = data.curva_financiera;

  // Dona stats
  $('#dona-programado').textContent = fmt(g.programado_pct) + '%';
  $('#dona-real').textContent = fmt(g.real_pct) + '%';
  const varSign = g.variacion_pct >= 0 ? '+' : '';
  const adelantoEl = $('#dona-adelanto');
  adelantoEl.textContent = `${varSign}${fmt(g.variacion_pct)}%`;
  adelantoEl.classList.remove('accent', 'green');
  adelantoEl.classList.add(g.variacion_pct >= 0 ? 'green' : 'negative');

  // Subtítulo del gráfico
  const totalSemanas = cf.programado.length - 1;
  $('#curvaS-sub').textContent = `${totalSemanas} semanas · ${fmtMoney(cf.valor_total_mxn)} MXN`;
  $('#dona-sub').textContent = `Semana ${data.semana.numero} de ${totalSemanas}`;

  // Labels del eje X
  const semanas = ['Inicio', ...Array.from({length: totalSemanas}, (_, i) => `S${i+1}`)];

  // Chart Curva S
  new Chart($('#curvaS').getContext('2d'), {
    type: 'line',
    data: {
      labels: semanas,
      datasets: [
        { label: 'Programado', data: cf.programado, borderColor: '#1d1d1f', backgroundColor: 'rgba(29,29,31,0.04)', borderWidth: 2, tension: 0.35, fill: true, pointRadius: 0, pointHoverRadius: 5 },
        { label: 'Real', data: cf.real, borderColor: '#0077c2', backgroundColor: 'transparent', borderWidth: 2.5, tension: 0.3, fill: false, pointRadius: 4, pointBackgroundColor: '#0077c2' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'top', align: 'end', labels: { font: { family: 'Inter', size: 11, weight: '500' }, boxWidth: 10, boxHeight: 10, usePointStyle: true, color: '#424245' } },
        tooltip: { backgroundColor: '#1d1d1f', titleFont: { family: 'Inter', size: 12, weight: '600' }, bodyFont: { family: 'JetBrains Mono', size: 11 }, padding: 10, cornerRadius: 8,
          callbacks: { label: (ctx) => ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(2) + '%' } }
      },
      scales: {
        y: { beginAtZero: true, max: 100, ticks: { callback: (v) => v + '%', font: { family: 'JetBrains Mono', size: 10 }, color: '#86868b' }, grid: { color: '#f0f0f2' } },
        x: { ticks: { font: { family: 'JetBrains Mono', size: 9 }, color: '#86868b', maxRotation: 0, autoSkip: true, maxTicksLimit: 12 }, grid: { display: false } }
      }
    }
  });

  // Chart Dona
  new Chart($('#donaChart').getContext('2d'), {
    type: 'doughnut',
    data: { labels: ['Ejecutado', 'Por ejecutar'], datasets: [{ data: [g.real_pct, 100 - g.real_pct], backgroundColor: ['#0077c2', '#e5e5e7'], borderWidth: 0, cutout: '78%' }] },
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false },
        tooltip: { backgroundColor: '#1d1d1f', padding: 10, cornerRadius: 8, callbacks: { label: (ctx) => ctx.label + ': ' + ctx.parsed.toFixed(2) + '%' } } } }
  });
}

// ============ RENDERIZAR ABASTECIMIENTOS ============
function renderAbastecimientos(data) {
  const tbody = $('#abast-tbody');
  const semActual = data.semana.numero;
  const semPrev = String(parseInt(semActual) - 1).padStart(2, '0');
  tbody.innerHTML = '';

  const statusClass = (s) => {
    const l = s.toLowerCase();
    if (l.includes('suministrado')) return 'status-sum';
    if (l.includes('proceso')) return 'status-proc';
    return 'status-sol';
  };

  const impClass = (i) => {
    const l = i.toLowerCase();
    if (l === 'alta') return 'importance-alta';
    if (l === 'media') return 'importance-media';
    return 'importance-baja';
  };

  // Sección entregados (semana anterior)
  if (data.abastecimientos.entregados && data.abastecimientos.entregados.length) {
    tbody.innerHTML += `<tr><td colspan="4" class="abast-subheader">Semana ${semPrev} · Entregados</td></tr>`;
    tbody.innerHTML += `<tr>
      <th>Concepto</th><th>Fecha requerida</th><th>Estatus</th><th>Importancia</th>
    </tr>`;
    data.abastecimientos.entregados.forEach(a => {
      tbody.innerHTML += `
        <tr>
          <td>${a.concepto}</td>
          <td class="mono">${a.fecha_requerida}</td>
          <td><span class="${statusClass(a.estatus)}">${a.estatus}</span></td>
          <td class="${impClass(a.importancia)}">${a.importancia}</td>
        </tr>
      `;
    });
  }

  // Sección programados
  if (data.abastecimientos.programados && data.abastecimientos.programados.length) {
    tbody.innerHTML += `<tr><td colspan="4" class="abast-subheader">Programados para siguientes semanas</td></tr>`;
    data.abastecimientos.programados.forEach(a => {
      tbody.innerHTML += `
        <tr>
          <td>${a.concepto}</td>
          <td class="mono">${a.fecha_requerida}</td>
          <td><span class="${statusClass(a.estatus)}">${a.estatus}</span></td>
          <td class="${impClass(a.importancia)}">${a.importancia}</td>
        </tr>
      `;
    });
  }
}

// ============ RENDERIZAR GRID DE BOTONES DE LOTE ============
function renderBotonesLote(data) {
  const grid = $('#lotes-grid-btns');
  grid.innerHTML = '';

  const orden = data.orden_lotes || Object.keys(data.lotes);

  orden.forEach((num, i) => {
    const d = data.lotes[num];
    if (!d) return;
    const delay = i % 3;

    const btn = document.createElement('button');
    btn.className = `lote-btn fade-up delay-${delay}`;
    btn.dataset.lote = num;
    btn.innerHTML = `
      <div class="lote-btn-header">
        <div class="lote-btn-num">
          ${num}
          <small>Lote · Mza ${d.mza}</small>
        </div>
        <div class="lote-btn-modelo">${d.modelo}</div>
      </div>
      <div class="lote-btn-stats">
        <div class="lote-btn-stat">
          <span class="lote-btn-stat-lbl">Programado</span>
          <span class="lote-btn-stat-val">${fmt(d.programado)}%</span>
        </div>
        <div class="lote-btn-stat">
          <span class="lote-btn-stat-lbl">Real</span>
          <span class="lote-btn-stat-val accent">${fmt(d.real)}%</span>
        </div>
      </div>
      <div class="lote-btn-arrow">→</div>
    `;
    btn.addEventListener('click', () => abrirPanel(num, data));
    grid.appendChild(btn);
  });
}

// ============ PANEL LATERAL + LIGHTBOX ============
let currentPhotos = [];
let currentPhotoIdx = 0;

function abrirPanel(num, data) {
  const d = data.lotes[num];
  if (!d) return;
  const varSign = d.variacion >= 0 ? '+' : '';
  const varColor = d.variacion >= 0 ? 'pos' : 'neg';
  const semNum = data.semana.numero;

  $('#panel-eyebrow').textContent = `${d.modelo} · Manzana ${d.mza}`;
  $('#panel-title').textContent = `Lote ${num}`;

  const actividadesLote = d.actividades || [];
  const actividadesHtml = actividadesLote.length
    ? `<ul class="panel-activities">${actividadesLote.map(a => `<li>${a}</li>`).join('')}</ul>`
    : `<div class="panel-activities empty">Sin actividades importantes registradas esta semana</div>`;

  const photos = [1, 2, 3, 4].map(i => {
    const fn = `img-lote${num}-sem${semNum}-0${i}.jpg`;
    return { src: `fotos/semana-${semNum}/lote-${num}/${fn}`, filename: fn };
  });

  $('#panel-body').innerHTML = `
    <div class="panel-stats">
      <div class="panel-stat"><div class="lbl">Programado</div><div class="val">${fmt(d.programado)}%</div></div>
      <div class="panel-stat"><div class="lbl">Real</div><div class="val accent">${fmt(d.real)}%</div></div>
      <div class="panel-stat"><div class="lbl">Variación</div><div class="val ${varColor}">${varSign}${fmt(d.variacion)}%</div></div>
    </div>

    <div class="panel-section-title">Actividades importantes</div>
    ${actividadesHtml}

    <div class="panel-section-title">Reporte fotográfico</div>
    <div class="photos-col">
      ${photos.map((p, idx) => `
        <div class="photo-slot" data-idx="${idx}">
          <img src="${p.src}" alt="Lote ${num} - foto ${idx+1}" onload="this.nextElementSibling.style.display='none'" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="photo-placeholder" style="display:flex">
            <div class="icon">📷</div>
            <div class="filename">${p.filename}</div>
            <div class="note">Pendiente de carga</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  $('#panel-body').querySelectorAll('.photo-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const img = slot.querySelector('img');
      if (img && img.complete && img.naturalHeight > 0) {
        currentPhotos = photos;
        currentPhotoIdx = parseInt(slot.dataset.idx);
        actualizarLightbox();
        $('#lightbox').classList.add('open');
      }
    });
  });

  $('#panel').classList.add('open');
  $('#overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function cerrarPanel() {
  $('#panel').classList.remove('open');
  $('#overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function actualizarLightbox() {
  $('#lightbox-img').src = currentPhotos[currentPhotoIdx].src;
  $('#lightbox-counter').textContent = `${currentPhotoIdx + 1} / ${currentPhotos.length}`;
}

function cerrarLightbox() { $('#lightbox').classList.remove('open'); }

// ============ ANIMACIONES ON SCROLL ============
function configurarAnimaciones() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        entry.target.querySelectorAll('.bar-fill').forEach(bar => {
          setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, 150);
        });

        entry.target.querySelectorAll('.counter').forEach(el => {
          if (el.dataset.animated) return;
          el.dataset.animated = 'true';
          const target = parseFloat(el.dataset.target);
          const decimals = parseInt(el.dataset.decimals || '2');
          const duration = 1400;
          const start = performance.now();
          const animate = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = (target * eased).toFixed(decimals);
            if (t < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        });

        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
}

// ============ INIT ============
async function init() {
  const num = obtenerNumSemana();
  if (!num) {
    document.body.innerHTML = '<div class="loading">Parámetro ?num= no especificado. Redirigiendo...</div>';
    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    return;
  }

  const data = await cargarReporte(num);
  if (!data) {
    document.body.innerHTML = `
      <div class="loading" style="flex-direction:column;gap:1rem;padding:6rem 2rem">
        <div style="font-size:2rem">📄</div>
        <div>No se encontró el reporte de la semana ${num}</div>
        <a href="index.html" style="color:var(--accent);text-decoration:none;font-weight:600">← Volver al índice</a>
      </div>
    `;
    return;
  }

  renderHero(data);
  renderKPIs(data);
  renderActividades(data);
  renderProblemas(data);
  renderAvanceLotes(data);
  renderGraficas(data);
  renderAbastecimientos(data);
  renderBotonesLote(data);
  configurarAnimaciones();

  // Footer dinámico
  $('#footer-info').textContent = `Reporte Semana ${data.semana.numero} · ${data.proyecto.nombre_corto} · Generado ${data.semana.fecha_generacion || ''}`;

  // Listeners globales
  $('#panel-close').addEventListener('click', cerrarPanel);
  $('#overlay').addEventListener('click', cerrarPanel);
  $('#lightbox-close').addEventListener('click', cerrarLightbox);
  $('#lightbox-prev').addEventListener('click', () => {
    currentPhotoIdx = (currentPhotoIdx - 1 + currentPhotos.length) % currentPhotos.length;
    actualizarLightbox();
  });
  $('#lightbox-next').addEventListener('click', () => {
    currentPhotoIdx = (currentPhotoIdx + 1) % currentPhotos.length;
    actualizarLightbox();
  });
  $('#lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') cerrarLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if ($('#lightbox').classList.contains('open')) cerrarLightbox();
      else cerrarPanel();
    }
    if ($('#lightbox').classList.contains('open')) {
      if (e.key === 'ArrowLeft') $('#lightbox-prev').click();
      if (e.key === 'ArrowRight') $('#lightbox-next').click();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
