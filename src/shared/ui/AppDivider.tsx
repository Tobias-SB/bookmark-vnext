// src/shared/ui/AppDivider.tsx
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { useAppTheme } from "@/app/theme";

type Props = {
  inset?: number;
  marginVertical?: number;
  style?: StyleProp<ViewStyle>;
};

export function AppDivider({ inset = 0, marginVertical, style }: Props) {
  const { tokens } = useAppTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: tokens.divider.subtle,
          marginLeft: inset,
          marginVertical: marginVertical ?? tokens.space.sm,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: { height: StyleSheet.hairlineWidth, width: "100%" },
});
