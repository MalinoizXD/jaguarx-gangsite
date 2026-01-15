import type { Metadata } from "next";
import localFont from "next/font/local";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";
import AutoPlayMusic from "../components/AutoPlayMusic";

const asylumFont = localFont({
  src: "./fonts/VL_LHFAsylum_Small.otf",
  variable: "--font-asylum",
  display: "swap",
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra-petch",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JAGUARX - Born of Estelle",
  description: "JAGUARX Gang - Born of Estelle. สนใจเข้าตระกูลทักแชทเพจมาได้เลย!",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "JAGUARX - Born of Estelle",
    description: "JAGUARX Gang - Born of Estelle. สนใจเข้าตระกูลทักแชทเพจมาได้เลย!",
    url: "https://www.jaguarx.xyz",
    siteName: "JAGUARX",
    images: [
      {
        url: "/uploads/1760010475208-0une9deywda1ye.png",
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
    title: "JAGUARX - Born of Estelle",
    description: "JAGUARX Gang - Born of Estelle. สนใจเข้าตระกูลทักแชทเพจมาได้เลย!",
    images: ["/uploads/1760010475208-0une9deywda1ye.png"],
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
      <body
        className={`${asylumFont.variable} ${chakraPetch.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        {/* <AutoPlayMusic src="/music/JAGUARX-theme.mp3" volume={0.2} /> */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
