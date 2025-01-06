import "./globals.css";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";
import SessionProvider from "@/components/Providers/SessionProvider";
import ThemeProvider from "@/components/Providers/ThemeProvider";

import QueryClientProvider from "@/components/Providers/QueryClientProvider";
import { Toaster } from "@/components/ui/sonner";
import ButtonScrollTop from "../components/ui/button-to-top";

import type { Metadata, Viewport } from "next";

const APP_NAME = "Pending Finance App";
const APP_DEFAULT_TITLE = "Pending";
const APP_TITLE_TEMPLATE = "%s - Pending Finance App";
const APP_DESCRIPTION =
  "Record your income and Recepint with Pending Finance App";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },

  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
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
