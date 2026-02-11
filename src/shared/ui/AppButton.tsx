import { Button, type ButtonProps } from "react-native-paper";
import { useAppThemeMode } from "@/app/theme";

type Props = ButtonProps;

export function AppButton(props: Props) {
  const { tokens } = useAppThemeMode();

  return (
    <Button
      {...props}
      buttonColor={tokens.button.primaryBackground}
      textColor={tokens.button.primaryText}
    />
  );
}
