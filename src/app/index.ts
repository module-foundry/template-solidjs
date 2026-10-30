/* @refresh reload */
import "./styles/main.scss";

import { createComponent } from "solid-js";
import { render } from "solid-js/web";

import { i18n } from "@/shared/i18n";
import App from "./app";

const root = document.getElementById("root");

if (!(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}

i18n.parseLocale();
render(() => createComponent(App, {}), root);
