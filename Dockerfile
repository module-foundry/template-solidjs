FROM node:24.18-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV HUSKY=0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_URL
ARG VITE_APP_SETTING_LS_AUTH_KEY=accessToken
ARG VITE_I18N_FALLBACK_LNG=en
ARG VITE_I18N_SUPPORTED_LOCALES=en,ru
ARG VITE_I18N_STORAGE_KEY=lang

RUN pnpm run build:production

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
