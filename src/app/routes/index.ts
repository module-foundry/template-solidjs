import { type RouteDefinition } from "@solidjs/router";

import { HomePage } from "@/pages/home";

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: HomePage,
  },
];
