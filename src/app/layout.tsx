import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import SessionProvider from "@/components/Providers/SessionProvider";
import ThemeProvider from "@/components/Providers/ThemeProvider";

import QueryClientProvider from "@/components/Providers/QueryClientProvider";
import { Toaster } from "@/components/ui/sonner";
import ButtonScrollTop from "../components/ui/button-to-top";

export const metadata: Metadata = {
  title: "Pending Finance",
  description: "Record your income and receipts with Pending Finance",
  icons: {
    icon: "/coins.ico",
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <QueryClientProvider>
            <ThemeProvider>
              {children}
              <ButtonScrollTop />
              <Toaster theme="light" position="top-center" />
            </ThemeProvider>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
