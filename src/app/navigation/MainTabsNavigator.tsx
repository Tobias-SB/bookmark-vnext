import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import type { MainTabsParamList } from "@/app/navigation/types";
import { ReadableListScreen } from "@/features/readables";
import { SettingsScreen } from "@/features/settings";

const Tab = createBottomTabNavigator<MainTabsParamList>();

export function MainTabsNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Tab.Screen name="Library" component={ReadableListScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
