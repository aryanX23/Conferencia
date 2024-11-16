import { ThemeProvider as NextThemesProvider } from "next-themes";

import ThemeDataProvider from "@/context/theme-data-provider";

import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeDataProvider>{children}</ThemeDataProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
}
