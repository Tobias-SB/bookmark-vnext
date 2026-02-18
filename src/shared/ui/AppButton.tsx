// src/shared/ui/AppButton.tsx
import { Button, type ButtonProps } from "react-native-paper";

import { useAppTheme } from "@/app/theme";

type Props = ButtonProps;

export function AppButton({ mode = "contained", ...rest }: Props) {
  const { tokens } = useAppTheme();

  const isContained = mode === "contained";
  const isTextLike = mode === "text" || mode === "outlined";

  return (
    <Button
      mode={mode}
      {...rest}
      buttonColor={isContained ? tokens.button.primaryBackground : undefined}
      textColor={
        isContained
          ? tokens.button.primaryText
          : isTextLike
            ? tokens.button.primaryBackground
            : undefined
      }
    />
  );
}
