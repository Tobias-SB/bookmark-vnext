import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { useAppTheme } from "@/app/theme";

type Props = PropsWithChildren<{ padded?: boolean }>;

export function AppScreen({ children, padded = true }: Props) {
  const { tokens } = useAppTheme();

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
