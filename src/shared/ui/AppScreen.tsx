import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

import { useAppThemeMode } from "@/app/theme";

type Props = PropsWithChildren<{
  padded?: boolean;
}>;

export function AppScreen({ children, padded = true }: Props) {
  const { tokens } = useAppThemeMode();

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: tokens.screen.background },
        padded && styles.padded,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { flex: 1 },
  padded: { padding: 16 },
});
