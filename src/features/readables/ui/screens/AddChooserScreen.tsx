// src/features/readables/ui/screens/AddChooserScreen.tsx
import { View } from "react-native";

import { useRootNavigation } from "@/app/navigation";
import { useAppTheme } from "@/app/theme";
import {
  AppButton,
  AppDivider,
  AppScreen,
  AppSpacer,
  AppText,
} from "@/shared/ui";

export function AddChooserScreen() {
  const navigation = useRootNavigation();
  const { tokens } = useAppTheme();

  return (
    <AppScreen padded>
      <AppText variant="title">Add</AppText>
      <AppSpacer size={8} />
      <AppText variant="secondary">
        Choose a full manual add, or do a quick add that prefills the form and
        falls back safely if anything is missing.
      </AppText>

      <AppSpacer size={16} />
      <View style={{ gap: tokens.space.sm }}>
        <AppButton
          mode="contained"
          onPress={() => navigation.navigate("QuickAdd")}
        >
          Quick Add
        </AppButton>

        <AppButton
          mode="outlined"
          onPress={() => navigation.navigate("ReadableUpsert")}
        >
          Full Add
        </AppButton>
      </View>

      <AppSpacer size={20} />
      <AppDivider />

      <AppSpacer size={12} />
      <AppText variant="secondary">
        Quick Add is always an explicit action: it only prefills fields. Nothing
        is saved until you tap Save on the full form.
      </AppText>
    </AppScreen>
  );
}
