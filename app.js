(() => {
  "use strict";

  const config = window.ICCD_CONFIG;

  /**
   * Extrae el ID de un enlace de YouTube (watch, youtu.be, shorts o live)
   * para actualizar la miniatura automáticamente al cambiar el link.
   */
  function extractYouTubeId(urlString) {
    if (!urlString) return null;
    try {
      const url = new URL(urlString);
      const host = url.hostname.replace(/^www\./, "");

      if (host === "youtu.be") {
        return url.pathname.slice(1).split("/")[0] || null;
      }

      if (host.endsWith("youtube.com")) {
        const vParam = url.searchParams.get("v");
        if (vParam) return vParam;

        const parts = url.pathname.split("/").filter(Boolean);
        if (["shorts", "live", "embed"].includes(parts[0]) && parts[1]) {
          return parts[1];
        }
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Construye un enlace wa.me usando el número de config.js.
   */
  function buildWhatsAppUrl(message) {
    const rawNumber = config?.enlaces?.whatsapp?.numero || "56988496800";
    const digits = String(rawNumber).replace(/\D/g, "");
    const query = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${digits}${query}`;
  }

  /**
   * Sincroniza la UI con config.js para facilitar actualizaciones semanales.
   */
  function applyConfig() {
    if (!config) return;

    const nameEl = document.getElementById("church-name");
    const subtitleEl = document.getElementById("church-subtitle");

    if (config.iglesia?.nombre && nameEl) {
      nameEl.textContent = config.iglesia.nombre;
    }
    if (config.iglesia?.subtitulo && subtitleEl) {
      subtitleEl.textContent = config.iglesia.subtitulo;
    }

    if (config.ultimaPredica) {
      const { etiqueta, titulo, descripcion, url } = config.ultimaPredica;
      const sermonLink = document.getElementById("sermon-link");
      const sermonBadge = document.getElementById("sermon-badge");
      const sermonTitle = document.getElementById("sermon-title");
      const sermonDesc = document.getElementById("sermon-desc");
      const sermonThumb = document.getElementById("sermon-thumb");

      if (sermonLink && url) sermonLink.href = url;
      if (sermonBadge && etiqueta) sermonBadge.textContent = etiqueta;
      if (sermonTitle && titulo) sermonTitle.textContent = titulo;
      if (sermonDesc && descripcion) sermonDesc.textContent = descripcion;

      const videoId = extractYouTubeId(url);
      if (sermonThumb && videoId) {
        const maxResUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
        const fallbackUrl = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

        const handleFallback = () => {
          if (sermonThumb.src !== fallbackUrl) {
            sermonThumb.src = fallbackUrl;
          }
        };

        sermonThumb.addEventListener("error", handleFallback, { once: true });
        sermonThumb.addEventListener("load", () => {
          if (sermonThumb.naturalWidth <= 120) {
            handleFallback();
          }
        }, { once: true });

        sermonThumb.src = maxResUrl;
      }
    }

    if (config.enlaces) {
      Object.entries(config.enlaces).forEach(([key, item]) => {
        const card = document.querySelector(`[data-link-id="${key}"]`);
        if (!card || !item) return;

        if (key === "whatsapp" && item.numero) {
          card.href = buildWhatsAppUrl(item.mensajeInicial || "");
        } else if (item.url) {
          card.href = item.url;
        }

        const titleEl = card.querySelector(".link-card__title");
        const metaEl = card.querySelector(".link-card__meta");
        if (titleEl && item.titulo) titleEl.textContent = item.titulo;
        if (metaEl && item.subtitulo) metaEl.textContent = item.subtitulo;
      });
    }
  }

  /**
   * Muestra una notificación breve accesible.
   */
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = "";
    requestAnimationFrame(() => {
      toast.textContent = message;
      toast.classList.add("is-visible");
    });

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3200);
  }

  window.ICCD_SHOW_TOAST = showToast;

  /**
   * Botón de compartir nativo en teléfonos con fallback a portapapeles.
   */
  function initShareButton() {
    const shareBtn = document.getElementById("share-btn");
    if (!shareBtn) return;

    shareBtn.addEventListener("click", async () => {
      const shareData = {
        title: config?.iglesia?.nombre || document.title,
        text: "Conecta con la Iglesia Internacional Cordero de Dios",
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if (err && err.name === "AbortError") return;
        }
      }

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast("Enlace copiado al portapapeles");
          return;
        } catch {
          // Fallback abajo
        }
      }

      showToast("Copia la dirección desde tu navegador");
    });
  }

  applyConfig();
  initShareButton();
})();
