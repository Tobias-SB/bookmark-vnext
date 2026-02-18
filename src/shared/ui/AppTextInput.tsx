// src/shared/ui/AppTextInput.tsx
import { TextInput, type TextInputProps } from "react-native-paper";
import { useAppTheme } from "@/app/theme";

type Props = TextInputProps;

export function AppTextInput({ mode = "outlined", ...rest }: Props) {
  const { tokens } = useAppTheme();

  return (
    <TextInput
      mode={mode}
      {...rest}
      outlineColor={tokens.card.border}
      activeOutlineColor={tokens.button.primaryBackground}
      textColor={tokens.text.primary}
      placeholderTextColor={tokens.text.secondary}
    />
  );
}
