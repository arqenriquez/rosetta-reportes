# Rosetta Reportes · Etapa 3

Micrositio de reportes semanales de avance del proyecto **Rosetta Etapa 3** (6 viviendas, Hermosillo, Sonora). Desarrollado por Jorge Enríquez para Metta Arquitectura y Construcción.

## 📁 Estructura del proyecto

```
rosetta-reportes/
├── index.html                    Landing principal con índice de semanas
├── semana.html                   Plantilla única para cualquier semana (?num=XX)
├── css/
│   └── styles.css                Estilos compartidos (una sola hoja)
├── js/
│   ├── landing.js                Lógica del índice de semanas
│   └── reporte.js                Lógica del reporte semanal
├── data/
│   ├── index.json                Lista de semanas publicadas
│   ├── semana-02.json            Datos del reporte de semana 02
│   ├── semana-03.json            (se agrega cuando publiques)
│   └── ...
├── fotos/
│   └── semana-02/
│       ├── lote-09/              img-lote09-sem02-01.jpg … 04.jpg
│       ├── lote-10/              img-lote10-sem02-01.jpg … 04.jpg
│       ├── lote-11/              img-lote11-sem02-01.jpg … 04.jpg
│       ├── lote-21/              img-lote21-sem02-01.jpg … 04.jpg
│       ├── lote-22/              img-lote22-sem02-01.jpg … 04.jpg
│       └── lote-23/              img-lote23-sem02-01.jpg … 04.jpg
├── assets/                       Recursos gráficos (logos, etc.)
├── README.md                     Este archivo
└── MANUAL-NUEVO-REPORTE.md       Guía paso a paso para publicar reporte nuevo
```

## 🚀 Deploy en GitHub Pages

1. Crear un repositorio en GitHub: `rosetta-reportes` (puede ser público)
2. Subir todos los archivos al repo
3. En **Settings → Pages**: seleccionar rama `main` y carpeta `/ (root)`
4. Esperar 1-2 minutos. La URL quedará: `https://tuusuario.github.io/rosetta-reportes/`

## 🔄 Cómo publicar un reporte nuevo

Ver el archivo **MANUAL-NUEVO-REPORTE.md** en la raíz del proyecto. Son 5 pasos simples.

## 🌐 URLs del sitio

- **Landing:** `index.html` → muestra todas las semanas publicadas
- **Semana 02:** `semana.html?num=02`
- **Semana 03:** `semana.html?num=03`
- ... y así sucesivamente

## ⚙️ Cómo funciona

El sistema usa **una sola plantilla HTML** (`semana.html`) que carga dinámicamente el JSON correspondiente según el parámetro `?num=XX` de la URL. Esto significa:

- **No duplicas código HTML** semana a semana
- **Solo editas datos** (archivos JSON)
- **Los cambios de diseño** se aplican a todas las semanas automáticamente

## 📝 Contacto

Jorge Enríquez · Metta Arquitectura y Construcción · Hermosillo, Sonora
