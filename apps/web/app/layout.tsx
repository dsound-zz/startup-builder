import type { Metadata } from "next"
import "./globals.css"
import { QueryProvider } from "@/lib/providers/query-provider"

export const metadata: Metadata = {
  title: "Startup Builder",
  description: "AI-powered startup idea validation platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
