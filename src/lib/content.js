// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVO CENTRAL DE TEXTOS, TÍTULOS E IMÁGENES DE LA PORTADA (LANDING PAGE)
// ═══════════════════════════════════════════════════════════════════════════════
// ¿Cómo editar este archivo?
// 1. Cambiá cualquier texto que esté entre comillas ("...") respetando las comillas.
// 2. Para cambiar o sumar fotos, guardá la imagen en la carpeta `public/fotos/`
//    y escribí su ruta empezando con `/fotos/...` (por ejemplo: "/fotos/mi-foto.jpg").
// 3. El número de WhatsApp también se puede cambiar directamente desde el Panel Admin (/admin).
// ═══════════════════════════════════════════════════════════════════════════════

export const siteContent = {
  // ─── 1. DATOS GENERALES Y CONTACTO ──────────────────────────────────────────
  brand: {
    shortName: "LAS TONINAS",
    fullName: "Dúplex Las Toninas",
    logo: "/logo.png",
    address: "Calle 12 Nº 495",
    city: "Las Toninas",
    region: "Partido de La Costa, Buenos Aires",
    distanceToSea: "400m",
    whatsappNumber: "5491134610085", // Editable desde el Panel Administrador (/admin)
    whatsappDefaultMessage:
      "Hola! Vengo desde la web de Dúplex Las Toninas y quiero consultar disponibilidad.",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Calle+12+495+Las+Toninas+Buenos+Aires",
    paymentAlias: "RENE.LASTONINAS",
    paymentCvu: "0000003100082748753031",
    paymentHolder: "Gregorio Rene Flores Barriga",
    depositPercentage: 50,
  },

  // ─── 2. BARRA DE NAVEGACIÓN ─────────────────────────────────────────────────
  navigation: {
    lugar: "Lugar",
    alojamiento: "Alojamiento",
    galeria: "Galería",
    ubicacion: "Ubicación",
    faq: "Preguntas",
    ctaButton: "Reservar Online",
  },

  // ─── 3. PORTADA PRINCIPAL (HERO CON VIDEO, SEO & GOOGLE ADS) ────────────────
  hero: {
    videoUrl: "/videos/portada.mp4",
    posterImage: "/fotos/FRENTE/DUPLEX1.jpg",
    title: "Alquiler Duplex en Las Toninas",
    subtitle:
      "Tu mejor opción de alquiler de temporada a 400 metros del mar. 4 Dúplex y 1 Departamento totalmente equipados con parrilla propia y espacio para estacionar al frente en la zona de playas más amplias. Trato directo con dueño, sin comisiones ni intermediarios.",
    statCard: {
      value: "400m",
      label: "Playas amplias todo el día",
      buttonText: "Conocer el lugar",
    },
    searchBar: {
      checkInLabel: "Llegada (14:00 hs)",
      checkOutLabel: "Salida (10:00 hs)",
      guestsLabel: "Personas",
      submitButton: "Consultar",
    },
  },

  // ─── 4. BANDA DE 4 MÉTRICAS DESTACADAS ──────────────────────────────────────
  metrics: [
    {
      value: "400m",
      label: "Distancia real al mar · Calle 12 Nº 495",
    },
    {
      value: "Todo el día",
      label: "Playas amplias protegidas por escolleras",
    },
    {
      value: "5 Unidades",
      label: "Alquiler de Dúplex (6 pers.) y Depto (5 pers.)",
    },
    {
      value: "100%",
      label: "Trato directo con dueño, sin comisión",
    },
  ],

  // ─── 5. SECCIÓN LUGAR: ESCOLLERAS Y COMODIDADES (BENTO GRID) ────────────────
  bento: {
    eyebrow: "Calle 12 Nº 495 · Las Toninas",
    sectionTitle: "La mejor zona de playas amplias",
    ctaButton: "Ver Disponibilidad",

    // Tarjeta 1 Principal (Vertical con foto de las escolleras)
    beachCard: {
      badge: "Ventaja Única en Las Toninas",
      image: "/fotos/escolleras-playa.png",
      imageCaption: "Playa a 400m de Calle 12 Nº 495",
      title: "Playas amplias todo el día por la creación de las escolleras",
      description:
        "Estamos ubicados en el sector privilegiado de Las Toninas donde las escolleras costeras protegen la orilla y retienen la arena. Esto garantiza una playa ancha, aguas más serenas y espacio seguro para disfrutar en familia incluso cuando sube la marea.",
    },

    // Tarjeta 2 Horizontal (Equipamiento)
    equipmentCard: {
      badge: "Confort y Comodidad",
      image: "/fotos/cocina-equipamiento.jpg",
      imageCaption: "Cocina completa y microondas",
      title: "Equipamiento completo como en tu propia casa",
      description:
        "Cada unidad de alquiler cuenta con cocina equipada, vajilla familiar completa, heladera con freezer, microondas, Smart TV y conexión Wi-Fi de alta velocidad para que descanses sin preocupaciones.",
      pills: [
        "Wi-Fi Alta Velocidad",
        "Heladera con Freezer",
        "Smart TV",
        "Cocina y Vajilla",
      ],
    },

    // Tarjeta 3 Inferior Media (Parrilla y Estacionamiento al frente)
    grillCard: {
      badge: "Parrilla Propia",
      image: "/fotos/parrilla-asado.png",
      imageCaption: "Parrilla en cada unidad",
      title: "Parrilla individual y espacio al frente",
      description:
        "Patio con parrilla individual en cada unidad para disfrutar tus asados en familia. En los dúplex se puede estacionar en la puerta de cada unidad al frente (espacio descubierto).",
      buttonText: "Ver Alojamiento",
    },

    // Tarjeta 4 Inferior Derecha (Reserva Directa)
    bookingCard: {
      badge: "100% Directo Dueño",
      image: "/fotos/trato-directo.jpg",
      imageCaption: "Trato directo con sus dueños",
      title: "Reserva Directa",
      description:
        "Congelá tu alquiler de temporada abonando tu seña vía transferencia bancaria directa (Alias o CVU). Sin intermediarios ni comisiones.",
      buttonText: "Reservar Ahora",
    },
  },

  // ─── 6. CATÁLOGO DE ALOJAMIENTO (UNIDADES) ──────────────────────────────────
  unitsSection: {
    eyebrow: "Alquiler de Dúplex y Departamento en Las Toninas",
    title: "Elegí tu alojamiento ideal",
    filters: {
      all: "Todas (5 Unidades)",
      duplex: "4 Dúplex (Hasta 6 pers.)",
      depto: "Departamento (Hasta 5 pers.)",
    },
  },

  // ─── 7. GALERÍA DESTACADA EN PORTADA ────────────────────────────────────────
  gallerySection: {
    eyebrow: "Postales del Complejo y la Costa",
    title: "Conocé nuestro lugar por dentro y por fuera",
    images: [
      {
        src: "/fotos/escolleras-playa.png",
        title: "Playas Amplias con Escolleras",
        subtitle: "Arena ancha y mar sereno todo el día a 400m del complejo",
      },
      {
        src: "/fotos/FRENTE/DUPLEX1.jpg",
        title: "Frente de los Dúplex",
        subtitle: "Calle 12 Nº 495 · Espacio para estacionar en la puerta al frente",
      },
      {
        src: "/fotos/DUPLEX/LT DUPLEX 13.jpg",
        title: "Interiores Luminosos y Equipados",
        subtitle: "Ambientes cómodos pensados para hasta 6 personas",
      },
      {
        src: "/fotos/DEPARTAMENTO/LT DEPTO 1.jpg",
        title: "Departamento en Primer Piso",
        subtitle: "Totalmente equipado para hasta 5 personas",
      },
    ],
  },

  // ─── 8. SECCIÓN UBICACIÓN Y DISTANCIAS ──────────────────────────────────────
  locationSection: {
    badge: "Ubicación Privilegiada",
    title: "Calle 12 Nº 495, Las Toninas",
    description:
      "Zona residencial tranquila, segura y familiar, ubicada estratégicamente a 400 metros del sector de escolleras donde la playa conserva su amplitud durante todo el día.",
    distances: [
      {
        place: "Playas con Escolleras",
        dist: "400 metros",
        detail: "4 cuadras reales bajando directo a la costa amplia.",
      },
      {
        place: "Barrio Residencial y Calmo",
        dist: "Paz y Relax",
        detail: "Zona tranquila, segura y familiar, ideal para descansar sin ruidos molestos.",
      },
      {
        place: "Parque Laberinto",
        dist: "5 minutos",
        detail: "El clásico paseo familiar de Las Toninas.",
      },
      {
        place: "Terminal y Accesos",
        dist: "Check-in 14h · Check-out 10h",
        detail:
          "Acceso directo sobre Calle 12 Nº 495. Horarios de estadía: ingreso a partir de las 14:00 hs y egreso hasta las 10:00 hs.",
      },
    ],
  },

  // ─── 8B. PREGUNTAS FRECUENTES (SEO, GEO & GOOGLE ADS QUALITY SCORE) ─────────
  faqSection: {
    badge: "Dudas Frecuentes · Alquiler Dueño Directo",
    title: "Todo lo que necesitás saber antes de reservar",
    subtitle:
      "Transparencia total en tarifas, comodidades y modalidad de reserva directa sin comisiones inmobiliarias en Calle 12 Nº 495, Las Toninas.",
    items: [
      {
        q: "¿A cuántas cuadras reales de la playa están ubicados los dúplex?",
        a: "Estamos en Calle 12 Nº 495, a exactamente 400 metros reales (4 cuadras derechas) de la playa de Las Toninas, en un barrio residencial tranquilo, seguro y familiar.",
      },
      {
        q: "¿Por qué la playa de esa zona de Las Toninas es más amplia?",
        a: "Porque a la altura de nuestra bajada se encuentran las escolleras costeras que protegen la orilla y retienen la arena. Gracias a esto, la playa se mantiene ancha y con aguas más serenas durante todo el día, incluso cuando sube la marea.",
      },
      {
        q: "¿Cuál es la capacidad de los dúplex y del departamento?",
        a: "El complejo cuenta con 5 unidades independientes: 4 Dúplex de dos plantas con capacidad máxima para hasta 6 personas cada uno, y 1 Departamento en primer piso por escalera con capacidad para hasta 5 personas.",
      },
      {
        q: "¿Cómo se reserva y cómo se congela el precio en pesos de la estadía?",
        a: "Podés elegir tus fechas en nuestro calendario online (/reservar) o por WhatsApp. La reserva queda confirmada y el precio total en pesos argentinos se congela al 100% contra la inflación abonando el 50% de seña mediante transferencia bancaria directa.",
      },
      {
        q: "¿Puedo pagar la seña ahora e ir adelantando pagos parciales antes de viajar?",
        a: "Sí. Una vez congelada tu reserva con el 50% de seña, podés ir transfiriendo pagos parciales o adelantos a tu ritmo cuando dispongas de dinero hasta completar el 100% antes de ingresar, o abonar el saldo restante en recepción al hacer el check-in. Cada pago queda registrado con fecha en tu tarjeta de reserva.",
      },
      {
        q: "¿Cobran comisión inmobiliaria o gastos administrativos?",
        a: "No. El alquiler es 100% trato directo con sus dueños. El monto que cotizás en la web es el precio final, sin comisiones inmobiliarias ni costos ocultos.",
      },
      {
        q: "¿Tienen parrilla propia y lugar para estacionar el auto?",
        a: "Sí, los 4 Dúplex cuentan con patio con parrilla individual propia y espacio descubierto al frente de cada unidad para estacionar el vehículo en la puerta sin cargo adicional.",
      },
      {
        q: "¿Qué equipamiento incluyen las unidades?",
        a: "Todas las unidades están equipadas con conexión Wi-Fi de alta velocidad, Smart TV, heladera con freezer, microondas, cocina con horno y vajilla completa para la capacidad máxima de huéspedes.",
      },
      {
        q: "¿Cuáles son los horarios de entrada (check-in) y salida (check-out)?",
        a: "El ingreso (check-in) es a partir de las 14:00 hs en Calle 12 Nº 495, donde nuestro cuidador te recibe con las llaves, y el horario de salida (check-out) es hasta las 10:00 hs.",
      },
      {
        q: "¿Cuáles son los datos bancarios oficiales para transferir la seña?",
        a: "Las transferencias se realizan únicamente a la cuenta oficial a nombre de Gregorio Rene Flores Barriga (Alias: RENE.LASTONINAS · CVU: 0000003100082748753031), enviando luego el comprobante por WhatsApp para dejar congelada la unidad.",
      },
    ],
  },

  // ─── 9. BANNER FINAL DE RESERVA ─────────────────────────────────────────────
  ctaBanner: {
    badge: "Alquiler Temporada & Fines de Semana · Calle 12 Nº 495",
    title: "Asegurá tu alquiler de dúplex en la mejor playa de Las Toninas.",
    subtitle:
      "Consultá disponibilidad en tiempo real y reservá directo con sus dueños sin pagar comisiones extra.",
    primaryButton: "Reservar Ahora",
    secondaryButton: "Consultar por WhatsApp",
  },
};
