import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Using Outfit as requested
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import BottomNav from "./components/BottomNav";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fashigram",
  description: "Fashion discovery driven by consensus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.variable}>
        <AuthProvider>
          {children}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
