import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthInit from "../components/AuthInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TırlarYollarda - Nakliyat Platformu",
  description: "Nakliyat sektörünün dijital buluşma noktası",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthInit />
        {children}
      </body>
    </html>
  );
}