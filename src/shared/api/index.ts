import ky from "ky";

import { env } from "@/shared/config";

const headers: Record<string, string> = {};

export const api = ky.create({
  prefixUrl: env.VITE_API_URL,
  headers,
});

export default api;
