// ═══════════════════════════════════════════════════════════════════════════════
// ARCHIVO CENTRAL DE TEXTOS, TÍTULOS E IMÁGENES DE LA PORTADA (LANDING PAGE)
// ═══════════════════════════════════════════════════════════════════════════════
// ¿Cómo editar este archivo?
// 1. Cambiá cualquier texto que esté entre comillas ("...") respetando las comillas.
// 2. Para cambiar o sumar fotos, guardá la imagen en la carpeta `public/fotos/`
//    y escribí su ruta empezando con `/fotos/...` (por ejemplo: "/fotos/mi-foto.jpg").
// 3. Guardá el archivo (Cmd + S / Ctrl + S) y la web se actualizará automáticamente.
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
    whatsappNumber: "5491155551111", // Solo números con código de país (sin + ni espacios)
    whatsappDefaultMessage:
      "Hola! Quiero consultar disponibilidad en Dúplex Las Toninas (Calle 12 Nº 495).",
    googleMapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Calle+12+495+Las+Toninas+Buenos+Aires",
    paymentAlias: "DUPLEX.TONINAS.MP",
    depositPercentage: 30,
  },

  // ─── 2. PORTADA PRINCIPAL (HERO CON VIDEO) ──────────────────────────────────
  hero: {
    videoUrl: "/videos/portada.mp4",
    posterImage: "/fotos/FRENTE/DUPLEX1.jpg",
    topBadge: "Playas Amplias con Escolleras · Calle 12 Nº 495, Las Toninas",
    title: "El descanso familiar frente al mar",
    subtitle:
      "4 Dúplex y 1 Departamento totalmente equipados a 400 metros del mar. Ubicados en la mejor zona de Las Toninas, con playas amplias durante todo el día gracias a la protección de las escolleras.",
    statCard: {
      value: "400m",
      label: "Playas amplias todo el día",
      buttonText: "Ver zona de escolleras",
    },
    searchBar: {
      checkInLabel: "Llegada (Check-in)",
      checkOutLabel: "Salida (Check-out)",
      guestsLabel: "Personas",
      submitButton: "Consultar",
    },
  },

  // ─── 3. BANDA DE 4 MÉTRICAS DESTACADAS ──────────────────────────────────────
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
      label: "4 Dúplex (6 pers.) y 1 Depto (5 pers.)",
    },
    {
      value: "100%",
      label: "Trato directo con dueños, sin comisión",
    },
  ],

  // ─── 4. SECCIÓN ESCOLLERAS Y COMODIDADES (BENTO GRID) ───────────────────────
  bento: {
    eyebrow: "Calle 12 Nº 495 · Las Toninas",
    sectionTitle: "La mejor zona de playas amplias y el máximo confort",
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
      title: "Equipamiento completo como en tu propia casa",
      description:
        "Cada unidad cuenta con cocina equipada, vajilla familiar completa, heladera con freezer, microondas, aire acondicionado, calefacción, Smart TV y conexión Wi-Fi estable para que no tengas que preocuparte por nada.",
      pills: [
        "Wi-Fi Alta Velocidad",
        "Aire y Calefacción",
        "Smart TV",
        "Cocina Completa",
      ],
    },

    // Tarjeta 3 Inferior Media (Cochera y Parrilla)
    grillCard: {
      title: "Cochera y Parrilla Propia",
      description:
        "Estacionamiento cerrado dentro del predio y patio con parrilla individual en cada dúplex para disfrutar de tus asados.",
      buttonText: "Explorar Unidades",
    },

    // Tarjeta 4 Inferior Derecha (Seña)
    bookingCard: {
      title: "Reserva Directa 30%",
      description:
        "Congelá tu lugar con una seña del 30% vía transferencia o MercadoPago.",
    },
  },

  // ─── 5. CATÁLOGO DE UNIDADES ────────────────────────────────────────────────
  unitsSection: {
    eyebrow: "Nuestras Propiedades",
    title: "Elegí tu unidad ideal",
    filters: {
      all: "Todas (5 Unidades)",
      duplex: "4 Dúplex (Hasta 6 pers.)",
      depto: "Departamento (Hasta 5 pers.)",
    },
  },

  // ─── 6. GALERÍA DESTACADA EN PORTADA (SUMÁ TUS FOTOS AQUÍ) ──────────────────
  // Podés agregar o quitar bloques { src: "...", title: "...", subtitle: "..." }
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
        subtitle: "Calle 12 Nº 495 · Estacionamiento propio en el frente",
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

  // ─── 7. SECCIÓN UBICACIÓN Y DISTANCIAS ──────────────────────────────────────
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
        place: "Centro Comercial",
        dist: "3 minutos",
        detail: "Peatonal, supermercados, restaurantes y heladerías.",
      },
      {
        place: "Parque Laberinto",
        dist: "5 minutos",
        detail: "El clásico paseo familiar de Las Toninas.",
      },
      {
        place: "Terminal y Accesos",
        dist: "Fácil llegada",
        detail: "Acceso directo sobre Calle 12 Nº 495.",
      },
    ],
  },

  // ─── 8. BANNER FINAL DE RESERVA ─────────────────────────────────────────────
  ctaBanner: {
    badge: "Temporada & Fines de Semana · Calle 12 Nº 495",
    title: "Asegurá tu estadía en la mejor playa de Las Toninas.",
    subtitle:
      "Consultá disponibilidad en tiempo real y reservá directo con sus dueños sin pagar comisiones extra.",
    primaryButton: "Reservar Ahora",
    secondaryButton: "WhatsApp Directo",
  },
};
