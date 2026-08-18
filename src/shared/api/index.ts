import { env } from "@/shared/config";

const HTTP_NO_CONTENT_STATUS = 204;

const getRequestUrl = (path: string) =>
  `${env.VITE_API_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

const getResponseData = async <T>(response: Response): Promise<T> => {
  if (response.status === HTTP_NO_CONTENT_STATUS || !response.body) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export class ApiError<T> extends Error {
  public readonly data: T;
  public readonly status: number;

  public constructor(status: number, data: T) {
    super(`API request failed with status ${status}`);

    this.name = "ApiError";
    this.data = data;
    this.status = status;
  }
}

export const apiRequest = async <T>(
  path: string,
  options: RequestInit,
): Promise<T> => {
  const headers = new Headers(options.headers);
  const accessToken = sessionStorage.getItem(env.VITE_APP_SETTING_LS_AUTH_KEY);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(getRequestUrl(path), { ...options, headers });
  const data = await getResponseData<T>(response);

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data;
};

export type ErrorType<T> = ApiError<T>;
export type BodyType<T> = T;
