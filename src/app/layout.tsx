import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

import ThemeDataProvider from "@/context/theme-data-provider";
import AuthProvider from "@/context/auth-provider";

import { DM_Sans } from "next/font/google";
import "./globals.css";

const dm_sans = DM_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={dm_sans.className}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeDataProvider>
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
          </ThemeDataProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
