// src/shared/ui/AppSpacer.tsx
import { View } from "react-native";

import { useAppTheme } from "@/app/theme";
import type { ThemeTokens } from "@/app/theme/types";

type TokenSpaceKey = keyof ThemeTokens["space"];

type Props = {
  size?: number | TokenSpaceKey;
};

export function AppSpacer({ size = "sm" }: Props) {
  const { tokens } = useAppTheme();

  const height = typeof size === "number" ? size : tokens.space[size];
  return <View style={{ height }} />;
}
