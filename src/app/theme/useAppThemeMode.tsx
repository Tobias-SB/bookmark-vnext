import { useContext } from "react";
import { AppThemeContext } from "@/app/theme/AppThemeProvider";

export function useAppThemeMode() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error("useAppThemeMode must be used within AppThemeProvider");
  }
  return ctx;
}
