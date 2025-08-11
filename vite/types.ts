export type BuildMode =
  | "insertcss"
  | "insertcss-compress"
  | "compress"
  | "analyzer"
  | "default";

export type VITE_EXPORT_PARAMS = {
  env?: Record<string, string>;
  mode: BuildMode;
};
