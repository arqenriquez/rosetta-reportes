# Manual · Publicar un reporte nuevo

Este manual explica cómo publicar el reporte de cualquier semana nueva. En promedio toma **~15 minutos** una vez que tengas el PDF original.

---

## 📋 Lo que necesitas antes de empezar

- ✅ El PDF del reporte semanal (como los que genera Metta normalmente)
- ✅ Las 4 fotos de cada lote (o las que tengas disponibles)
- ✅ Los datos actualizados de la curva S (opcional, solo si cambiaron)

---

## 🔢 Los 5 pasos

### Paso 1 · Copiar la plantilla JSON

En tu carpeta `data/`, **copia** el archivo `semana-02.json` (o el de la semana anterior más reciente) y **renómbralo** a la nueva semana.

Ejemplo: si vas a publicar la semana 03:

```
data/semana-02.json  →  copiar y renombrar  →  data/semana-03.json
```

> 💡 Siempre usa 2 dígitos: `semana-03.json`, `semana-12.json`, `semana-30.json`

---

### Paso 2 · Abrir el JSON y actualizar los datos

Abre el nuevo archivo (`semana-03.json` siguiendo el ejemplo) en VS Code y actualiza los campos. Aquí te digo qué cambiar:

#### 🏷️ Bloque "semana"
```json
"semana": {
  "numero": "03",                             ← cambiar
  "periodo": "20 al 26 de abril, 2026",       ← cambiar
  "fecha_generacion": "27 abril 2026"         ← cambiar
}
```

#### 📊 Bloque "avance_global"
Saca estos números del PDF, sección superior del reporte:

```json
"avance_global": {
  "programado_pct": 2.68,        ← % programado acumulado
  "real_pct": 4.12,              ← % real acumulado
  "variacion_pct": 1.44,         ← diferencia (real - programado)
  "programado_mxn": 162200.00,   ← monto programado en pesos
  "real_mxn": 249000.00          ← monto real en pesos
}
```

> ⚠️ **Importante:** el `variacion_pct` debe ser la resta (`real_pct - programado_pct`). Si es negativa, ponle signo menos: `-0.49`.

#### ✅ Bloque "actividades"
Las actividades son dos listas de texto. Cada elemento entre comillas separado por coma:

```json
"actividades": {
  "realizadas": [
    "Actividad realizada 1",
    "Actividad realizada 2"
  ],
  "programadas": [
    "Actividad programada 1",
    "Actividad programada 2",
    "Actividad programada 3"
  ]
}
```

#### ⚠️ Bloque "problemas"
Cada problema es un objeto con 4 campos:

```json
"problemas": [
  {
    "descripcion": "Descripción del problema...",
    "estatus": "Tramitado",                    ← usar: "Tramitado" u "Observado"
    "fecha_limite": "",                        ← puede ir vacío
    "responsable": "Metta / Casas Platino"
  }
]
```

> 💡 Si no hay problemas esta semana, déjalo como lista vacía: `"problemas": []`

#### 🏠 Bloque "lotes"
Aquí actualizas los 6 lotes. Cada uno lleva:

```json
"10": {
  "modelo": "Horus",             ← no cambia (Horus, Osiris, etc.)
  "mza": "723",                  ← no cambia
  "programado": 9.80,            ← % programado acumulado del lote
  "real": 10.25,                 ← % real acumulado del lote
  "variacion": 0.45,             ← diferencia (real - programado)
  "actividades": [
    "Actividad importante 1",
    "Actividad importante 2"
  ]
}
```

> 💡 Si un lote no tuvo actividades importantes esa semana, deja: `"actividades": []`

#### 📈 Bloque "curva_financiera"
Este SÍ se actualiza cada semana, pero solo agregas un valor más al array `real`:

```json
"curva_financiera": {
  "valor_total_mxn": 6050000,
  "programado": [0, 0.45, 1.52, 3.2, 5.8, 9.5, ...],
  "real": [0, 0.65, 2.68, 4.12]          ← agregar el nuevo valor al final
}
```

> 💡 El array `programado` debe tener **33 valores** (Inicio + 32 semanas). El array `real` crece semana a semana: después de la semana 3 tendrá 4 valores, en la semana 5 tendrá 6, etc.

#### 📦 Bloque "abastecimientos"
Dos listas: `entregados` (los de la semana anterior) y `programados` (los de las próximas semanas).

