import { parseEnv } from "@/shared/lib/env-validation";

export const env = parseEnv(import.meta.env);
