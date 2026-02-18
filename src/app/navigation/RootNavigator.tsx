// src/app/navigation/RootNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/app/navigation/types";
import { MainTabsNavigator } from "@/app/navigation/MainTabsNavigator";
import {
  AddChooserScreen,
  QuickAddScreen,
  ReadableDetailScreen,
  ReadableUpsertScreen,
} from "@/features/readables";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="MainTabs"
        component={MainTabsNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ReadableDetail"
        component={ReadableDetailScreen}
        options={{ title: "Details" }}
      />

      <Stack.Screen
        name="AddChooser"
        component={AddChooserScreen}
        options={{ title: "Add" }}
      />

      <Stack.Screen
        name="QuickAdd"
        component={QuickAddScreen}
        options={{ title: "Quick Add" }}
      />

      <Stack.Screen
        name="ReadableUpsert"
        component={ReadableUpsertScreen}
        options={{ title: "Full Add" }}
      />
    </Stack.Navigator>
  );
}
