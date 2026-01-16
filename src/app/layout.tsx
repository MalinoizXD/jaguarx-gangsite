import type { Metadata } from "next";
import localFont from "next/font/local";
import { Chakra_Petch, Prompt } from "next/font/google";
import "./globals.css";
import AutoPlayMusic from "../components/AutoPlayMusic";

const asylumFont = localFont({
  src: "./fonts/QGYvz_MVcBeNP4NJtEtq.woff2",
  variable: "--font-asylum",
  display: "swap",
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JAGUARX ONLY",
  description: "JAGUARX",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "JAGUARX ONLY",
    description: "JAGUARX",
    url: "https://www.jaguarx.xyz",
    siteName: "JAGUARX",
    images: [
      {
        url: "/uploads/jaguarxlogo.png",
        width: 1200,
        height: 630,
        alt: "JAGUARX Gang",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JAGUARX ONLY",
    description: "JAGUARX",
    images: ["/uploads/jaguarxlogo.png"],
  },
  metadataBase: new URL("https://www.jaguarx.xyz"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark">
      <head>
        <link rel="preload" href="/logo.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body
        className={`${asylumFont.variable} ${chakraPetch.variable} ${prompt.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        <AutoPlayMusic src="/music/mali-theme.mp3" volume={0.2} />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
