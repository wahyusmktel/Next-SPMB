"use client";

import { useEffect } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useAuthStore } from "@/lib/store";
import { ToastContainer } from "@/components/ui";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased bg-white text-gray-900">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
