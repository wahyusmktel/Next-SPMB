import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SPMB - Sistem Penerimaan Murid Baru",
  description: "Sistem Penerimaan Murid Baru untuk SD/SMP di bawah naungan Dinas Pendidikan",
  keywords: ["SPMB", "PPDB", "Penerimaan Murid Baru", "Sekolah Dasar", "SMP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