```json
"abastecimientos": {
  "entregados": [
    {
      "concepto": "Material X",
      "fecha_requerida": "23-abr",
      "estatus": "Suministrado",          ← usar: "Suministrado"
      "importancia": "Alta"                ← usar: "Alta", "Media" o "Baja"
    }
  ],
  "programados": [
    {
      "concepto": "Material Y",
      "fecha_requerida": "28-abr",
      "estatus": "En proceso",            ← usar: "En proceso" o "Solicitado"
      "importancia": "Alta"
    }
  ]
}
```

---

### Paso 3 · Subir las fotos

Crea las carpetas correspondientes a la nueva semana (si no existen) y súbele hasta **4 fotos por lote**.

```
fotos/
└── semana-03/
    ├── lote-09/
    │   ├── img-lote09-sem03-01.jpg
    │   ├── img-lote09-sem03-02.jpg
    │   ├── img-lote09-sem03-03.jpg
    │   └── img-lote09-sem03-04.jpg
    ├── lote-10/
    │   ├── img-lote10-sem03-01.jpg
    │   └── ...
    └── ...
```

#### 🔤 Regla de nombres

```
img-lote{NUM_LOTE}-sem{SEMANA}-{NUMERO_FOTO}.jpg
```

Ejemplos:
- `img-lote10-sem03-01.jpg` → primera foto del lote 10 de la semana 03
- `img-lote22-sem05-03.jpg` → tercera foto del lote 22 de la semana 05

> ⚠️ **Importante:** usa **minúsculas** y extensión `.jpg`. Siempre 2 dígitos para lote y semana, y 2 dígitos para el número de foto.

> 💡 Si solo tienes 2 fotos de un lote, súbelas con nombres 01 y 02. Los slots 03 y 04 mostrarán un placeholder limpio con el nombre esperado.

#### 📐 Tamaño recomendado de fotos

- Máximo 1600px de ancho
- Formato JPG con calidad 80-85% (usa TinyPNG si están pesadas)
- Idealmente **bajo los 500 KB** cada una para que carguen rápido en móvil

---

### Paso 4 · Actualizar el índice del landing

Abre `data/index.json` y **agrega el número de la nueva semana** a la lista `semanas_publicadas`:

**Antes:**
```json
"semanas_publicadas": ["02"]
```

**Después:**
```json
"semanas_publicadas": ["02", "03"]
```

> 💡 El landing mostrará las semanas más recientes primero, así que el orden en el array no importa. Pero yo te recomiendo mantenerlas en orden ascendente para que sea fácil de leer.

---

### Paso 5 · Subir todo a GitHub

Desde la terminal en tu carpeta del proyecto:

```bash
git add .
git commit -m "Reporte semana 03"
git push origin main
```

En **1-2 minutos** GitHub Pages actualizará el sitio automáticamente. Ya puedes compartir el link.

---

## 🔍 Verificación rápida después de publicar

Abre tu sitio y verifica:

- [ ] La nueva semana aparece en el landing
- [ ] Al hacer clic, carga sin errores
- [ ] Los KPIs (programado/real/variación) están correctos
- [ ] La curva S tiene el nuevo punto
- [ ] Las 6 tarjetas de lotes cargan bien
- [ ] Al hacer clic en un lote se abre el panel lateral
- [ ] Las fotos se ven (o muestran el placeholder si faltan)

## 🆘 Troubleshooting

**"Se quedó cargando y no aparece nada"**
→ Abre la consola del navegador (F12 → Console). Probablemente hay un error de JSON inválido. Copia-pega el contenido en https://jsonlint.com para validar.

**"Las fotos no cargan"**
→ Revisa el nombre del archivo, debe coincidir EXACTAMENTE con `img-lote{NUM}-sem{SEM}-0{X}.jpg` en minúsculas.

**"El landing dice 'No se pudo cargar'"**
→ Revisa que `data/index.json` exista y sea JSON válido.

**"La curva S se ve rara"**
→ Asegúrate que el array `programado` tenga exactamente 33 valores y que `real` tenga tantos valores como semanas publicadas + 1 (el punto inicial).

---

## 💡 Tips de productividad

1. **Usa Claude Desktop o Claude Code** para acelerar la generación del JSON. Puedes subirle el PDF de la semana y pedirle: *"Genera el JSON de la semana X siguiendo el formato de semana-02.json"*.

2. **Haz commits descriptivos**: `git commit -m "Semana 05: avance 12% real vs 10.5% programado"` te ayuda a encontrar semanas específicas en el historial.

3. **Prueba localmente antes de subir**: abre `index.html` con Live Server de VS Code para ver los cambios sin subir a GitHub. Tip: usa la extensión "Live Server" (Ritwick Dey).

4. **Mantén un respaldo**: haz `git clone` del repo a una carpeta aparte de vez en cuando como backup manual. GitHub ya tiene historial pero nunca está de más.
