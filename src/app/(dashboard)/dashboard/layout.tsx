import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "./_components/navbar/Navbar";
import Sidebar from "./_components/sidebar/Sidebar";

const monts = Montserrat({
  subsets: ["latin"],
  variable: "--font-monts",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "School Dashboard",
  description: "School dashboard for manage school",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className={`${monts.className} h-full w-full`}>
        <Toaster />

        <div className="h-full">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              defaultSize={20}
              maxSize={30}
              order={1}
              className=" dark:bg-zinc-900"
            >
              <Sidebar />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel order={2} defaultSize={80} className="h-full">
              <Navbar />
              {children}
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </ThemeProvider>
  );
}
