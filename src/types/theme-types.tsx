type ThemeColors = "Zinc" | "Rose" | "Blue" | "Green" | "Orange";

export interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}
