import { BuildMode } from "./types";

export const normalizeFlags = (mode: BuildMode) => ({
  inlineCss: mode.includes("insertcss"),
  compress: mode.includes("compress"),
  analyze: mode === "analyzer",
});

export const manualDeps = <T extends Record<string, string>>(
  deps: T,
  exclude?: (keyof T)[],
): (keyof T)[] => Object.keys(deps).filter((v) => !exclude?.includes(v));
