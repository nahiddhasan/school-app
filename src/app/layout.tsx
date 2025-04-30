import { QueryProvider } from "@/providers/QureyProvider";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import { auth } from "../auth";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "School name",
  description: "School Front Webpage",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <QueryProvider>
      <SessionProvider session={session}>
        <html lang="en" suppressHydrationWarning>
          <body className={poppins.className}>{children}</body>
        </html>
      </SessionProvider>
    </QueryProvider>
  );
}
