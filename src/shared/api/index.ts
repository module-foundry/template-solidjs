export { ApiError, apiClient } from "./client";
export { authHandlerTelegram } from "./generated/clients/auth/auth-handler-telegram";
export type {
  AuthHandlerTelegramBody,
  AuthHandlerTelegramOptions,
  AuthHandlerTelegramResponse,
  AuthHandlerTelegramResponses,
} from "./generated/types/auth-handler-telegram";
export type { ErrorEnvelope } from "./generated/types/error-envelope";
export type { MiniAppTelegramRequest } from "./generated/types/mini-app-telegram-request";
export type { MiniAppTelegramResponse } from "./generated/types/mini-app-telegram-response";
