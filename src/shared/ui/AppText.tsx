import { StyleSheet, Text, type TextProps } from "react-native";
import { useAppThemeMode } from "@/app/theme";

type Props = TextProps & {
  variant?: "title" | "body" | "secondary";
};

export function AppText({ style, variant = "body", ...rest }: Props) {
  const { tokens } = useAppThemeMode();

  const color =
    variant === "secondary" ? tokens.text.secondary : tokens.text.primary;

  return (
    <Text
      {...rest}
      style={[styles.base, variantStyles[variant], { color }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {},
});

const variantStyles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "700" },
  body: { fontSize: 16 },
  secondary: { fontSize: 14 },
});
