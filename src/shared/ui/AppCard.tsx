// src/shared/ui/AppCard.tsx
import { type ComponentProps, type PropsWithChildren } from "react";
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Surface } from "react-native-paper";

import { useAppTheme } from "@/app/theme";

type SurfaceElevation = ComponentProps<typeof Surface>["elevation"];

type Props = PropsWithChildren<{
  onPress?: () => void;
  disabled?: boolean;
  padded?: boolean;
  elevation?: SurfaceElevation;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}>;

export function AppCard({
  children,
  onPress,
  disabled = false,
  padded = true,
  elevation,
  style,
  testID,
  accessibilityLabel,
}: Props) {
  const { tokens } = useAppTheme();
  const interactive = Boolean(onPress) && !disabled;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={!interactive}
      accessibilityRole={interactive ? "button" : undefined}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.pressable,
        pressed && interactive ? styles.pressed : undefined,
      ]}
    >
      <Surface
        elevation={elevation}
        style={[
          styles.card,
          {
            backgroundColor: tokens.card.background,
            borderColor: tokens.card.border,
            borderRadius: tokens.radius.lg,
          },
          padded ? { padding: tokens.space.md } : undefined,
          disabled ? styles.disabled : undefined,
          style,
        ]}
      >
        {children}
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: { width: "100%" },
  pressed: { opacity: 0.92 },
  disabled: { opacity: 0.6 },
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    width: "100%",
  },
});
