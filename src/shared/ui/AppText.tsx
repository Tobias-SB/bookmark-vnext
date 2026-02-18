// src/shared/ui/AppText.tsx
import { Text, type TextProps } from "react-native";

import { useAppTheme } from "@/app/theme";

type Props = TextProps & { variant?: "title" | "body" | "secondary" };

const VARIANT_STYLE: Record<
  NonNullable<Props["variant"]>,
  TextProps["style"]
> = {
  title: { fontSize: 20, fontWeight: "700" },
  body: { fontSize: 16 },
  secondary: { fontSize: 14 },
};

export function AppText({ style, variant = "body", ...rest }: Props) {
  const { tokens } = useAppTheme();
  const color =
    variant === "secondary" ? tokens.text.secondary : tokens.text.primary;

  return <Text {...rest} style={[VARIANT_STYLE[variant], { color }, style]} />;
}
