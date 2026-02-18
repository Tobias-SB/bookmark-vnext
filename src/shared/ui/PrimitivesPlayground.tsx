import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { AppButton } from "./AppButton";
import { AppCard } from "./AppCard";
import { AppChip } from "./AppChip";
import { AppDivider } from "./AppDivider";
import { AppSpacer } from "./AppSpacer";
import { AppText } from "./AppText";

import { useAppTheme } from "@/app/theme";

type Status = "Planned" | "Reading" | "Finished";

export function PrimitivesPlayground() {
  const { tokens } = useAppTheme();

  const [status, setStatus] = useState<Status>("Reading");
  const [wipOnly, setWipOnly] = useState(false);
  const [cardTapped, setCardTapped] = useState(false);

  const statusOptions: Status[] = useMemo(
    () => ["Planned", "Reading", "Finished"],
    [],
  );

  return (
    <ScrollView
      contentContainerStyle={{
        padding: tokens.space.md,
        paddingBottom: tokens.space.lg,
      }}
    >
      <AppText variant="title">UI Primitives Playground</AppText>
      <AppSpacer size="xs" />
      <AppText variant="secondary">
        Smoke-test tokens-first styling and shared components.
      </AppText>

      <AppDivider marginVertical={tokens.space.md} />

      <AppCard>
        <AppText variant="title">Buttons</AppText>
        <AppSpacer size="sm" />

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <View
            style={{
              marginRight: tokens.space.sm,
              marginBottom: tokens.space.sm,
            }}
          >
            <AppButton onPress={() => undefined}>Contained</AppButton>
          </View>

          <View
            style={{
              marginRight: tokens.space.sm,
              marginBottom: tokens.space.sm,
            }}
          >
            <AppButton mode="outlined" onPress={() => undefined}>
              Outlined
            </AppButton>
          </View>

          <View
            style={{
              marginRight: tokens.space.sm,
              marginBottom: tokens.space.sm,
            }}
          >
            <AppButton mode="text" onPress={() => undefined}>
              Text
            </AppButton>
          </View>

          <View
            style={{
              marginRight: tokens.space.sm,
              marginBottom: tokens.space.sm,
            }}
          >
            <AppButton disabled onPress={() => undefined}>
              Disabled
            </AppButton>
          </View>
        </View>

        <AppDivider inset={tokens.space.md} />

        <AppText variant="secondary">
          Contained buttons should be token-driven (primary + onPrimary).
        </AppText>
      </AppCard>

      <AppSpacer size="md" />

      <AppCard>
        <AppText variant="title">Chips</AppText>
        <AppSpacer size="sm" />

        <AppText variant="secondary">Status</AppText>
        <AppSpacer size="xs" />

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {statusOptions.map((s) => (
            <View
              key={s}
              style={{
                marginRight: tokens.space.sm,
                marginBottom: tokens.space.sm,
              }}
            >
              <AppChip
                label={s}
                selected={status === s}
                onPress={() => setStatus(s)}
                accessibilityLabel={`Set status ${s}`}
              />
            </View>
          ))}
        </View>

        <AppDivider inset={tokens.space.md} />

        <AppText variant="secondary">Toggle chip</AppText>
        <AppSpacer size="xs" />

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <View
            style={{
              marginRight: tokens.space.sm,
              marginBottom: tokens.space.sm,
            }}
          >
            <AppChip
              label={wipOnly ? "WIP only: ON" : "WIP only: OFF"}
              selected={wipOnly}
              onPress={() => setWipOnly((v) => !v)}
            />
          </View>

          <View
            style={{
              marginRight: tokens.space.sm,
              marginBottom: tokens.space.sm,
            }}
          >
            <AppChip label="Disabled chip" disabled />
          </View>
        </View>

        <AppSpacer size="xs" />
        <AppText variant="secondary">Selected: {status}</AppText>
      </AppCard>

      <AppSpacer size="md" />

      <AppCard
        onPress={() => setCardTapped((v) => !v)}
        accessibilityLabel="Interactive card"
      >
        <AppText variant="title">Card</AppText>
        <AppSpacer size="sm" />

        <AppText>
          Tap this card:{" "}
          <AppText variant="secondary">{cardTapped ? "ON" : "OFF"}</AppText>
        </AppText>

        <AppDivider marginVertical={tokens.space.md} />

        <AppText variant="secondary">
          Verifies: Pressable wrapper + Surface + tokenized border/radius/pad.
        </AppText>
      </AppCard>

      <AppSpacer size="md" />

      <AppCard disabled>
        <AppText variant="title">Disabled Card</AppText>
        <AppSpacer size="xs" />
        <AppText variant="secondary">
          Disabled styling should reduce opacity and prevent interaction.
        </AppText>
      </AppCard>
    </ScrollView>
  );
}
