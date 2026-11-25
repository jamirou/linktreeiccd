# Enlaces — Iglesia Internacional Cordero de Dios

Página tipo Linktree con diseño **minimalista, pastel y mobile-first**, lista para alojarse gratis en **GitHub Pages** sin necesidad de compilación ni servidores.

## Estructura del proyecto

- `index.html` — Estructura principal de la página.
- `styles.css` — Diseño pastel, responsivo y accesible (WCAG AA).
- `config.js` — **Archivo principal para actualizar enlaces** (última prédica, redes y WhatsApp).
- `app.js` — Sincroniza `config.js`, actualiza la miniatura de YouTube automáticamente y gestiona el botón de compartir.
- `assets/logo-iccd.png` — Logo oficial de la iglesia.

## Cómo actualizar la última prédica cada semana

1. Abre `config.js` (incluso directo desde la web de GitHub con el botón de lápiz **Edit**).
2. Reemplaza el enlace en `ultimaPredica.url`:
   ```js
   ultimaPredica: {
     etiqueta: "YouTube · Último mensaje",
     titulo: "Última Prédica",
     descripcion: "Mira y comparte el último mensaje en nuestro canal",
     url: "https://www.youtube.com/watch?v=NUEVO_ID_AQUI",
   },
   ```
3. Guarda los cambios (**Commit changes**). La miniatura de YouTube se actualiza sola en 1–2 minutos.

## Cómo subirlo gratis a GitHub Pages

1. Crea un repositorio público nuevo en GitHub (por ejemplo, `iccd-links`).
2. Sube todos los archivos dentro de esta carpeta (`index.html`, `styles.css`, `config.js`, `app.js` y la carpeta `assets/`).
3. En tu repositorio ve a **Settings → Pages**.
4. En **Build and deployment → Source**, elige **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`, luego presiona **Save**.
6. En 1 o 2 minutos tu página estará en vivo en `https://tu-usuario.github.io/iccd-links/`.

---
Hecho por Jamir con <3
