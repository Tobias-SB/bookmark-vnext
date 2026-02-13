// src/features/dev/ui/UIPlaygroundScreen.tsx
import { AppScreen } from "@/shared/ui";
import { PrimitivesPlayground } from "@/shared/ui/PrimitivesPlayground";

export function UIPlaygroundScreen() {
  return (
    <AppScreen padded={false}>
      <PrimitivesPlayground />
    </AppScreen>
  );
}
