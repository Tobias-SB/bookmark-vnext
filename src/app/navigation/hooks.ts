import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { MainTabsParamList, RootStackParamList } from "./types";

export type RootNav = NativeStackNavigationProp<RootStackParamList>;

export type LibraryNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabsParamList, "Library">,
  RootNav
>;

export function useRootNavigation() {
  return useNavigation<RootNav>();
}

export function useLibraryNavigation() {
  return useNavigation<LibraryNav>();
}
