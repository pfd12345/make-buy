import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ClientGate } from "@/components/layout/client-gate";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "NetPlan - Pharma Network Capacity Planning",
  description: "Network strategy planning tool for pharmaceutical manufacturing",
  openGraph: {
    title: "NetPlan - Pharma Network Capacity Planning",
    description: "Network strategy planning tool for pharmaceutical manufacturing",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto p-6">
            <ClientGate>{children}</ClientGate>
          </main>
        </div>
      </body>
    </html>
  );
}
