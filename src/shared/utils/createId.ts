// src/shared/utils/createId.ts
export function createId(): string {
  const maybeCrypto = globalThis.crypto as
    | { randomUUID?: () => string }
    | undefined;
  if (maybeCrypto?.randomUUID) return maybeCrypto.randomUUID();

  return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
