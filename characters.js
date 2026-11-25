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
     8 Personajes Bíblicos (4 hombres y 4 mujeres, determinados por personalidad)
     ========================================================================== */

  const CHARACTERS = {
    david: {
      id: "david",
      name: "David",
      archetype: "El Corazón Apasionado y Creativo",
      avatar: "assets/avatars/david.jpg",
      traits: ["Creativo", "Valiente", "Sensible"],
      paragraphs: [
        "Tienes un corazón auténtico, expresivo y lleno de vida. Como David —el joven pastor, músico y rey—, sientes las cosas con intensidad y encuentras en la música, la creatividad y la adoración sincera la mejor forma de conectarte con Dios.",
        "Aunque a veces sientas que los «gigantes» frente a ti son demasiado grandes, tu verdadero superpoder no es parecer perfecto, sino tener un corazón honesto que se atreve a dar el paso con fe."
      ],
      verse: "«La gente se fija en las apariencias, pero yo me fijo en el corazón.»",
      ref: "1 Samuel 16:7",
      challenge: "Dedica 5 minutos hoy a poner una canción de la Playlist CAP y agradecerle a Dios con total honestidad.",
      storyPalette: ["#dcebff", "#dff7ef", "#efe6ff"],
      storyQuote: "Corazón creativo, música en el alma y fe frente a los gigantes.",
    },

    ester: {
      id: "ester",
      name: "Ester",
      archetype: "La Estratega Valiente",
      avatar: "assets/avatars/ester.jpg",
      traits: ["Valiente", "Sabia", "Oportuna"],
      paragraphs: [
        "Combinas sensibilidad, inteligencia emocional y una valentía silenciosa que sorprende cuando llega el momento decisivo. Como Ester, no actúas por impulso: escuchas, oras, eliges el instante exacto y te atreves a defender a quienes te rodean.",
        "Incluso cuando sientes nervios por dentro, tu determinación pesa más que el miedo. Dios suele colocarte en lugares clave justo cuando alguien necesita tu voz."
      ],
      verse: "«¿Y quién sabe si no has llegado al trono precisamente para un momento como este?»",
      ref: "Ester 4:14",
      challenge: "Piensa en alguien de tu entorno que necesite apoyo esta semana y da el primer paso para animarlo.",
      storyPalette: ["#f6e3ff", "#fde4f1", "#fff2d6"],
      storyQuote: "Sabiduría, gracia y valentía para el momento exacto.",
    },

    pedro: {
      id: "pedro",
      name: "Pedro",
      archetype: "El Entusiasta Leal",
      avatar: "assets/avatars/pedro.jpg",
      traits: ["Apasionado", "Audaz", "Leal"],
      paragraphs: [
        "¡Eres pura energía y corazón abierto! Como Pedro —el pescador que se lanzó de la barca para caminar sobre el agua—, prefieres arriesgarte e intentar algo grande antes que quedarte mirando desde la orilla.",
        "No temes reconocer cuando te equivocas porque tu amor y tus ganas de aprender siempre te levantan más fuerte. Tu entusiasmo contagia a todo el grupo y te convierte en una roca para tus amigos."
      ],
      verse: "«Señor, si eres tú, mándame ir hacia ti sobre el agua. —Ven —dijo Jesús.»",
      ref: "Mateo 14:28-29",
      challenge: "Atrévete esta semana a dar un paso de fe que venías postergando, sin esperar a tener todo perfecto.",
      storyPalette: ["#d7ecff", "#e6f6ff", "#fff1da"],
      storyQuote: "Entusiasmo sin filtro, corazón leal y pasos valientes.",
    },

    rut: {
      id: "rut",
      name: "Rut",
      archetype: "La Amiga Incondicional",
      avatar: "assets/avatars/rut.jpg",
      traits: ["Fiel", "Empática", "Esforzada"],
      paragraphs: [
        "Tu lealtad y tu calidez hacen que las personas se sientan en casa cuando están contigo. Como Rut, no huyes cuando llegan las temporadas difíciles: te quedas, acompañas con hechos concretos y construyes futuro con humildad y constancia.",
        "Quizá a veces no buscas los reflectores, pero tu fidelidad en lo cotidiano deja una huella tan profunda que transforma generaciones enteras."
      ],
      verse: "«A donde tú vayas, iré yo, y donde tú vivas, viviré. Tu pueblo será mi pueblo, y tu Dios será mi Dios.»",
      ref: "Rut 1:16",
      challenge: "Escríbele hoy un mensaje inesperado a un amigo o familiar para recordarle que cuentas con él y él contigo.",
      storyPalette: ["#ffe6d6", "#fff4d2", "#fde6ef"],
      storyQuote: "Lealtad que abraza, constancia humilde y corazón de oro.",
    },

    daniel: {
      id: "daniel",
      name: "Daniel",
      archetype: "El Sabio Inquebrantable",
      avatar: "assets/avatars/daniel.jpg",
      traits: ["Íntegro", "Sereno", "Excelente"],
      paragraphs: [
        "Destacas por tu claridad mental, tu calma bajo presión y tu coherencia. Como Daniel, sabes destacar con excelencia en tus estudios, trabajo o proyectos sin negociar tus valores ni perder tu paz interior cuando el entorno va al revés.",
        "Las personas confían en tu criterio porque tus decisiones nacen de la oración, la disciplina y una profunda confianza en que Dios tiene el control incluso frente a los leones."
      ],
      verse: "«En él se halló un espíritu extraordinario, además de conocimiento, entendimiento y sabiduría.»",
      ref: "Daniel 5:12",
      challenge: "Aparta 10 minutos tranquilos al comenzar tu día para ordenar tus prioridades en oración antes de mirar el celular.",
      storyPalette: ["#dde6ff", "#e9e3ff", "#fff3cf"],
      storyQuote: "Mente clara, integridad serena y excelencia en todo.",
    },

    debora: {
      id: "debora",
      name: "Débora",
      archetype: "La Líder Visionaria",
      avatar: "assets/avatars/debora.jpg",
      traits: ["Líder", "Justa", "Inspiradora"],
      paragraphs: [
        "Tienes un don natural para ver el panorama completo, aconsejar con justicia y despertar lo mejor en los demás. Como Débora —jueza, profetisa y líder en Israel—, la gente acude a ti cuando necesita claridad y empuje para avanzar.",
        "No lideras para lucirte, sino para levantar a otros y celebrar las victorias en equipo. Donde hay duda o parálisis, tu voz trae dirección y ánimo."
      ],
      verse: "«¡Despierta, despierta, Débora! ¡Levántate y entona un cántico!»",
      ref: "Jueces 5:12",
      challenge: "Anima esta semana a alguien que duda de sus talentos y recuérdale una cualidad valiosa que ves en esa persona.",
      storyPalette: ["#d9f5e8", "#e8f6e0", "#e3efff"],
      storyQuote: "Visión clara, consejo sabio y liderazgo que levanta a otros.",
    },

    pablo: {
      id: "pablo",
      name: "Pablo",
      archetype: "El Apasionado Transformador",
      avatar: "assets/avatars/pablo.jpg",
      traits: ["Resiliente", "Curioso", "Comunicador"],
      paragraphs: [
        "Tu mente siempre está conectando ideas y buscando cómo llevar un mensaje de esperanza más lejos. Como Pablo, eres incansable cuando encuentras un propósito verdadero: estudias, preguntas, escribes y transformas cada obstáculo en una oportunidad.",
        "Tu resiliencia inspira a otros a no rendirse. Sabes que la gracia de Dios puede renovar cualquier historia y usarla para impactar a muchísimas personas."
      ],
      verse: "«Todo lo puedo en Cristo que me fortalece.»",
      ref: "Filipenses 4:13",
      challenge: "Comparte con alguien una idea, versículo o prédica que te haya marcado últimamente.",
      storyPalette: ["#ffe7d4", "#e4eeff", "#f3e6ff"],
      storyQuote: "Mente curiosa, fe resiliente y pasión por compartir esperanza.",
    },

    maria: {
      id: "maria",
      name: "María de Betania",
      archetype: "El Corazón Contemplativo",
      avatar: "assets/avatars/maria.jpg",
      traits: ["Profunda", "Generosa", "Atenta"],
      paragraphs: [
        "Valoras lo verdaderamente importante por encima del apuro y el ruido. Como María de Betania —quien eligió sentarse a escuchar a Jesús y entregar lo mejor que tenía—, percibes los detalles que otros pasan por alto y amas con profundidad.",
        "Tu sensibilidad espiritual y tu generosidad sincera crean espacios de paz donde las personas pueden bajar la guardia y sentirse genuinamente escuchadas."
      ],
      verse: "«María ha escogido la mejor parte, y nadie se la quitará.»",
      ref: "Lucas 10:42",
      challenge: "Regálate hoy una pausa sin prisas para disfrutar una conversación real o leer un capítulo de los Evangelios con calma.",
      storyPalette: ["#fae3f2", "#eee3ff", "#fff3e0"],
      storyQuote: "Corazón atento, amor sin medida y paz por encima del apuro.",
    },
  };

  /* ==========================================================================
     7 Preguntas entretenidas de la Biblia y la vida diaria (sin sesgo de género)
     ========================================================================== */

  const CHARACTER_QUESTIONS = [
    {
      question: "Un amigo enfrenta un «gigante» (un problema que parece imposible). ¿Cuál es tu primera reacción?",
      options: [
        { emoji: "🎵", label: "Le levanto el ánimo con música, humor o creatividad", weights: { david: 3, maria: 1 } },
        { emoji: "⚡", label: "¡Vamos juntos ahora mismo, en el camino resolvemos!", weights: { pedro: 3, pablo: 1 } },
        { emoji: "🧠", label: "Respiro hondo, analizamos todo y armamos un plan sabio", weights: { daniel: 3, ester: 2 } },
        { emoji: "🤝", label: "Me siento a su lado: «No vas a caminar esto solo»", weights: { rut: 3, debora: 1 } },
      ],
    },
    {
      question: "Estás en una barca en medio del mar y ves a Jesús caminando sobre el agua. ¿Qué haces?",
      options: [
        { emoji: "🌊", label: "¡Pido bajar a caminar también, aunque me dé vértigo!", weights: { pedro: 3, david: 1 } },
        { emoji: "✨", label: "Me quedo maravillado contemplando el momento en calma", weights: { maria: 3, rut: 1 } },
        { emoji: "🧭", label: "Organizo a todos en la barca para que nadie entre en pánico", weights: { debora: 3, ester: 2 } },
        { emoji: "📝", label: "Observo cada detalle para entenderlo y contarlo al mundo", weights: { pablo: 3, daniel: 1 } },
      ],
    },
    {
      question: "Defender lo correcto hoy implica arriesgar tu comodidad. ¿Cómo actúas?",
      options: [
        { emoji: "👑", label: "Oro, preparo el momento exacto y hablo con valentía", weights: { ester: 3, debora: 2 } },
        { emoji: "🦁", label: "Me mantengo firme en mis principios con serenidad", weights: { daniel: 3, pablo: 1 } },
        { emoji: "💛", label: "Pienso primero en proteger a las personas que amo", weights: { rut: 3, maria: 1 } },
        { emoji: "🔥", label: "Salgo al frente sin dudar: si nadie da el paso, lo doy yo", weights: { david: 2, pedro: 2, debora: 2 } },
      ],
    },
    {
      question: "Tienes una tarde de sábado totalmente libre. ¿Qué plan recarga más tu corazón?",
      options: [
        { emoji: "🎧", label: "Escuchar música, crear arte o escribir lo que siento", weights: { david: 3, maria: 2 } },
        { emoji: "☕", label: "Una conversación profunda y sincera con alguien querido", weights: { maria: 3, rut: 2 } },
        { emoji: "📚", label: "Aprender algo nuevo o diseñar un proyecto grande", weights: { pablo: 3, daniel: 2 } },
        { emoji: "🎉", label: "Reunir al grupo, organizar algo genial y animar a todos", weights: { debora: 2, pedro: 2, ester: 2 } },
      ],
    },
    {
      question: "¿Qué frase bíblica resuena más con tu forma de ser?",
      options: [
        { emoji: "🛡️", label: "«¿Y quién sabe si llegaste aquí justo para esta hora?»", weights: { ester: 3, debora: 1 } },
        { emoji: "🌾", label: "«A donde tú vayas, iré yo» (lealtad en las buenas y malas)", weights: { rut: 3, maria: 1 } },
        { emoji: "✉️", label: "«Todo lo puedo en Cristo que me fortalece»", weights: { pablo: 3, pedro: 1 } },
        { emoji: "🕊️", label: "«Dios mira el corazón y da sabiduría en la prueba»", weights: { daniel: 3, david: 2 } },
      ],
    },
    {
      question: "Cuando cometes un error o algo no sale como esperabas, ¿cómo reaccionas?",
      options: [
        { emoji: "💬", label: "Pido perdón rápido y vuelvo con el doble de ganas", weights: { pedro: 3, david: 2 } },
        { emoji: "🧩", label: "Analizo con calma qué mejorar para la próxima vez", weights: { daniel: 3, debora: 2 } },
        { emoji: "💌", label: "Transformo la lección en algo útil para ayudar a otros", weights: { pablo: 3, ester: 1 } },
        { emoji: "🌿", label: "Busco un momento tranquilo a solas con Dios para sanar", weights: { maria: 3, rut: 2 } },
      ],
    },
    {
      question: "Si pudieras dejar una huella en tu iglesia este año, ¿cuál elegirías?",
      options: [
        { emoji: "🎶", label: "Inspirar adoración auténtica y creatividad con propósito", weights: { david: 3, maria: 1 } },
        { emoji: "🌟", label: "Levantar a otros para que crean en su llamado", weights: { debora: 3, ester: 2 } },
        { emoji: "🤍", label: "Ser esa persona fiel en la que todos saben que pueden confiar", weights: { rut: 3, daniel: 1 } },
        { emoji: "🚀", label: "Encender la pasión por compartir el mensaje con alegría", weights: { pablo: 2, pedro: 3 } },
      ],
    },
  ];

  /* ==========================================================================
     Generador de tarjeta 1080×1920 para Historia de Instagram con Avatar 3D Wii
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

  async function renderCharacterStoryBlob(character) {
    const W = 1080;
    const H = 1920;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const [c1, c2, c3] = character.storyPalette;
    const cx = W / 2;

    // 1. Degradado pastel
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, c1);
    bgGrad.addColorStop(0.5, c2);
    bgGrad.addColorStop(1, c3);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Orbes pastel luminosos
    const orbs = [
      { x: 180, y: 280, r: 420, color: "rgba(255, 255, 255, 0.58)" },
      { x: 920, y: 600, r: 380, color: "rgba(255, 224, 240, 0.5)" },
      { x: 220, y: 1560, r: 440, color: "rgba(255, 244, 208, 0.54)" },
    ];
    orbs.forEach((o) => {
      const g = ctx.createRadialGradient(o.x, o.y, 10, o.x, o.y, o.r);
      g.addColorStop(0, o.color);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
    });

    // 3. Textura de granito
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

    // 4. Encabezado superior con mini logo ICCD + título de sección
    const [logoImg, avatarImg] = await Promise.all([
      loadImageSafe("assets/logo-iccd.png"),
      loadImageSafe(character.avatar),
    ]);

    if (logoImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, 152, 48, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, 152, 42, 0, Math.PI * 2);
      ctx.clip();
      const s = 42 * 2 * 1.14;
      ctx.drawImage(logoImg, cx - s / 2, 152 - s / 2, s, s);
      ctx.restore();
    }

    ctx.textAlign = "center";
    ctx.fillStyle = "#485170";
    ctx.font = '700 28px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText("PLAYGROUND ICCD · ¿QUÉ PERSONAJE BÍBLICO ERES?", cx, 248);

    // 5. Tarjeta principal con Avatar 3D estilo Wii
    const cardX = 82;
    const cardY = 295;
    const cardW = W - 164;
    const cardH = 1245;

    ctx.save();
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 56);
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.shadowColor = "rgba(56, 62, 128, 0.14)";
    ctx.shadowBlur = 46;
    ctx.shadowOffsetY = 18;
    ctx.fill();
    ctx.restore();

    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 56);
    ctx.strokeStyle = "rgba(116, 124, 182, 0.28)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Marco circular grande del Avatar 3D
    const avY = cardY + 255;
    const avR = 195;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, avY, avR + 14, 0, Math.PI * 2);
    const ringGrad = ctx.createLinearGradient(cx - avR, avY - avR, cx + avR, avY + avR);
    ringGrad.addColorStop(0, "#cfe4ff");
    ringGrad.addColorStop(0.5, "#fde0f0");
    ringGrad.addColorStop(1, "#fff2c9");
    ctx.fillStyle = ringGrad;
    ctx.shadowColor = "rgba(74, 84, 152, 0.18)";
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 12;
    ctx.fill();
    ctx.restore();

    if (avatarImg) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, avY, avR, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, cx - avR, avY - avR, avR * 2, avR * 2);
      ctx.restore();
    }

    // Nombre + arquetipo
    ctx.fillStyle = "#5d2696";
    ctx.font = '700 28px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText("ERES COMO", cx, cardY + 516);

    ctx.fillStyle = "#1a2138";
    ctx.font = '700 74px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText(character.name, cx, cardY + 598);

    ctx.fillStyle = "#485170";
    ctx.font = '600 34px "DM Sans", -apple-system, sans-serif';
    ctx.fillText(character.archetype, cx, cardY + 652);

    // 3 chips de rasgos
    const chipY = cardY + 694;
    ctx.font = '700 26px "Plus Jakarta Sans", -apple-system, sans-serif';
    const chipWidths = character.traits.map((t) => ctx.measureText(t).width + 52);
    const chipGap = 18;
    const totalChipW = chipWidths.reduce((a, b) => a + b, 0) + chipGap * (chipWidths.length - 1);
    let chipX = cx - totalChipW / 2;

    character.traits.forEach((trait, i) => {
      const w = chipWidths[i];
      drawRoundedRect(ctx, chipX, chipY, w, 54, 27);
      ctx.fillStyle = "#f2e8ff";
      ctx.fill();
      ctx.fillStyle = "#4f1f85";
      ctx.fillText(trait, chipX + w / 2, chipY + 36);
      chipX += w + chipGap;
    });

    // Versículo
    ctx.fillStyle = "#1e2744";
    ctx.font = 'italic 500 37px "DM Sans", Georgia, serif';
    const verseLines = wrapCanvasText(ctx, character.verse, cardW - 130);
    let vy = cardY + 838;
    verseLines.slice(0, 5).forEach((line) => {
      ctx.fillText(line, cx, vy);
      vy += 52;
    });

    ctx.fillStyle = "#1d3aa6";
    ctx.font = '700 32px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText(`— ${character.ref}`, cx, vy + 20);

    // Frase resumen
    ctx.fillStyle = "#485170";
    ctx.font = '500 30px "DM Sans", -apple-system, sans-serif';
    const qLines = wrapCanvasText(ctx, character.storyQuote, cardW - 140);
    let qy = cardY + cardH - 96;
    qLines.slice(0, 2).forEach((line) => {
      ctx.fillText(line, cx, qy);
      qy += 42;
    });

    // 6. Invitación a etiquetar a la iglesia en Instagram
    drawRoundedRect(ctx, 96, 1606, W - 192, 132, 40);
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.fill();
    ctx.strokeStyle = "rgba(168, 32, 99, 0.28)";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = "#a82063";
    ctx.font = '700 36px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText("@iglesiainternacionalccd", cx, 1664);

    ctx.fillStyle = "#485170";
    ctx.font = '500 26px "DM Sans", -apple-system, sans-serif';
    ctx.fillText("Etiquétanos y descubre qué personaje eres en nuestra bio", cx, 1710);

    ctx.fillStyle = "rgba(42, 50, 82, 0.72)";
    ctx.font = '600 26px "DM Sans", -apple-system, sans-serif';
    ctx.fillText("jamirou.github.io/linktreeiccd", cx, 1812);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }

  /* ==========================================================================
     Módulo exportado al Playground Hub
     ========================================================================== */

  function computeCharacter(answers) {
    const scores = {};
    Object.keys(CHARACTERS).forEach((k) => {
      scores[k] = 0;
    });

    answers.forEach((opt) => {
      if (!opt?.weights) return;
      Object.entries(opt.weights).forEach(([charKey, pts]) => {
        if (charKey in scores) {
          scores[charKey] += pts;
        }
      });
    });

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return CHARACTERS[sorted[0][0]] || CHARACTERS.david;
  }

  window.ICCD_CHARACTER_GAME = {
    start(ctx) {
      const {
        stage,
        dialog,
        setHeader,
        setProgress,
        hideProgress,
        goHome,
      } = ctx;

      const state = {
        stepIndex: 0,
        answers: [],
      };

      function renderQuestion() {
        const total = CHARACTER_QUESTIONS.length;
        const current = CHARACTER_QUESTIONS[state.stepIndex];

        setHeader("Playground · Test Bíblico", "¿Qué personaje de la Biblia eres?", true);
        setProgress(state.stepIndex + 1, total);

        stage.replaceChildren();

        const qHeading = document.createElement("h2");
        qHeading.className = "quiz-question";
        qHeading.textContent = current.question;
        stage.appendChild(qHeading);

        const optionsWrap = document.createElement("div");
        optionsWrap.className = "quiz-options";

        current.options.forEach((opt) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "quiz-option";
          const isSelected = state.answers[state.stepIndex]?.label === opt.label;
          btn.setAttribute("aria-pressed", String(isSelected));

          const emoji = document.createElement("span");
          emoji.className = "quiz-option__emoji";
          emoji.setAttribute("aria-hidden", "true");
          emoji.textContent = opt.emoji;

          const text = document.createElement("span");
          text.textContent = opt.label;

          btn.append(emoji, text);
          btn.addEventListener("click", () => {
            state.answers[state.stepIndex] = opt;
            if (state.stepIndex + 1 < total) {
              state.stepIndex += 1;
              renderQuestion();
            } else {
              renderResult();
            }
          });

          optionsWrap.appendChild(btn);
        });

        stage.appendChild(optionsWrap);

        if (state.stepIndex > 0) {
          const navRow = document.createElement("div");
          navRow.className = "quiz-nav-row";

          const backBtn = document.createElement("button");
          backBtn.type = "button";
          backBtn.className = "quiz-btn quiz-btn--ghost";
          backBtn.textContent = "Pregunta anterior";
          backBtn.addEventListener("click", () => {
            state.stepIndex -= 1;
            renderQuestion();
          });

          navRow.appendChild(backBtn);
          stage.appendChild(navRow);
        }

        dialog.scrollTop = 0;
      }

      function renderResult() {
        hideProgress();
        setHeader("Tu Personaje Bíblico", "¡Descubrimos a quién te pareces!", true);

        const character = computeCharacter(state.answers);
        const waText = [
          "¡Hola! Hice el test en el Playground de ICCD 🎮✨",
          "",
          `• Mi personaje bíblico es: ${character.name} — ${character.archetype}`,
          `• Rasgos: ${character.traits.join(" · ")}`,
          `• Versículo: ${character.verse} (${character.ref})`,
          "",
          "¡Qué entretenido quedó! Bendiciones 🙌",
        ].join("\n");

        stage.replaceChildren();

        const card = document.createElement("article");
        card.className = "char-result-card";

        // Avatar 3D estilo Wii
        const avatarWrap = document.createElement("div");
        avatarWrap.className = "char-avatar-ring";

        const avatarImg = document.createElement("img");
        avatarImg.className = "char-avatar-img";
        avatarImg.src = character.avatar;
        avatarImg.alt = `Avatar animado estilo Wii de ${character.name}`;
        avatarImg.width = 160;
        avatarImg.height = 160;
        avatarImg.decoding = "async";
        avatarWrap.appendChild(avatarImg);

        const eyebrow = document.createElement("span");
        eyebrow.className = "quiz-result-card__tag";
        eyebrow.textContent = character.archetype;

        const nameEl = document.createElement("h2");
        nameEl.className = "char-result-name";
        nameEl.textContent = `¡Eres ${character.name}!`;

        const traitsWrap = document.createElement("div");
        traitsWrap.className = "char-traits";
        character.traits.forEach((trait) => {
          const chip = document.createElement("span");
          chip.className = "quiz-detected-chip";
          chip.textContent = trait;
          traitsWrap.appendChild(chip);
        });

        card.append(avatarWrap, eyebrow, nameEl, traitsWrap);

        character.paragraphs.forEach((paragraph) => {
          const p = document.createElement("p");
          p.className = "quiz-result-card__reflection";
          p.textContent = paragraph;
          card.appendChild(p);
        });

        const verseBox = document.createElement("div");
        verseBox.className = "quiz-prayer-box";

        const verseQuote = document.createElement("blockquote");
        verseQuote.className = "quiz-result-card__verse";
        verseQuote.textContent = character.verse;

        const verseRef = document.createElement("span");
        verseRef.className = "quiz-result-card__ref char-verse-ref";
        verseRef.textContent = `— ${character.ref}`;

        verseBox.append(verseQuote, verseRef);
        card.appendChild(verseBox);

        const challengeBox = document.createElement("div");
        challengeBox.className = "quiz-insight-box";

        const challengeTitle = document.createElement("strong");
        challengeTitle.className = "quiz-insight-box__title";
        challengeTitle.textContent = "Tu reto de esta semana:";

        const challengeText = document.createElement("p");
        challengeText.className = "quiz-insight-box__text";
        challengeText.textContent = character.challenge;

        challengeBox.append(challengeTitle, challengeText);
        card.appendChild(challengeBox);

        // Acciones
        const actions = document.createElement("div");
        actions.className = "quiz-actions";

        const igBtn = document.createElement("button");
        igBtn.type = "button";
        igBtn.id = "share-char-ig-btn";
        igBtn.className = "quiz-btn quiz-btn--instagram";
        igBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5.2"/>
            <circle cx="12" cy="12" r="4.2"/>
            <circle cx="17.5" cy="6.5" r="1.05" fill="currentColor" stroke="none"/>
          </svg>
          <span>Compartir mi avatar en Historia IG</span>
        `;

        igBtn.addEventListener("click", async () => {
          const span = igBtn.querySelector("span");
          const orig = span ? span.textContent : "";
          igBtn.disabled = true;
          if (span) span.textContent = "Creando tu tarjeta...";

          try {
            const blob = await renderCharacterStoryBlob(character);
            if (!blob) {
              notify("No pudimos generar la imagen en este navegador");
              return;
            }
            const fileName = `personaje-${character.id}-iccd.png`;
            const file = new File([blob], fileName, { type: "image/png" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              try {
                await navigator.share({
                  files: [file],
                  title: `¡Soy ${character.name}! — Playground ICCD`,
                  text: "Descubre qué personaje bíblico eres en @iglesiainternacionalccd ✨",
                });
                notify("¡Etiquétanos como @iglesiainternacionalccd!");
                return;
              } catch (err) {
                if (err && err.name === "AbortError") return;
              }
            }

            const url = URL.createObjectURL(blob);
            const dl = document.createElement("a");
            dl.href = url;
            dl.download = fileName;
            document.body.appendChild(dl);
            dl.click();
            dl.remove();
            setTimeout(() => URL.revokeObjectURL(url), 4000);
            notify("Tarjeta 9:16 guardada — súbela a tu Historia y etiqueta @iglesiainternacionalccd");
          } finally {
            igBtn.disabled = false;
            if (span) span.textContent = orig;
          }
        });

        const waLink = document.createElement("a");
        waLink.className = "quiz-btn quiz-btn--whatsapp";
        waLink.href = buildWhatsAppUrl(waText);
        waLink.target = "_blank";
        waLink.rel = "noopener noreferrer";
        waLink.innerHTML = `
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.78 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.83-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.18-4.94-4.38-.14-.2-1.18-1.57-1.18-2.99 0-1.42.74-2.12 1.01-2.41.26-.29.58-.36.77-.36.19 0 .38 0 .55.01.18.01.41-.07.65.49.24.58.82 2 .89 2.14.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.3-.13.59.17.29.74 1.22 1.59 1.98 1.09.97 2.02 1.27 2.31 1.42.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.65-.14.26.1 1.68.79 1.97.94.29.14.48.22.55.34.07.12.07.69-.17 1.37Z"/>
          </svg>
          <span>Enviar mi personaje a WhatsApp</span>
        `;

        const secondary = document.createElement("div");
        secondary.className = "quiz-actions__secondary";

        const replayBtn = document.createElement("button");
        replayBtn.type = "button";
        replayBtn.className = "quiz-btn quiz-btn--ghost";
        replayBtn.textContent = "Repetir test";
        replayBtn.addEventListener("click", () => {
          state.stepIndex = 0;
          state.answers = [];
          renderQuestion();
        });

        const hubBtn = document.createElement("button");
        hubBtn.type = "button";
        hubBtn.className = "quiz-btn quiz-btn--ghost";
        hubBtn.textContent = "Ver Playground";
        hubBtn.addEventListener("click", goHome);

        secondary.append(replayBtn, hubBtn);

        const igTip = document.createElement("p");
        igTip.className = "quiz-ig-tip";
        igTip.innerHTML = `¿Compartes tu avatar? Etiquétanos en <a href="${config?.enlaces?.instagram?.url || "https://www.instagram.com/iglesiainternacionalccd/"}" target="_blank" rel="noopener noreferrer">@iglesiainternacionalccd</a>.`;

        actions.append(igBtn, waLink, secondary, igTip);
        stage.append(card, actions);
        dialog.scrollTop = 0;
      }

      renderQuestion();
    },
  };
})();
