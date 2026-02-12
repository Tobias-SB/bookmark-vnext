import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/app/navigation/types";
import { MainTabsNavigator } from "@/app/navigation/MainTabsNavigator";
import { ReadableDetailScreen } from "@/features/readables";

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
    </Stack.Navigator>
  );
}
