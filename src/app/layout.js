import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://duplexlastoninas.com.ar"),
  title: "Alquiler de Dúplex en Las Toninas | Alquiler de Temporada Dueño Directo",
  description:
    "Alquiler de Dúplex y Departamento de alquiler por temporada en Las Toninas (Calle 12 Nº 495). A 400 metros de las playas más amplias, con cochera y parrilla propia. Reservá directo con sus dueños sin comisiones.",
  keywords: [
    "alquiler duplex",
    "alquiler temporada",
    "alquiler duplex las toninas",
    "alquiler de temporada las toninas",
    "alquiler temporario las toninas",
    "duplex en las toninas dueño directo",
    "departamentos en las toninas",
    "alojamiento en las toninas cerca del mar",
    "alquiler vacaciones costa atlantica",
    "duplex con parrilla y cochera las toninas",
  ],
  alternates: {
    canonical: "https://duplexlastoninas.com.ar",
  },
  openGraph: {
    title: "Alquiler de Dúplex en Las Toninas | Alquiler de Temporada Dueño Directo",
    description:
      "Tu alquiler de temporada seguro a 400m del mar en Las Toninas. 4 Dúplex y 1 Departamento equipados con cochera y parrilla. Trato directo con dueños.",
    url: "https://duplexlastoninas.com.ar",
    siteName: "Dúplex Las Toninas",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/fotos/FRENTE/DUPLEX1.jpg",
        width: 1200,
        height: 630,
        alt: "Alquiler de Dúplex en Las Toninas - Calle 12 Nº 495",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alquiler de Dúplex en Las Toninas | Alquiler de Temporada",
    description:
      "4 Dúplex y 1 Departamento totalmente equipados a 400 metros del mar en Las Toninas. Alquiler directo con sus dueños.",
    images: ["/fotos/FRENTE/DUPLEX1.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Dúplex Las Toninas — Alquiler de Dúplex y Temporada",
    url: "https://duplexlastoninas.com.ar",
    image: "https://duplexlastoninas.com.ar/fotos/FRENTE/DUPLEX1.jpg",
    description:
      "Especialistas en alquiler de dúplex y departamentos de alquiler por temporada en Las Toninas, Partido de La Costa, Buenos Aires. A 400 metros del mar con playas amplias protegidas por escolleras.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle 12 Nº 495",
      addressLocality: "Las Toninas",
      addressRegion: "Buenos Aires",
      postalCode: "B7106",
      addressCountry: "AR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -36.4833,
      longitude: -56.6955,
    },
    priceRange: "$$",
    checkinTime: "14:00",
    checkoutTime: "10:00",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "WiFi de alta velocidad", value: true },
      { "@type": "LocationFeatureSpecification", name: "Aire acondicionado y calefacción", value: true },
      { "@type": "LocationFeatureSpecification", name: "Cochera / Estacionamiento propio", value: true },
      { "@type": "LocationFeatureSpecification", name: "Parrilla individual", value: true },
      { "@type": "LocationFeatureSpecification", name: "Cocina familiar equipada", value: true },
    ],
    numberOfRooms: 5,
    petsAllowed: false,
  };

  return (
    <html lang="es-AR" className={`${plusJakarta.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        {/* Preparación de DataLayer para Google Ads & Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}`,
          }}
        />
      </head>
      <body className={`${plusJakarta.className} antialiased bg-white text-slate-900 selection:bg-sky-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
