# Guía de Primera Publicación · GitHub + GitHub Pages

Esta guía es para la **primera vez** que subes el proyecto. Solo la haces una vez. Después, para cada semana nueva usa el `MANUAL-NUEVO-REPORTE.md`.

---

## 🎯 Qué vamos a lograr

Al terminar esta guía vas a tener:
- ✅ El proyecto en un repo de GitHub
- ✅ El sitio publicado en `https://TUUSUARIO.github.io/rosetta-reportes/`
- ✅ Todo configurado para que las próximas semanas sea solo subir JSON + fotos

**Tiempo estimado:** 20-30 minutos (solo la primera vez)

---

## Paso 0 · Prerrequisitos

Antes de empezar necesitas:

1. **Cuenta de GitHub.** Si no tienes, regístrate gratis en https://github.com
2. **Git instalado** en tu Mac/PC. Para verificar, abre Terminal y corre:
   ```bash
   git --version
   ```
   Si no aparece, instálalo desde https://git-scm.com/downloads
3. **VS Code instalado** (recomendado pero no obligatorio)
4. **La carpeta completa `rosetta-reportes/`** en tu computadora

---

## Paso 1 · Probar localmente (antes de subir a la web)

Antes de subir nada, confirma que el proyecto funciona en tu compu.

### Opción A · Live Server de VS Code (recomendado)

1. Abre VS Code
2. File → Open Folder → selecciona la carpeta `rosetta-reportes/`
3. Instala la extensión **Live Server** (de Ritwick Dey) si no la tienes
4. Clic derecho en `index.html` → "Open with Live Server"
5. Se abrirá en tu navegador `http://127.0.0.1:5500`

### Opción B · Python (si prefieres terminal)

Desde la carpeta del proyecto en Terminal:
```bash
python3 -m http.server 8000
```
Luego abre `http://localhost:8000` en tu navegador.

### ✅ Checklist local

- [ ] El landing carga y muestra la card de Semana 02
- [ ] Al hacer clic en Semana 02, carga el reporte
- [ ] Los números y gráficas aparecen correctamente
- [ ] Las 6 tarjetas de lotes funcionan (panel lateral abre)
- [ ] Al escalar la ventana, se ve bien en móvil/tablet/escritorio

Si algo falla, abre la consola del navegador (F12) y revisa los errores antes de continuar.

---

## Paso 2 · Crear el repositorio en GitHub

1. Ve a https://github.com e inicia sesión
2. Clic en el botón **"+"** (arriba derecha) → **"New repository"**
3. Llena el formulario:
   - **Repository name:** `rosetta-reportes`
   - **Description:** (opcional) `Reportes semanales Rosetta Etapa 3 | Metta`
   - **Visibility:** **Public** (necesario para GitHub Pages gratis)
   - ❌ NO marques ninguna opción de inicialización (README, gitignore, license) — ya los tienes en la carpeta
4. Clic en **"Create repository"**

GitHub te mostrará una página con instrucciones. **No cierres esa pestaña** aún.

---

## Paso 3 · Subir el proyecto desde tu computadora

Abre la Terminal en la carpeta del proyecto. Si usas VS Code: `View → Terminal` (o `Ctrl+` ` / `Cmd+` `).

Asegúrate de estar en la carpeta correcta:
```bash
pwd
# Debe mostrar algo como: /Users/jorge/projects/rosetta-reportes
```

Ahora corre estos comandos **uno por uno**:

```bash
# 1. Inicializar Git en el proyecto
git init

# 2. Agregar todos los archivos al control de versiones
git add .

# 3. Primer commit (guardado local)
git commit -m "Primer publicación: Semana 02 de Rosetta Etapa 3"

# 4. Cambiar la rama principal a 'main' (estándar actual)
git branch -M main

# 5. Conectar tu carpeta local con el repo de GitHub
# IMPORTANTE: cambia "TUUSUARIO" por tu username de GitHub
git remote add origin https://github.com/TUUSUARIO/rosetta-reportes.git

# 6. Subir todo a GitHub
git push -u origin main
```

En el paso 6 te va a pedir autenticación. Hay dos formas:

