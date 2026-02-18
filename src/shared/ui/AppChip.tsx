// src/shared/ui/AppChip.tsx
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "@/app/theme";

type Props = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

export function AppChip({
  label,
  selected = false,
  disabled = false,
  onPress,
  style,
  textStyle,
  testID,
  accessibilityLabel,
}: Props) {
  const { tokens } = useAppTheme();
  const interactive = Boolean(onPress) && !disabled;

  const backgroundColor = selected
    ? tokens.chip.selectedBackground
    : tokens.chip.background;

  const borderColor = selected
    ? tokens.chip.selectedBorder
    : tokens.chip.border;

  const color = selected ? tokens.chip.selectedText : tokens.chip.text;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={!interactive}
      accessibilityRole={interactive ? "button" : undefined}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          borderColor,
          borderRadius: tokens.radius.pill,
          paddingHorizontal: tokens.space.md,
          paddingVertical: tokens.space.xs,
        },
        pressed && interactive && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, { color }, textStyle]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: "flex-start",
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: 14, fontWeight: "600" },
  pressed: { opacity: 0.9 },
  disabled: { opacity: 0.55 },
});
