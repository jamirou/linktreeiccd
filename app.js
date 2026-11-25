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
    }, 2400);
  }

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
          // Fallback abajo si el navegador bloquea clipboard
        }
      }

      showToast("Copia la dirección desde tu navegador");
    });
  }

  /* ==========================================================================
     Soporte cross-browser para animar salida del top-layer (<dialog>)
     ========================================================================== */

  let supportsDisplayTransition;
  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS?.supports?.("transition-behavior", "allow-discrete") || !document.body) {
      return false;
    }
    const probe = document.createElement("div");
    probe.style.cssText = "transition: display 1s allow-discrete !important; display: block;";
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = "none";
    supportsDisplayTransition = getComputedStyle(probe).display === "block";
    probe.remove();
    return supportsDisplayTransition;
  }

  function supportsTopLayerExit() {
    return Boolean(window.CSS?.supports?.("overlay", "auto") && canTransitionDisplay());
  }

  async function closeTopLayer(dialog) {
    if (!dialog || !dialog.open) return;

    if (!supportsTopLayerExit()) {
      dialog.setAttribute("data-closing", "");
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 600)),
        ]);
      }
      if (!dialog.hasAttribute("data-closing")) return;
      dialog.removeAttribute("data-closing");
    }

    dialog.close();
  }

  /* ==========================================================================
     Mini Test Interactivo: "¿Qué palabra necesitas hoy?" -> Resultado WhatsApp
     ========================================================================== */

  const QUIZ_STEPS = [
    {
      id: "estado",
      question: "¿Cómo llega tu corazón hoy?",
      options: [
        { emoji: "🌿", label: "Buscando paz y descanso", profile: "paz" },
        { emoji: "🔥", label: "Con ganas de crecer y servir", profile: "proposito" },
        { emoji: "🤍", label: "Pasando por un momento difícil", profile: "fuerza" },
        { emoji: "☀️", label: "Agradecido y con alegría", profile: "gratitud" },
      ],
    },
    {
      id: "enfoque",
      question: "¿Qué te gustaría fortalecer esta semana?",
      options: [
        { emoji: "🙏", label: "Mi vida de oración y calma", profile: "paz" },
        { emoji: "📖", label: "Conocer más la Palabra", profile: "proposito" },
        { emoji: "✨", label: "Renovar mis fuerzas y esperanza", profile: "fuerza" },
        { emoji: "🤝", label: "Conectar con comunidad y amigos", profile: "gratitud" },
      ],
    },
    {
      id: "paso",
      question: "¿Cómo prefieres caminar tu fe hoy?",
      options: [
        { emoji: "💬", label: "Conversando con alguien que me escuche" },
        { emoji: "🎵", label: "Escuchando alabanza y la playlist CAP" },
        { emoji: "🏠", label: "Visitando una reunión presencial" },
        { emoji: "🌱", label: "Dando un primer paso a mi ritmo" },
      ],
    },
    {
      id: "oracion",
      question: "¿Por qué te gustaría que oremos hoy?",
      allowCustomNote: true,
      options: [
        { emoji: "🕊️", label: "Paz y dirección" },
        { emoji: "🏡", label: "Mi familia y seres queridos" },
        { emoji: "💪", label: "Salud, estudios o trabajo" },
        { emoji: "💛", label: "Solo recibir mi palabra de hoy" },
      ],
    },
  ];

  const QUIZ_PROFILES = {
    paz: {
      tag: "Palabra de Paz",
      title: "Refugio de Paz",
      verse: "«Vengan a mí todos los que están cansados y cargados, y yo les daré descanso.»",
      ref: "Mateo 11:28",
      reflection: "No tienes que cargar todo solo hoy. Respira hondo: Dios te invita a soltar el peso y descansar en su presencia.",
    },
    proposito: {
      tag: "Palabra de Propósito",
      title: "Fuego y Propósito",
      verse: "«Porque yo sé los planes que tengo para ustedes —declara el Señor—, planes de bienestar y no de calamidad, a fin de darles un futuro y una esperanza.»",
      ref: "Jeremías 29:11",
      reflection: "Este es un gran tiempo para dar pasos valientes en tu fe. Dios está formando algo hermoso en tu caminar y en comunidad.",
    },
    fuerza: {
      tag: "Palabra de Fortaleza",
      title: "Fuerza en la Tormenta",
      verse: "«No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré.»",
      ref: "Isaías 41:10",
      reflection: "Aunque el día se sienta cuesta arriba, no estás caminando solo. Queremos acompañarte y orar contigo en este proceso.",
    },
    gratitud: {
      tag: "Palabra de Gratitud",
      title: "Corazón Agradecido",
      verse: "«Entren por sus puertas con acción de gracias… porque el Señor es bueno y su gran amor perdura para siempre.»",
      ref: "Salmo 100:4-5",
      reflection: "Tu gratitud abre puertas de gozo y contagia esperanza a quienes te rodean. ¡Nos encantaría compartir este tiempo contigo!",
    },
  };

  function initQuiz() {
    const openBtn = document.getElementById("open-quiz-btn");
    const closeBtn = document.getElementById("close-quiz-btn");
    const dialog = document.getElementById("soul-quiz");
    const stage = document.getElementById("quiz-stage");
    const progressWrap = document.getElementById("quiz-progress-wrap");
    const progressFill = document.getElementById("quiz-progress-fill");
    const progressLabel = document.getElementById("quiz-progress-label");

    if (!openBtn || !dialog || !stage) return;

    const state = {
      stepIndex: 0,
      answers: {},
      customNote: "",
    };

    function resetQuiz() {
      state.stepIndex = 0;
      state.answers = {};
      state.customNote = "";
      renderStep();
    }

    function computeProfileKey() {
      const scores = { paz: 0, proposito: 0, fuerza: 0, gratitud: 0 };
      const first = state.answers.estado?.profile;
      const second = state.answers.enfoque?.profile;

      if (first && first in scores) scores[first] += 2;
      if (second && second in scores) scores[second] += 1;

      return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    }

    function renderStep() {
      const total = QUIZ_STEPS.length;
      const step = QUIZ_STEPS[state.stepIndex];

      if (progressWrap) progressWrap.hidden = false;
      if (progressFill) progressFill.style.inlineSize = `${((state.stepIndex + 1) / total) * 100}%`;
      if (progressLabel) progressLabel.textContent = `Paso ${state.stepIndex + 1} de ${total}`;

      stage.replaceChildren();

      const heading = document.createElement("h2");
      heading.className = "quiz-question";
      heading.textContent = step.question;
      stage.appendChild(heading);

      const optionsWrap = document.createElement("div");
      optionsWrap.className = "quiz-options";

      step.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-option";
        const isSelected = state.answers[step.id]?.label === opt.label;
        btn.setAttribute("aria-pressed", String(isSelected));

        const emoji = document.createElement("span");
        emoji.className = "quiz-option__emoji";
        emoji.setAttribute("aria-hidden", "true");
        emoji.textContent = opt.emoji;

        const text = document.createElement("span");
        text.textContent = opt.label;

        btn.append(emoji, text);
        btn.addEventListener("click", () => {
          state.answers[step.id] = opt;
          if (step.allowCustomNote) {
            renderStep();
          } else {
            state.stepIndex += 1;
            renderStep();
          }
        });

        optionsWrap.appendChild(btn);
      });

      stage.appendChild(optionsWrap);

      if (step.allowCustomNote) {
        const noteWrap = document.createElement("div");
        noteWrap.className = "quiz-note-wrap";

        const label = document.createElement("label");
        label.className = "quiz-note-label";
        label.htmlFor = "quiz-prayer-note";
        label.textContent = "O escribe una breve petición (opcional):";

        const input = document.createElement("input");
        input.id = "quiz-prayer-note";
        input.type = "text";
        input.maxLength = 120;
        input.className = "quiz-note-input";
        input.placeholder = "Ej: Por tranquilidad en mis exámenes...";
        input.value = state.customNote;
        input.addEventListener("input", (e) => {
          state.customNote = e.target.value;
        });

        noteWrap.append(label, input);
        stage.appendChild(noteWrap);
      }

      if (state.stepIndex > 0 || step.allowCustomNote) {
        const navRow = document.createElement("div");
        navRow.className = "quiz-nav-row";

        if (state.stepIndex > 0) {
          const backBtn = document.createElement("button");
          backBtn.type = "button";
          backBtn.className = "quiz-btn quiz-btn--ghost";
          backBtn.textContent = "Atrás";
          backBtn.addEventListener("click", () => {
            state.stepIndex -= 1;
            renderStep();
          });
          navRow.appendChild(backBtn);
        }

        if (step.allowCustomNote) {
          const finishBtn = document.createElement("button");
          finishBtn.type = "button";
          finishBtn.className = "quiz-btn quiz-btn--primary";
          finishBtn.textContent = "Ver mi palabra";
          finishBtn.addEventListener("click", () => {
            if (!state.answers[step.id]) {
              state.answers[step.id] = step.options[3];
            }
            renderResult();
          });
          navRow.appendChild(finishBtn);
        }

        stage.appendChild(navRow);
      }
    }

    function renderResult() {
      if (progressWrap) progressWrap.hidden = true;

      const profile = QUIZ_PROFILES[computeProfileKey()] || QUIZ_PROFILES.paz;
      const customText = state.customNote.trim();
      const prayerChoice = state.answers.oracion?.label || "Recibir mi palabra de hoy";
      const prayerSummary = customText ? `${prayerChoice} (${customText})` : prayerChoice;

      const whatsappMessage = [
        "¡Hola! Hice el mini test en los enlaces de ICCD ✨",
        "",
        `• Mi palabra de hoy: ${profile.title} (${profile.ref})`,
        `• Cómo llego hoy: ${state.answers.estado?.label || ""}`,
        `• Quiero fortalecer: ${state.answers.enfoque?.label || ""}`,
        `• Siguiente paso: ${state.answers.paso?.label || ""}`,
        `• Motivo de oración: ${prayerSummary}`,
        "",
        "¡Bendiciones!",
      ].join("\n");

      stage.replaceChildren();

      const card = document.createElement("div");
      card.className = "quiz-result-card";

      const tag = document.createElement("span");
      tag.className = "quiz-result-card__tag";
      tag.textContent = profile.tag;

      const title = document.createElement("h2");
      title.className = "quiz-result-card__title";
      title.textContent = profile.title;

      const verse = document.createElement("blockquote");
      verse.className = "quiz-result-card__verse";
      verse.textContent = profile.verse;

      const ref = document.createElement("span");
      ref.className = "quiz-result-card__ref";
      ref.textContent = profile.ref;

      const reflection = document.createElement("p");
      reflection.className = "quiz-result-card__reflection";
      reflection.textContent = profile.reflection;

      card.append(tag, title, verse, ref, reflection);

      const actions = document.createElement("div");
      actions.className = "quiz-actions";

      const waLink = document.createElement("a");
      waLink.className = "quiz-btn quiz-btn--whatsapp";
      waLink.href = buildWhatsAppUrl(whatsappMessage);
      waLink.target = "_blank";
      waLink.rel = "noopener noreferrer";
      waLink.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.78 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.83-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.18-4.94-4.38-.14-.2-1.18-1.57-1.18-2.99 0-1.42.74-2.12 1.01-2.41.26-.29.58-.36.77-.36.19 0 .38 0 .55.01.18.01.41-.07.65.49.24.58.82 2 .89 2.14.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.3-.13.59.17.29.74 1.22 1.59 1.98 1.09.97 2.02 1.27 2.31 1.42.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.65-.14.26.1 1.68.79 1.97.94.29.14.48.22.55.34.07.12.07.69-.17 1.37Z"/>
        </svg>
        <span>Enviar resultado a WhatsApp</span>
      `;

      const secondary = document.createElement("div");
      secondary.className = "quiz-actions__secondary";

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "quiz-btn quiz-btn--ghost";
      copyBtn.textContent = "Copiar versículo";
      copyBtn.addEventListener("click", async () => {
        const textToCopy = `${profile.verse} — ${profile.ref} (ICCD)`;
        if (navigator.clipboard?.writeText) {
          try {
            await navigator.clipboard.writeText(textToCopy);
            showToast("Versículo copiado");
            return;
          } catch {
            // Fallback abajo
          }
        }
        showToast("Selecciona el texto para copiarlo");
      });

      const restartBtn = document.createElement("button");
      restartBtn.type = "button";
      restartBtn.className = "quiz-btn quiz-btn--ghost";
      restartBtn.textContent = "Repetir test";
      restartBtn.addEventListener("click", resetQuiz);

      secondary.append(copyBtn, restartBtn);
      actions.append(waLink, secondary);
      stage.append(card, actions);
    }

    openBtn.addEventListener("click", () => {
      resetQuiz();
      dialog.showModal();
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        closeTopLayer(dialog);
      });
    }

    // Intercepta Esc / close requests para animar salida en Safari y Firefox
    dialog.addEventListener("cancel", (event) => {
      if (!supportsTopLayerExit()) {
        event.preventDefault();
        closeTopLayer(dialog);
      }
    });

    dialog.addEventListener("close", () => {
      dialog.returnValue = "";
    });

    // Fallback de light-dismiss para navegadores sin `closedby` (Safari)
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const isOutside = (e) => {
        const rect = dialog.getBoundingClientRect();
        return (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        );
      };

      let pressedOutside = false;
      dialog.addEventListener("pointerdown", (e) => {
        pressedOutside = isOutside(e);
      });
      dialog.addEventListener("pointerup", (e) => {
        if (pressedOutside && isOutside(e)) {
          closeTopLayer(dialog);
        }
      });
    }
  }

  applyConfig();
  initShareButton();
  initQuiz();
})();
