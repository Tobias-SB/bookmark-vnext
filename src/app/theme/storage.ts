import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ThemeMode } from "@/app/theme/types";

const KEY = "theme.mode";

export async function loadThemeMode(): Promise<ThemeMode | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw === "system" || raw === "light" || raw === "dark") return raw;
  return null;
}

export async function saveThemeMode(mode: ThemeMode): Promise<void> {
  await AsyncStorage.setItem(KEY, mode);
}
