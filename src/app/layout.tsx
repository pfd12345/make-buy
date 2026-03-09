import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { StoreInitializer } from "@/components/layout/store-initializer";

export const metadata: Metadata = {
  title: "NetPlan - Pharma Network Capacity Planning",
  description: "Network strategy planning tool for pharmaceutical manufacturing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreInitializer />
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
