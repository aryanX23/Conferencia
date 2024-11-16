import { ThemeColorToggle } from "@/components/theme-color-toggle";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ThemeColorToggle />
      <ThemeModeToggle />
    </main>
  );
}
