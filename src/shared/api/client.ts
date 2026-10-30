import { env } from "@/shared/config";

const HTTP_NO_CONTENT_STATUS = 204;

type DataShape = {
  body?: unknown;
  headers?: object;
  path?: object;
  query?: object;
};

type RequestConfig = DataShape & {
  method: string;
  url: string;
  baseURL?: string;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
  options?: RequestInit;
  security?: object[];
  contentType?: string | { request?: string; response?: string };
  responseType?: "json" | "text" | "blob" | "arrayBuffer";
  throwOnError?: boolean;
  client?: typeof client;
};

export type Options<
  TData extends DataShape,
  ThrowOnError extends boolean = true,
> = Omit<RequestConfig, keyof DataShape | "url" | "method" | "throwOnError"> &
  TData & { throwOnError?: ThrowOnError };

type SuccessStatus<TResponses> = Extract<
  keyof TResponses,
  `2${string}` | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226
>;

type ResponseMetadata<TStatus> = {
  status: TStatus extends `${infer Status extends number}`
    ? Status
    : TStatus extends number
      ? TStatus
      : number;
  contentType: string | null;
  request: Request;
  response: Response;
};

type ResponseResult<TResponses> = {
  [Status in keyof TResponses]: ResponseMetadata<Status> &
    (Status extends SuccessStatus<TResponses>
      ? { data: TResponses[Status]; error: undefined }
      : { data: undefined; error: TResponses[Status] });
}[keyof TResponses];

export type RequestResult<
  TResponses,
  ThrowOnError extends boolean = true,
> = ThrowOnError extends true
  ? TResponses[SuccessStatus<TResponses>]
  : ResponseResult<TResponses>;

export class ApiError<T = unknown> extends Error {
  public readonly data: T;
  public readonly status: number;

  public constructor(status: number, data: T) {
    super(`API request failed with status ${status}`);

    this.name = "ApiError";
    this.data = data;
    this.status = status;
  }
}

const getRequestUrl = (config: RequestConfig): URL => {
  const path: Record<string, unknown> = { ...config.path };
  const pathname = config.url.replace(/\{([^{}]+)\}/g, (_, name: string) => {
    const value = path[name];

    if (value === undefined || value === null) {
      throw new Error(`Missing API path parameter: ${name}`);
    }

    return encodeURIComponent(String(value));
  });
  const baseURL = (config.baseURL ?? env.VITE_API_URL).replace(/\/+$/, "");
  const url = new URL(`${baseURL}${pathname}`);

  for (const [name, value] of Object.entries(config.query ?? {})) {
    const values: unknown[] = Array.isArray(value) ? value : [value];

    for (const item of values) {
      if (item !== undefined && item !== null) {
        url.searchParams.append(name, String(item));
      }
    }
  }

  return url;
};

const getRequestHeaders = (config: RequestConfig): Headers => {
  const headers = new Headers(config.options?.headers);

  for (const [name, value] of Object.entries(config.headers ?? {})) {
    if (value !== undefined && value !== null) {
      headers.set(name, String(value));
    }
  }

  const accessToken = sessionStorage.getItem(env.VITE_APP_SETTING_LS_AUTH_KEY);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
};

const getRequestBody = (
  body: unknown,
  headers: Headers,
): BodyInit | undefined => {
  if (body === undefined) {
    return undefined;
  }

  if (body instanceof FormData) {
    headers.delete("Content-Type");
    return body;
  }

  if (body instanceof Blob || body instanceof URLSearchParams) {
    return body;
  }

  if (
    typeof body === "string" &&
    !headers.get("Content-Type")?.includes("json")
  ) {
    return body;
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return JSON.stringify(body);
};

const readResponse = async (
  response: Response,
  responseType: RequestConfig["responseType"],
): Promise<unknown> => {
  if (response.status === HTTP_NO_CONTENT_STATUS || !response.body) {
    return undefined;
  }

  if (response.ok) {
    return await response[responseType ?? "json"]();
  }

  const body = await response.text();

  if (!body.trim()) {
    return undefined;
  }

  const contentType = response.headers
    .get("content-type")
    ?.split(";")[0]
    ?.trim()
    .toLowerCase();

  if (contentType !== "application/json" && !contentType?.endsWith("+json")) {
    return body;
  }

  try {
    const data: unknown = JSON.parse(body);
    return data;
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

    // A malformed error envelope must not hide the original HTTP failure.
    return body;
  }
};

// Kubb's generated operations supply response types; the transport keeps external data unknown.
export const client = async (config: RequestConfig): Promise<unknown> => {
  const headers = getRequestHeaders(config);
  const contentType =
    typeof config.contentType === "string"
      ? config.contentType
      : config.contentType?.request;

  if (contentType !== undefined) {
    headers.set("Content-Type", contentType);
  }

  const body = getRequestBody(config.body, headers);
  const options: RequestInit = {
    ...config.options,
    method: config.method,
    headers,
  };

  if (body !== undefined) {
    options.body = body;
  }

  if (config.signal !== undefined) {
    options.signal = config.signal;
  }

  if (config.credentials !== undefined) {
    options.credentials = config.credentials;
  }

  const request = new Request(getRequestUrl(config), options);
  const response = await fetch(request);
  const data = await readResponse(response, config.responseType);

  if (config.throwOnError ?? true) {
    if (!response.ok) {
      throw new ApiError(response.status, data);
    }

    return data;
  }

  return {
    status: response.status,
    data: response.ok ? data : undefined,
    error: response.ok ? undefined : data,
    contentType: response.headers.get("content-type"),
    request,
    response,
  };
};

export { client as apiClient };
