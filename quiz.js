(() => {
  "use strict";

  const config = window.ICCD_CONFIG;

  function buildWhatsAppUrl(message) {
    const rawNumber = config?.enlaces?.whatsapp?.numero || "56988496800";
    const digits = String(rawNumber).replace(/\D/g, "");
    const query = message ? `?text=${encodeURIComponent(message)}` : "";
    return `https://wa.me/${digits}${query}`;
  }

  function notify(message) {
    if (typeof window.ICCD_SHOW_TOAST === "function") {
      window.ICCD_SHOW_TOAST(message);
    }
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
     Base de conocimiento: 8 perfiles profundos + diccionario de palabras clave
     ========================================================================== */

  const PROFILES = {
    ansiedad: {
      key: "ansiedad",
      topicName: "Paz y calma mental",
      tag: "Palabra de Paz",
      title: "Paz en Medio del Ruido",
      verse: "«No se inquieten por nada; más bien, en toda ocasión, con oración y ruego, presenten sus peticiones a Dios y denle gracias. Y la paz de Dios, que sobrepasa todo entendimiento, cuidará sus corazones y sus pensamientos en Cristo Jesús.»",
      ref: "Filipenses 4:6-7",
      paragraphs: [
        "Cuando la mente no deja de girar y el peso del día se acumula, es fácil sentir que tienes que resolverlo todo ahora mismo. Sin embargo, Dios no te pide que tengas todas las respuestas hoy: te invita a entregarle tus cargas y respirar en su paz.",
        "Esa paz que promete la Escritura no depende de que todo esté en silencio afuera, sino de saber quién sostiene tu vida por dentro. Hoy puedes soltar la urgencia, descansar un paso a la vez y dejar que Dios guarde tu corazón."
      ],
      prayer: "Señor, hoy pongo delante de ti cada pensamiento que me quita la calma. Aquieta mi mente, renueva mis fuerzas y llena mi corazón de tu paz que sobrepasa todo entendimiento. Amén.",
      shortSupport: "Sobre la ansiedad y el cansancio que mencionaste: recuerda Mateo 11:28 — «Vengan a mí todos los que están cansados y cargados, y yo les daré descanso.» No tienes que pelear esas batallas en silencio.",
      storyPalette: ["#dcebff", "#e8dfff", "#dcf5eb"],
      storyHighlight: "Dios cuida tus pensamientos y te regala descanso hoy.",
      recommended: {
        label: "Escuchar la Playlist CAP para descansar",
        url: config?.enlaces?.spotify?.url || "https://open.spotify.com/playlist/73iT5nfMp4Gt5wADwXifgo?si=99ac878c7cf741ad",
      },
      keywords: [
        "ansiedad", "ansioso", "ansiosa", "estres", "estresado", "estresada",
        "preocupacion", "preocupado", "preocupada", "miedo", "temor", "angustia",
        "agobio", "agobiado", "agobiada", "paz", "calma", "descanso", "descansar",
        "dormir", "insomnio", "mente", "pensamientos", "nervioso", "nerviosa",
        "panico", "cansado", "cansada", "agotado", "agotada", "presion", "ruido",
        "sobrepasado", "sobrepasada", "tranquilidad", "calmar"
      ],
    },

    familia: {
      key: "familia",
      topicName: "Familia y relaciones",
      tag: "Palabra para Tu Hogar",
      title: "Gracia para Tu Hogar",
      verse: "«Sobre todo, vístanse de amor, que es el vínculo perfecto. Que gobierne en sus corazones la paz de Cristo, a la cual fueron llamados en un solo cuerpo.»",
      ref: "Colosenses 3:14-15",
      paragraphs: [
        "Las personas que más amamos suelen ser también el lugar donde más sentimos el peso de las preocupaciones, los desencuentros o el deseo profundo de verlos bien. Dios ve cada lágrima y cada oración silenciosa que has hecho por los tuyos.",
        "Incluso cuando sientes que no puedes cambiar una situación con tus propias manos, el amor paciente de Dios sigue obrando en los corazones. Hoy es un buen día para sembrar una palabra de paz y confiarle tu hogar al Señor."
      ],
      prayer: "Dios bueno, pongo a mi familia y a quienes amo en tus manos. Trae sanidad donde hubo heridas, unidad donde hubo distancia y llena nuestra casa de tu amor y protección. Amén.",
      shortSupport: "Por tu familia y tus seres queridos: Josué 24:15 nos anima a declarar bendición sobre nuestra casa. Queremos unirnos en oración contigo por cada persona que llevas en el corazón.",
      storyPalette: ["#ffe5da", "#fde2ef", "#fff4d4"],
      storyHighlight: "El amor de Dios sostiene y restaura tu hogar.",
      recommended: {
        label: "Ver la última prédica en YouTube",
        url: config?.ultimaPredica?.url || "https://www.youtube.com/watch?v=0W4--vjRado",
      },
      keywords: [
        "familia", "familiar", "familiares", "mama", "madre", "papa", "padre",
        "padres", "hijo", "hija", "hijos", "matrimonio", "pareja", "esposo",
        "esposa", "pololo", "polola", "novio", "novia", "hermano", "hermana",
        "casa", "hogar", "relacion", "relaciones", "discusion", "pelea",
        "divorcio", "separacion", "abuelo", "abuela", "tio", "tia", "amor"
      ],
    },

    trabajo_estudios: {
      key: "trabajo_estudios",
      topicName: "Trabajo, estudios y provisión",
      tag: "Palabra de Provisión",
      title: "Dirección y Provisión",
      verse: "«Encomienda al Señor tus obras, y tus pensamientos serán afirmados. El corazón del hombre traza su rumbo, pero sus pasos los dirige el Señor.»",
      ref: "Proverbios 16:3, 9",
      paragraphs: [
        "El esfuerzo diario por salir adelante en los estudios, el trabajo o la economía puede generar mucha presión e incertidumbre. A veces sientes que las puertas tardan en abrirse o que el cansancio amenaza tu motivación.",
        "Dios no solo se interesa en tu vida espiritual; también camina contigo en tus proyectos, exámenes y responsabilidades cotidianas. Entrega tu esfuerzo con excelencia y confía en que Él abre caminos donde hoy solo ves obstáculos."
      ],
      prayer: "Señor, te entrego mis proyectos, mis estudios y mi sustento. Dame sabiduría para tomar buenas decisiones, favor en cada puerta que toque y paz para confiar en tu provisión fiel. Amén.",
      shortSupport: "En cuanto a tus estudios, trabajo o economía: Santiago 1:5 promete que si pedimos sabiduría a Dios, Él la da con generosidad. ¡No camines esa meta solo!",
      storyPalette: ["#fff3cc", "#dff4ff", "#e6f7ee"],
      storyHighlight: "Encomienda tus proyectos a Dios; Él afirma tus pasos.",
      recommended: {
        label: "Escuchar la Playlist CAP mientras estudias o trabajas",
        url: config?.enlaces?.spotify?.url || "https://open.spotify.com/playlist/73iT5nfMp4Gt5wADwXifgo?si=99ac878c7cf741ad",
      },
      keywords: [
        "trabajo", "trabajar", "empleo", "pega", "cesante", "desempleo", "dinero",
        "plata", "deuda", "deudas", "economia", "finanzas", "negocio", "emprender",
        "proyecto", "proyectos", "estudio", "estudios", "estudiar", "universidad",
        "colegio", "escuela", "examen", "examenes", "prueba", "pruebas", "tesis",
        "carrera", "sueldo", "jefe", "entrevista", "provision", "meta", "metas",
        "titulo", "notas", "semestre"
      ],
    },

    salud: {
      key: "salud",
      topicName: "Sanidad, consuelo y fortaleza",
      tag: "Palabra de Fortaleza",
      title: "Consuelo y Sanidad",
      verse: "«No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.»",
      ref: "Isaías 41:10",
      paragraphs: [
        "Hay temporadas en las que el dolor físico, la tristeza profunda o una pérdida nos dejan sin palabras. No tienes que fingir que todo está bien ni ser fuerte todo el tiempo; Dios está cerca precisamente de los quebrantados de corazón.",
        "Aunque hoy el camino se sienta cuesta arriba, esta etapa no tiene la última palabra sobre tu historia. Permite que Dios te abrace con su consuelo y déjanos acompañarte en oración durante este proceso."
      ],
      prayer: "Padre de misericordia, ven con tu presencia sanadora sobre mi cuerpo y mi corazón. Sostén mi mano cuando me falten fuerzas, consuela mi alma y muéstrame tu luz en medio de esta prueba. Amén.",
      shortSupport: "Sobre la salud o el dolor que compartiste: el Salmo 34:18 nos recuerda que «El Señor está cerca de los quebrantados de corazón.» Nuestra iglesia quiere orar contigo hoy.",
      storyPalette: ["#fde4ef", "#ece4ff", "#e0f2ff"],
      storyHighlight: "No estás solo en la tormenta; Dios te sostiene hoy.",
      recommended: {
        label: "Ver la última prédica para renovar tu esperanza",
        url: config?.ultimaPredica?.url || "https://www.youtube.com/watch?v=0W4--vjRado",
      },
      keywords: [
        "salud", "enfermo", "enferma", "enfermedad", "dolor", "medico", "doctor",
        "hospital", "clinica", "operacion", "cirugia", "sanidad", "sanar", "curar",
        "cuerpo", "depresion", "deprimido", "tristeza", "triste", "llorar", "llanto",
        "duelo", "perdida", "luto", "murio", "fallecio", "diagnostico", "tratamiento",
        "recuperacion", "quebrantado", "herida", "herido", "sufrimiento", "prueba"
      ],
    },

    proposito: {
      key: "proposito",
      topicName: "Propósito y decisiones",
      tag: "Palabra de Propósito",
      title: "Propósito en Camino",
      verse: "«Porque yo sé los planes que tengo para ustedes —declara el Señor—, planes de bienestar y no de calamidad, a fin de darles un futuro y una esperanza.»",
      ref: "Jeremías 29:11",
      paragraphs: [
        "Sentir el deseo de crecer, tomar una decisión importante o preguntarte hacia dónde va tu vida es una señal hermosa: tu corazón sabe que fuiste creado para algo con sentido eterno.",
        "Dios no te muestra todo el mapa de una sola vez, pero sí ilumina el siguiente paso que necesitas dar. Confía en que tus talentos, tu historia y tus ganas de servir tienen un lugar muy valioso."
      ],
      prayer: "Señor, guía mis pasos y aclara mi visión. Enséñame a escuchar tu voz en cada decisión importante y úsame para ser de bendición donde me pongas. Amén.",
      shortSupport: "Sobre tu búsqueda de propósito y dirección: Salmo 32:8 dice «Yo te instruiré, yo te mostraré el camino que debes seguir.» Da un paso firme hoy.",
      storyPalette: ["#e9e2ff", "#ffe8d6", "#fff4cf"],
      storyHighlight: "Dios tiene planes de bienestar, futuro y esperanza para ti.",
      recommended: {
        label: "Ver la última prédica en nuestro canal",
        url: config?.ultimaPredica?.url || "https://www.youtube.com/watch?v=0W4--vjRado",
      },
      keywords: [
        "proposito", "llamado", "direccion", "decision", "decisiones", "elegir",
        "perdido", "perdida", "confundido", "confundida", "camino", "voluntad",
        "servir", "servicio", "ministerio", "talento", "talentos", "don", "dones",
        "crecer", "crecimiento", "cambiar", "cambio", "empezar", "comienzo",
        "futuro", "sueño", "sueno", "suenos", "vocacion", "liderazgo", "sabiduria"
      ],
    },

    fe_duda: {
      key: "fe_duda",
      topicName: "Fe, perdón y cercanía con Dios",
      tag: "Palabra de Gracia",
      title: "Siempre Puedes Volver",
      verse: "«Acérquense a Dios, y él se acercará a ustedes… Porque el Señor es compasivo y clemente, lento para la ira y grande en amor.»",
      ref: "Santiago 4:8 · Salmo 103:8",
      paragraphs: [
        "Si últimamente te has sentido distante, con dudas, o cargando culpas del pasado, queremos decirte algo claro: la puerta de la gracia de Dios nunca se cerró para ti. Él no espera que llegues perfecto, solo que llegues sincero.",
        "Las preguntas honestas no alejan a Dios; al contrario, son el comienzo de una fe más real y profunda. Hoy puedes empezar de nuevo, sin condena y con la certeza de que su amor te recibe con los brazos abiertos."
      ],
      prayer: "Señor, vengo a ti tal como soy, con mis preguntas y mi deseo de conocerte más. Perdona mis errores, renueva mi fe y ayúdame a caminar cada día más cerca de ti. Amén.",
      shortSupport: "Sobre tu relación con Dios y tus preguntas: Romanos 8:1 nos recuerda que en Cristo hay gracia y un nuevo comienzo. Nos encantaría conversar contigo sin juicios.",
      storyPalette: ["#e3ecff", "#f3e6ff", "#fdeaf2"],
      storyHighlight: "Su gracia te recibe hoy con los brazos abiertos.",
      recommended: {
        label: "Escuchar el último mensaje en YouTube",
        url: config?.ultimaPredica?.url || "https://www.youtube.com/watch?v=0W4--vjRado",
      },
      keywords: [
        "duda", "dudas", "fe", "lejos", "alejado", "alejada", "frio", "fria",
        "volver", "regresar", "perdon", "perdonar", "culpa", "culpable", "pecado",
        "verguenza", "dios", "jesus", "cristo", "espiritu", "escuchar", "silencio",
        "creer", "biblia", "palabra", "orar", "oracion", "error", "errores",
        "arrepentido", "comenzar", "nuevo", "bautismo", "salvacion"
      ],
    },

    soledad_comunidad: {
      key: "soledad_comunidad",
      topicName: "Comunidad y compañía",
      tag: "Palabra de Comunidad",
      title: "Nunca Caminas Solo",
      verse: "«Más valen dos que uno, porque obtienen más fruto de su esfuerzo. Si caen, el uno levanta al otro… Y el Señor va delante de ti; nunca te dejará ni te abandonará.»",
      ref: "Eclesiastés 4:9-10 · Deuteronomio 31:8",
      paragraphs: [
        "Sentirse solo incluso estando rodeado de gente es una experiencia más común de lo que parece, pero no fuiste diseñado para caminar aislado. Hay un valor enorme en encontrar un lugar donde te escuchen, te conozcan por tu nombre y celebren tu vida.",
        "En Iglesia Internacional Cordero de Dios creemos en una fe que se vive en familia y amistad real. Si estás buscando un espacio cálido donde conectar, aquí siempre hay una silla esperando por ti."
      ],
      prayer: "Dios fiel, gracias porque nunca me abandonas. Sana cualquier sentimiento de soledad en mi corazón y rodéame de amistades sanas y una comunidad donde pueda crecer y amar. Amén.",
      shortSupport: "Sobre buscar compañía y comunidad: no tienes que recorrer esta etapa solo. Escríbenos por WhatsApp o visítanos; nos encantará recibirte con los brazos abiertos.",
      storyPalette: ["#ddf5ee", "#e4eeff", "#f5e8ff"],
      storyHighlight: "Fuiste creado para caminar acompañado y en comunidad.",
      recommended: {
        label: "Seguir a nuestra comunidad en Instagram",
        url: config?.enlaces?.instagram?.url || "https://www.instagram.com/iglesiainternacionalccd/",
      },
      keywords: [
        "solo", "sola", "soledad", "amigo", "amigos", "amistad", "encajar",
        "comunidad", "iglesia", "grupo", "jovenes", "companero", "companera",
        "nadie", "vacio", "vacia", "rechazo", "rechazado", "aislado", "aislada",
        "conectar", "conocer", "personas", "gente", "reunion", "visitar", "acompanar"
      ],
    },

    gratitud: {
      key: "gratitud",
      topicName: "Gratitud y alegría",
      tag: "Palabra de Gozo",
      title: "Corazón que Florece",
      verse: "«Entren por sus puertas con acción de gracias; vengan a sus atrios con himnos de alabanza… porque el Señor es bueno y su gran amor perdura para siempre.»",
      ref: "Salmo 100:4-5",
      paragraphs: [
        "Qué regalo es detenerse a reconocer lo bueno que Dios ha hecho en tu vida. Un corazón agradecido no solo disfruta más el presente, sino que también se convierte en una fuente de ánimo y luz para quienes hoy necesitan esperanza.",
        "Aprovecha esta temporada de alegría para adorar, compartir tu testimonio y animar a alguien cercano. ¡Nos encantaría celebrar contigo lo que Dios está haciendo en tu historia!"
      ],
      prayer: "Gracias, Señor, por tu fidelidad, tus cuidados y cada bendición visible e invisible en mi vida. Usa mi alegría y mi gratitud para animar a otros hoy. Amén.",
      shortSupport: "Por ese motivo de gratitud que compartiste: 1 Tesalonicenses 5:18 nos invita a dar gracias en toda circunstancia. ¡Qué alegría celebrar esto contigo!",
      storyPalette: ["#fff3c9", "#fde5f0", "#daf5e8"],
      storyHighlight: "Un corazón agradecido florece y contagia esperanza.",
      recommended: {
        label: "Celebrar con la Playlist CAP en Spotify",
        url: config?.enlaces?.spotify?.url || "https://open.spotify.com/playlist/73iT5nfMp4Gt5wADwXifgo?si=99ac878c7cf741ad",
      },
      keywords: [
        "gracias", "agradecido", "agradecida", "gratitud", "feliz", "felicidad",
        "alegria", "alegre", "bendicion", "bendecido", "bendecida", "milagro",
        "logro", "contento", "contenta", "gozo", "celebrar", "alabanza", "adorar",
        "adoracion", "bien", "genial", "hermoso", "testimonio", "victoria", "respuesta"
      ],
    },
  };

  const QUIZ_STEPS = [
    {
      id: "estado",
      question: "¿Cómo llega tu corazón hoy?",
      options: [
        { emoji: "🌿", label: "Buscando paz en medio del ruido", profile: "ansiedad" },
        { emoji: "🔥", label: "Con ganas de crecer y descubrir mi propósito", profile: "proposito" },
        { emoji: "🤍", label: "Pasando por una prueba, dolor o tristeza", profile: "salud" },
        { emoji: "🏡", label: "Pensando en mi familia o seres queridos", profile: "familia" },
        { emoji: "🧭", label: "Con dudas o queriendo volver a acercarme a Dios", profile: "fe_duda" },
        { emoji: "☀️", label: "Agradecido y con alegría en el corazón", profile: "gratitud" },
      ],
    },
    {
      id: "enfoque",
      question: "¿Qué área necesita más luz esta semana?",
      options: [
        { emoji: "🧠", label: "Calma para mi mente y buen descanso", profile: "ansiedad" },
        { emoji: "💼", label: "Dirección en trabajo, finanzas o estudios", profile: "trabajo_estudios" },
        { emoji: "💛", label: "Unidad, sanidad y amor en mi hogar", profile: "familia" },
        { emoji: "🤝", label: "Conectar con amigos y una comunidad sana", profile: "soledad_comunidad" },
        { emoji: "📖", label: "Profundizar en la Palabra y la oración", profile: "fe_duda" },
        { emoji: "🎵", label: "Adorar, servir y compartir gratitud", profile: "gratitud" },
      ],
    },
    {
      id: "paso",
      question: "¿Qué te ayudaría a dar el siguiente paso?",
      options: [
        { emoji: "💬", label: "Conversar con alguien del equipo que me escuche" },
        { emoji: "🎧", label: "Escuchar alabanza y la Playlist CAP" },
        { emoji: "🎥", label: "Ver la última prédica en YouTube" },
        { emoji: "🏠", label: "Visitar una reunión presencial de ICCD" },
        { emoji: "🙏", label: "Recibir oración durante esta semana" },
        { emoji: "🌱", label: "Ir a mi ritmo con una palabra para reflexionar" },
      ],
    },
    {
      id: "texto",
      question: "Cuéntanos con tus palabras (opcional)",
      isFreeTextStep: true,
      quickChips: [
        "Paz mental y descanso",
        "Por mi familia",
        "Trabajo o estudios",
        "Salud y fortaleza",
        "Solo recibir mi palabra",
      ],
    },
  ];

  /* ==========================================================================
     Motor de análisis de texto en español (normalización + detección múltiple)
     ========================================================================== */

  function normalizeSpanish(str) {
    return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9ñ\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function detectTopicsFromText(rawText) {
    const normalized = normalizeSpanish(rawText);
    if (!normalized) return [];

    const words = normalized.split(" ");
    const matches = [];

    Object.values(PROFILES).forEach((profile) => {
      let hits = 0;
      const matchedWords = new Set();

      profile.keywords.forEach((kw) => {
        const kwNorm = normalizeSpanish(kw);
        const found = words.some(
          (w) => w === kwNorm || (kwNorm.length >= 5 && w.startsWith(kwNorm))
        );
        if (found) {
          hits += 1;
          matchedWords.add(kw);
        }
      });

      if (hits > 0) {
        matches.push({
          key: profile.key,
          topicName: profile.topicName,
          hits,
          matchedWords: Array.from(matchedWords),
        });
      }
    });

    return matches.sort((a, b) => b.hits - a.hits);
  }

  function analyzeQuiz(state) {
    const scores = {};
    Object.keys(PROFILES).forEach((k) => {
      scores[k] = 0;
    });

    const p1 = state.answers.estado?.profile;
    const p2 = state.answers.enfoque?.profile;
    if (p1 && p1 in scores) scores[p1] += 3;
    if (p2 && p2 in scores) scores[p2] += 2;

    const combinedText = [state.selectedChip, state.customNote]
      .filter(Boolean)
      .join(" ");
    const detected = detectTopicsFromText(combinedText);

    detected.forEach((item, idx) => {
      // Las palabras escritas por la persona tienen peso prioritario
      const boost = idx === 0 ? 4 + Math.min(item.hits, 3) : 2 + Math.min(item.hits, 2);
      scores[item.key] = (scores[item.key] || 0) + boost;
    });

    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const primaryKey = ranked[0][0];
    const primaryProfile = PROFILES[primaryKey] || PROFILES.ansiedad;

    // Tema secundario detectado en el texto distinto al perfil principal
    const secondaryTopic = detected.find((d) => d.key !== primaryKey) || null;
    const secondaryProfile = secondaryTopic ? PROFILES[secondaryTopic.key] : null;

    return {
      primaryProfile,
      secondaryProfile,
      detectedTopics: detected,
    };
  }

  /* ==========================================================================
     Generador de tarjeta 1080×1920 (9:16) para Historia de Instagram (<canvas>)
     ========================================================================== */

  function wrapCanvasText(ctx, text, maxWidth) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let current = "";

    words.forEach((word) => {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    });
    if (current) lines.push(current);
    return lines;
  }

  function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function loadImageSafe(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function renderInstagramStoryBlob(analysis, userName) {
    const W = 1080;
    const H = 1920;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const { primaryProfile } = analysis;
    const [c1, c2, c3] = primaryProfile.storyPalette;

    // 1. Degradado multipastel de fondo
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, c1);
    bgGrad.addColorStop(0.5, c2);
    bgGrad.addColorStop(1, c3);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Orbes pastel suaves para profundidad
    const orbs = [
      { x: 180, y: 260, r: 420, color: "rgba(255, 255, 255, 0.55)" },
      { x: 920, y: 580, r: 380, color: "rgba(255, 218, 236, 0.5)" },
      { x: 200, y: 1560, r: 440, color: "rgba(255, 244, 206, 0.55)" },
      { x: 900, y: 1680, r: 400, color: "rgba(208, 240, 255, 0.5)" },
    ];
    orbs.forEach((o) => {
      const g = ctx.createRadialGradient(o.x, o.y, 10, o.x, o.y, o.r);
      g.addColorStop(0, o.color);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
    });

    // 3. Textura de granito (film grain) ligera sobre un patrón reutilizable
    const grainCanvas = document.createElement("canvas");
    grainCanvas.width = 180;
    grainCanvas.height = 180;
    const gCtx = grainCanvas.getContext("2d");
    if (gCtx) {
      const imgData = gCtx.createImageData(180, 180);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const shade = Math.random() > 0.5 ? 255 : 28;
        data[i] = shade;
        data[i + 1] = shade;
        data[i + 2] = shade;
        data[i + 3] = 16;
      }
      gCtx.putImageData(imgData, 0, 0);
      const pattern = ctx.createPattern(grainCanvas, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, W, H);
      }
    }

    // 4. Encabezado: Logo circular de la iglesia
    const logo = await loadImageSafe("assets/logo-iccd.png");
    const cx = W / 2;
    const logoY = 235;
    const logoR = 86;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, logoY, logoR + 10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.shadowColor = "rgba(42, 54, 118, 0.16)";
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 10;
    ctx.fill();
    ctx.restore();

    if (logo) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, logoY, logoR, 0, Math.PI * 2);
      ctx.clip();
      const scale = 1.14;
      const drawSize = logoR * 2 * scale;
      ctx.drawImage(logo, cx - drawSize / 2, logoY - drawSize / 2, drawSize, drawSize);
      ctx.restore();
    }

    // 5. Nombre iglesia & Eyebrow
    ctx.textAlign = "center";
    ctx.fillStyle = "#485170";
    ctx.font = '600 30px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText("IGLESIA INTERNACIONAL CORDERO DE DIOS", cx, 388);

    // Pastilla de categoría
    const pillText = userName
      ? `MI PALABRA DE HOY · ${userName.toUpperCase()}`
      : `BRÚJULA DEL ALMA · ${primaryProfile.tag.toUpperCase()}`;
    ctx.font = '700 28px "Plus Jakarta Sans", -apple-system, sans-serif';
    const pillW = Math.min(ctx.measureText(pillText).width + 72, 880);
    drawRoundedRect(ctx, cx - pillW / 2, 434, pillW, 64, 32);
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.fill();
    ctx.fillStyle = "#5d2696";
    ctx.fillText(pillText, cx, 476);

    // 6. Tarjeta principal translúcida (glass pastel)
    const cardX = 86;
    const cardY = 550;
    const cardW = W - 172;
    const cardH = 980;

    ctx.save();
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 54);
    ctx.fillStyle = "rgba(255, 255, 255, 0.84)";
    ctx.shadowColor = "rgba(56, 62, 128, 0.14)";
    ctx.shadowBlur = 46;
    ctx.shadowOffsetY = 18;
    ctx.fill();
    ctx.restore();

    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 54);
    ctx.strokeStyle = "rgba(116, 124, 182, 0.28)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Título del resultado dentro de la tarjeta
    ctx.fillStyle = "#1a2138";
    ctx.font = '700 62px "Plus Jakarta Sans", -apple-system, sans-serif';
    const titleLines = wrapCanvasText(ctx, primaryProfile.title, cardW - 120);
    let yCursor = cardY + 135;
    titleLines.forEach((line) => {
      ctx.fillText(line, cx, yCursor);
      yCursor += 74;
    });

    // Línea divisoria pastel
    yCursor += 18;
    ctx.beginPath();
    ctx.moveTo(cx - 80, yCursor);
    ctx.lineTo(cx + 80, yCursor);
    ctx.strokeStyle = "rgba(124, 75, 196, 0.35)";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.stroke();

    // Versículo completo
    yCursor += 86;
    ctx.fillStyle = "#1e2744";
    ctx.font = 'italic 500 41px "DM Sans", Georgia, serif';
    const verseLines = wrapCanvasText(ctx, primaryProfile.verse, cardW - 130);
    verseLines.slice(0, 8).forEach((line) => {
      ctx.fillText(line, cx, yCursor);
      yCursor += 58;
    });

    // Cita bíblica
    yCursor += 30;
    ctx.fillStyle = "#1d3aa6";
    ctx.font = '700 36px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText(`— ${primaryProfile.ref}`, cx, yCursor);

    // Frase corta de ánimo al pie de la tarjeta
    const highlightLines = wrapCanvasText(ctx, primaryProfile.storyHighlight, cardW - 140);
    ctx.fillStyle = "#485170";
    ctx.font = '500 33px "DM Sans", -apple-system, sans-serif';
    let footY = cardY + cardH - 128;
    highlightLines.slice(0, 2).forEach((line) => {
      ctx.fillText(line, cx, footY);
      footY += 46;
    });

    // 7. Invitación a interactuar + Etiqueta de Instagram de la iglesia
    drawRoundedRect(ctx, 96, 1606, W - 192, 132, 40);
    ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
    ctx.fill();
    ctx.strokeStyle = "rgba(168, 32, 99, 0.28)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = "#a82063";
    ctx.font = '700 36px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText("@iglesiainternacionalccd", cx, 1664);

    ctx.fillStyle = "#485170";
    ctx.font = '500 26px "DM Sans", -apple-system, sans-serif';
    ctx.fillText("Etiquétanos y descubre tu palabra en el link de nuestra bio", cx, 1710);

    ctx.fillStyle = "rgba(42, 50, 82, 0.72)";
    ctx.font = '600 26px "DM Sans", -apple-system, sans-serif';
    ctx.fillText("jamirou.github.io/linktreeiccd", cx, 1812);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }

  /* ==========================================================================
     Controlador del Modal del Mini Test
     ========================================================================== */

  function initSmartQuiz() {
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
      selectedChip: "",
      customNote: "",
      userName: "",
    };

    function resetQuiz() {
      state.stepIndex = 0;
      state.answers = {};
      state.selectedChip = "";
      state.customNote = "";
      state.userName = "";
      renderStep();
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

      if (!step.isFreeTextStep) {
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
            state.stepIndex += 1;
            renderStep();
          });

          optionsWrap.appendChild(btn);
        });

        stage.appendChild(optionsWrap);
      } else {
        // Paso 4: Nombre opcional + escritura libre con detección en vivo + chips rápidos
        const helper = document.createElement("p");
        helper.className = "quiz-helper";
        helper.textContent = "Escribe cómo te sientes o por qué quieres oración: identificamos palabras clave para entregarte una respuesta más personal.";
        stage.appendChild(helper);

        // Nombre opcional
        const nameWrap = document.createElement("div");
        nameWrap.className = "quiz-field";

        const nameLabel = document.createElement("label");
        nameLabel.className = "quiz-note-label";
        nameLabel.htmlFor = "quiz-user-name";
        nameLabel.textContent = "Tu nombre (opcional)";

        const nameInput = document.createElement("input");
        nameInput.id = "quiz-user-name";
        nameInput.type = "text";
        nameInput.autocomplete = "given-name";
        nameInput.maxLength = 40;
        nameInput.className = "quiz-note-input";
        nameInput.placeholder = "Ej: Camila, Mateo...";
        nameInput.value = state.userName;
        nameInput.addEventListener("input", (e) => {
          state.userName = e.target.value;
        });

        nameWrap.append(nameLabel, nameInput);
        stage.appendChild(nameWrap);

        // Textarea autoajustable con detector de palabras clave en vivo
        const noteWrap = document.createElement("div");
        noteWrap.className = "quiz-field";

        const noteLabel = document.createElement("label");
        noteLabel.className = "quiz-note-label";
        noteLabel.htmlFor = "quiz-prayer-note";
        noteLabel.textContent = "¿Qué tienes en tu corazón o en mente hoy?";

        const textarea = document.createElement("textarea");
        textarea.id = "quiz-prayer-note";
        textarea.rows = 3;
        textarea.maxLength = 320;
        textarea.className = "quiz-note-textarea";
        textarea.placeholder = "Ej: He estado con mucho estrés por mis exámenes en la U y quiero orar por la salud de mi mamá...";
        textarea.value = state.customNote;

        const detectedBar = document.createElement("div");
        detectedBar.className = "quiz-detected-bar";
        detectedBar.setAttribute("aria-live", "polite");

        const updateDetectedBadges = () => {
          const found = detectTopicsFromText(state.customNote);
          detectedBar.replaceChildren();
          if (found.length === 0) return;

          const prefix = document.createElement("span");
          prefix.className = "quiz-detected-label";
          prefix.textContent = "Temas identificados:";
          detectedBar.appendChild(prefix);

          found.slice(0, 3).forEach((item) => {
            const chip = document.createElement("span");
            chip.className = "quiz-detected-chip";
            chip.textContent = item.topicName;
            detectedBar.appendChild(chip);
          });
        };

        textarea.addEventListener("input", (e) => {
          state.customNote = e.target.value;
          updateDetectedBadges();
        });

        noteWrap.append(noteLabel, textarea, detectedBar);
        stage.appendChild(noteWrap);
        updateDetectedBadges();

        // Chips rápidos de apoyo
        const chipsLabel = document.createElement("p");
        chipsLabel.className = "quiz-note-label quiz-chips-heading";
        chipsLabel.textContent = "O elige un motivo rápido:";
        stage.appendChild(chipsLabel);

        const chipsWrap = document.createElement("div");
        chipsWrap.className = "quiz-quick-chips";

        step.quickChips.forEach((chipText) => {
          const chipBtn = document.createElement("button");
          chipBtn.type = "button";
          chipBtn.className = "quiz-chip-btn";
          chipBtn.setAttribute("aria-pressed", String(state.selectedChip === chipText));
          chipBtn.textContent = chipText;
          chipBtn.addEventListener("click", () => {
            state.selectedChip = state.selectedChip === chipText ? "" : chipText;
            chipsWrap.querySelectorAll(".quiz-chip-btn").forEach((b) => {
              b.setAttribute("aria-pressed", String(b.textContent === state.selectedChip));
            });
          });
          chipsWrap.appendChild(chipBtn);
        });

        stage.appendChild(chipsWrap);
      }

      if (state.stepIndex > 0 || step.isFreeTextStep) {
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

        if (step.isFreeTextStep) {
          const finishBtn = document.createElement("button");
          finishBtn.type = "button";
          finishBtn.className = "quiz-btn quiz-btn--primary";
          finishBtn.textContent = "Descubrir mi palabra";
          finishBtn.addEventListener("click", () => {
            renderResult();
          });
          navRow.appendChild(finishBtn);
        }

        stage.appendChild(navRow);
      }
    }

    function renderResult() {
      if (progressWrap) progressWrap.hidden = true;

      const analysis = analyzeQuiz(state);
      const { primaryProfile, secondaryProfile, detectedTopics } = analysis;
      const cleanName = state.userName.trim();
      const customText = state.customNote.trim();
      const prayerTopic = [state.selectedChip, customText].filter(Boolean).join(" — ") || "Recibir mi palabra de hoy";

      const detectedSummary = detectedTopics.length > 0
        ? detectedTopics.slice(0, 3).map((d) => d.topicName).join(", ")
        : "";

      const whatsappLines = [
        cleanName
          ? `¡Hola! Soy ${cleanName} y acabo de hacer el mini test en los enlaces de ICCD ✨`
          : "¡Hola! Acabo de hacer el mini test en los enlaces de ICCD ✨",
        "",
        `• Mi palabra de hoy: ${primaryProfile.title} (${primaryProfile.ref})`,
        `• Cómo llego hoy: ${state.answers.estado?.label || ""}`,
        `• Área a fortalecer: ${state.answers.enfoque?.label || ""}`,
        `• Siguiente paso: ${state.answers.paso?.label || ""}`,
      ];
      if (detectedSummary) {
        whatsappLines.push(`• Temas clave: ${detectedSummary}`);
      }
      whatsappLines.push(`• Lo que compartí / oración: ${prayerTopic}`);
      whatsappLines.push("", "¡Bendiciones!");

      stage.replaceChildren();

      // 1. Postal principal con respuesta completa
      const card = document.createElement("article");
      card.className = "quiz-result-card";

      const tag = document.createElement("span");
      tag.className = "quiz-result-card__tag";
      tag.textContent = cleanName
        ? `${primaryProfile.tag} · Para ${cleanName}`
        : primaryProfile.tag;

      const title = document.createElement("h2");
      title.className = "quiz-result-card__title";
      title.textContent = primaryProfile.title;

      const verse = document.createElement("blockquote");
      verse.className = "quiz-result-card__verse";
      verse.textContent = primaryProfile.verse;

      const ref = document.createElement("span");
      ref.className = "quiz-result-card__ref";
      ref.textContent = primaryProfile.ref;

      card.append(tag, title, verse, ref);

      // Párrafos completos de reflexión
      primaryProfile.paragraphs.forEach((paragraph, idx) => {
        const p = document.createElement("p");
        p.className = "quiz-result-card__reflection";
        p.textContent = idx === 0 && cleanName ? `${cleanName}, ${paragraph.charAt(0).toLowerCase()}${paragraph.slice(1)}` : paragraph;
        card.appendChild(p);
      });

      // Nota inteligente adicional cuando se detectaron temas en lo que escribió
      if (customText && (secondaryProfile || detectedTopics.length > 0)) {
        const insightBox = document.createElement("div");
        insightBox.className = "quiz-insight-box";

        const insightTitle = document.createElement("strong");
        insightTitle.className = "quiz-insight-box__title";
        insightTitle.textContent = "Por lo que nos compartiste:";

        const insightText = document.createElement("p");
        insightText.className = "quiz-insight-box__text";
        insightText.textContent = secondaryProfile
          ? secondaryProfile.shortSupport
          : primaryProfile.shortSupport;

        insightBox.append(insightTitle, insightText);
        card.appendChild(insightBox);
      }

      // Oración guiada breve
      const prayerBox = document.createElement("div");
      prayerBox.className = "quiz-prayer-box";

      const prayerTitle = document.createElement("strong");
      prayerTitle.className = "quiz-prayer-box__title";
      prayerTitle.textContent = "Una breve oración para hoy:";

      const prayerText = document.createElement("p");
      prayerText.className = "quiz-prayer-box__text";
      prayerText.textContent = primaryProfile.prayer;

      prayerBox.append(prayerTitle, prayerText);
      card.appendChild(prayerBox);

      // Recomendación conectada con la iglesia
      if (primaryProfile.recommended?.url) {
        const recLink = document.createElement("a");
        recLink.className = "quiz-rec-link";
        recLink.href = primaryProfile.recommended.url;
        recLink.target = "_blank";
        recLink.rel = "noopener noreferrer";
        recLink.textContent = `→ ${primaryProfile.recommended.label}`;
        card.appendChild(recLink);
      }

      // 2. Acciones: Instagram Stories (PNG 9:16), WhatsApp, Copiar y Repetir
      const actions = document.createElement("div");
      actions.className = "quiz-actions";

      const igStoryBtn = document.createElement("button");
      igStoryBtn.type = "button";
      igStoryBtn.className = "quiz-btn quiz-btn--instagram";
      igStoryBtn.id = "share-ig-story-btn";
      igStoryBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.2"/>
          <circle cx="12" cy="12" r="4.2"/>
          <circle cx="17.5" cy="6.5" r="1.05" fill="currentColor" stroke="none"/>
        </svg>
        <span>Compartir en Historia de Instagram</span>
      `;

      igStoryBtn.addEventListener("click", async () => {
        const labelSpan = igStoryBtn.querySelector("span");
        const originalText = labelSpan ? labelSpan.textContent : "";
        igStoryBtn.disabled = true;
        if (labelSpan) labelSpan.textContent = "Creando tu historia...";

        try {
          const blob = await renderInstagramStoryBlob(analysis, cleanName);
          if (!blob) {
            notify("No pudimos generar la imagen en este navegador");
            return;
          }

          const file = new File([blob], "mi-palabra-iccd.png", { type: "image/png" });

          // En teléfonos modernos abre la hoja nativa (Instagram -> Historias)
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: `${primaryProfile.title} — ICCD`,
                text: "Mi palabra de hoy en @iglesiainternacionalccd ✨",
              });
              notify("¡Etiquétanos como @iglesiainternacionalccd!");
              return;
            } catch (err) {
              if (err && err.name === "AbortError") return;
            }
          }

          // Fallback universal: descarga directa del PNG 1080x1920 listo para Stories
          const url = URL.createObjectURL(blob);
          const dl = document.createElement("a");
          dl.href = url;
          dl.download = "mi-palabra-iccd.png";
          document.body.appendChild(dl);
          dl.click();
          dl.remove();
          setTimeout(() => URL.revokeObjectURL(url), 4000);
          notify("Imagen 9:16 guardada — súbela a tu Historia y etiqueta @iglesiainternacionalccd");
        } finally {
          igStoryBtn.disabled = false;
          if (labelSpan) labelSpan.textContent = originalText;
        }
      });

      const waLink = document.createElement("a");
      waLink.className = "quiz-btn quiz-btn--whatsapp";
      waLink.href = buildWhatsAppUrl(whatsappLines.join("\n"));
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
        const textToCopy = `${primaryProfile.verse} — ${primaryProfile.ref} (@iglesiainternacionalccd)`;
        if (navigator.clipboard?.writeText) {
          try {
            await navigator.clipboard.writeText(textToCopy);
            notify("Versículo copiado");
            return;
          } catch {
            // Fallback abajo
          }
        }
        notify("Selecciona el texto para copiarlo");
      });

      const restartBtn = document.createElement("button");
      restartBtn.type = "button";
      restartBtn.className = "quiz-btn quiz-btn--ghost";
      restartBtn.textContent = "Repetir test";
      restartBtn.addEventListener("click", resetQuiz);

      secondary.append(copyBtn, restartBtn);

      const igTip = document.createElement("p");
      igTip.className = "quiz-ig-tip";
      igTip.innerHTML = `¿La subes a tu Historia? Etiquétanos en <a href="${config?.enlaces?.instagram?.url || "https://www.instagram.com/iglesiainternacionalccd/"}" target="_blank" rel="noopener noreferrer">@iglesiainternacionalccd</a> para compartirla.`;

      actions.append(igStoryBtn, waLink, secondary, igTip);
      stage.append(card, actions);

      // Lleva el scroll del modal arriba para leer desde el título
      dialog.scrollTop = 0;
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

  initSmartQuiz();
})();