**Opción A · HTTPS con token (más simple)**
- GitHub te pedirá tu username y un "password"
- El password NO es tu contraseña normal, es un **Personal Access Token**
- Créalo aquí: https://github.com/settings/tokens → "Generate new token (classic)" → marca solo el permiso `repo` → genera y **cópialo** (se muestra una sola vez)
- Pégalo como "password" cuando te lo pida

**Opción B · SSH (si ya tienes llaves configuradas)**
- Cambia el comando 5 por: `git remote add origin git@github.com:TUUSUARIO/rosetta-reportes.git`

---

## Paso 4 · Activar GitHub Pages

1. Ve a tu repo en GitHub: `https://github.com/TUUSUARIO/rosetta-reportes`
2. Clic en la pestaña **"Settings"** (arriba)
3. En la barra lateral izquierda, clic en **"Pages"**
4. En la sección "Build and deployment":
   - **Source:** `Deploy from a branch`
   - **Branch:** selecciona `main` y la carpeta `/ (root)`
   - Clic en **"Save"**
5. Espera 1-2 minutos. Al refrescar la página verás: `✅ Your site is live at https://TUUSUARIO.github.io/rosetta-reportes/`

### 🎉 Listo

Ya puedes compartir ese link con quien quieras. Ábrelo, pruébalo en el celular, mándalo a tus clientes.

---

## Paso 5 · Configuración recomendada de VS Code

Para que las siguientes semanas sean rapidísimas:

### Extensiones esenciales
1. **Live Server** (Ritwick Dey) — preview local en vivo
2. **JSON** (integrada) — autocompletado y validación
3. **GitLens** — ver historial de cambios fácilmente
4. **Prettier** — formateo automático

### Atajo útil
- `Cmd + Shift + P` (Mac) o `Ctrl + Shift + P` (Win) → `Format Document` → mantiene tus JSON limpios

---

## 🔄 Flujo rápido de cada semana (después de esto)

Una vez configurado todo, publicar cada semana toma 15 min:

1. Copiar `semana-XX.json` anterior → renombrar a nueva semana
2. Abrir en VS Code y actualizar los números (usando `MANUAL-NUEVO-REPORTE.md`)
3. Subir las fotos a `fotos/semana-XX/lote-YY/`
4. Agregar el número de la nueva semana a `data/index.json`
5. En Terminal:
   ```bash
   git add .
   git commit -m "Semana XX publicada"
   git push
   ```
6. Esperar 1-2 min. Refrescar el sitio. Listo.

---

## 💡 Recomendación: usar Claude Code para acelerar aún más

Si tienes Claude Code instalado (que ya investigaste antes), puedes decirle algo como:

> "Lee el PDF adjunto de la Semana 05 y genera el archivo `data/semana-05.json` siguiendo el formato de `semana-02.json`. Actualiza también `data/index.json` agregando '05' a semanas_publicadas."

Claude Code lee el PDF, genera el JSON, lo coloca en la carpeta correcta, actualiza el índice, y te queda listo para `git push`. Esto reduce el proceso semanal a **~5 minutos**.

---

## 🆘 Si algo sale mal

| Problema | Solución |
|---|---|
| `git push` falla con error de autenticación | Verifica tu Personal Access Token (no uses tu password normal) |
| GitHub Pages dice "Page not found" | Espera 5 min más, GitHub a veces tarda. O verifica que hayas seleccionado rama `main` y `/ (root)` |
| El sitio carga pero la Semana 02 no aparece | Revisa que `data/semana-02.json` esté en el commit y no tenga errores de sintaxis |
| Las fotos no se ven | Verifica que los nombres de archivo sean EXACTOS (minúsculas, guiones correctos) |
| Cambié algo y no se refleja | GitHub Pages cachea. Fuerza refresh con `Cmd+Shift+R` (Mac) o `Ctrl+F5` (Win) |

---

## 📞 ¿Y si quiero un dominio propio después?

Cuando ya esté funcionando y quieras que sea `reportes.arqenriquez.com` en vez de `github.io`:

1. En tu proveedor de dominio (donde compraste `arqenriquez.com`), agrega un registro CNAME que apunte a `TUUSUARIO.github.io`
2. En Settings → Pages del repo, agrega el dominio custom
3. GitHub configura HTTPS automático

Esto lo podemos ver más adelante cuando estés listo. Por ahora `github.io/rosetta-reportes` es perfecto para empezar.
