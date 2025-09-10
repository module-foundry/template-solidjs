import { Home } from "@/pages/home";

import { type RouteDefinition } from "@solidjs/router";

export const routes: RouteDefinition[] = [
  {
    component: Home,
    path: "/",
  },
];
