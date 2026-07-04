import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { StoreProvider } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Growth Rings — Life Improvement Dashboard",
  description: "Track tasks, habits, goals, study, journaling and focus — one ring at a time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-body`}
      >
        <ThemeProvider>
          <StoreProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 min-w-0 pb-24 md:pb-0">{children}</main>
            </div>
            <MobileNav />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
