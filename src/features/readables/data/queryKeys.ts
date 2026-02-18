export const readablesKeys = {
  all: ["readables"] as const,
  list: () => ["readables"] as const,
  detail: (id: string) => ["readables", id] as const,
};
