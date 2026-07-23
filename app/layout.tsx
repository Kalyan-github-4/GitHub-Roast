import { Space_Grotesk, Space_Mono, Syne } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

// Syne = brutalist, geometric, personality-packed
const syneHeading = Syne({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['700', '800'],
});

// Space Grotesk = humanized grotesque, quirky feel
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

// Space Mono = techy + matches the humanized vibe
const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

export const metadata = {
  title: 'GitHub Roast — Your Code Deserves This',
  description: 'We inspect your GitHub profile, repositories, commit history, and questionable developer decisions. Then we absolutely roast you for it.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        spaceMono.variable,
        spaceGrotesk.variable,
        syneHeading.variable,
        "font-sans"
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
