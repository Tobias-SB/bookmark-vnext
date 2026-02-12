import { View } from "react-native";

type Props = {
  size?: number;
};

export function AppSpacer({ size = 12 }: Props) {
  return <View style={{ height: size }} />;
}
