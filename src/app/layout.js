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
  title: "Dúplex Las Toninas | Alquiler Vacacional en la Costa Argentina",
  description:
    "Alquilá nuestros dúplex y departamentos en Las Toninas, Buenos Aires. A 400 metros del mar, completamente equipados. Reservá online con confirmación inmediata.",
  keywords:
    "alquiler duplex Las Toninas, alquiler verano Las Toninas, departamentos Las Toninas, turismo costa bonaerense, alquiler vacacional",
  openGraph: {
    title: "Dúplex Las Toninas | Alquiler Vacacional",
    description:
      "Dúplex completamente equipados a 400 metros del mar en Las Toninas. Reservá online.",
    url: "https://duplexlastoninas.com.ar",
    siteName: "Dúplex Las Toninas",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dúplex Las Toninas | Alquiler Vacacional",
    description: "Dúplex completamente equipados a 400 metros del mar en Las Toninas.",
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
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es-AR" className={`${plusJakarta.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              name: "Dúplex Las Toninas",
              url: "https://duplexlastoninas.com.ar",
              description:
                "Alquiler de dúplex y departamentos en Las Toninas, Partido de La Costa, Buenos Aires. A 400 metros del mar.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Las Toninas",
                addressRegion: "Buenos Aires",
                addressCountry: "AR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -36.6,
                longitude: -56.7,
              },
              priceRange: "$$",
              amenityFeature: [
                { "@type": "LocationFeatureSpecification", name: "Aire acondicionado", value: true },
                { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
                { "@type": "LocationFeatureSpecification", name: "Estacionamiento", value: true },
                { "@type": "LocationFeatureSpecification", name: "Cocina equipada", value: true },
              ],
              numberOfRooms: 5,
              petsAllowed: false,
            }),
          }}
        />
      </head>
      <body className={`${plusJakarta.className} antialiased bg-white text-slate-900 selection:bg-sky-500 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
