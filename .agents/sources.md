# Rule sources

Load only when maintaining rules. These are local project adaptations; official API semantics take precedence over community conventions.

- Skills/workflow: [Codex skills](https://developers.openai.com/codex/skills/), [concise agent instructions](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra), [OpenCode skills](https://opencode.ai/docs/skills/) and [agents](https://opencode.ai/docs/agents/).
- TypeScript/async: [narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html), [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), [cross-env](https://github.com/kentcdodds/cross-env#usage).
- Solid: [props](https://docs.solidjs.com/concepts/components/props), [reactivity](https://docs.solidjs.com/concepts/intro-to-reactivity), [events](https://docs.solidjs.com/reference/jsx-attributes/on_) and [cleanup](https://docs.solidjs.com/reference/lifecycle/on-cleanup). Do not apply React execution/hook assumptions.
- UI/styles: [WAI APG](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/), [Sass modules](https://sass-lang.com/documentation/at-rules/use/), [Vite CSS Modules](https://v7.vite.dev/config/shared-options#css-modules), [incremental class names](https://github.com/shoonia/mini-css-class-name) and [Solid SVG](https://github.com/jfgodoy/vite-plugin-solid-svg).
- FSD: [layers](https://feature-sliced.design/docs/reference/layers), [slices/segments](https://feature-sliced.design/docs/reference/slices-segments) and [public APIs](https://feature-sliced.design/docs/reference/public-api). Pages-first extraction, protected placeholders and centralized assets are local choices in `AGENTS.md` and `structure.md`.
- Configuration: [Terser](https://terser.org/docs/options/), [Valibot checks](https://valibot.dev/api/check/), [Husky](https://typicode.github.io/husky/how-to.html), [pnpm peer rules](https://pnpm.io/settings#peerdependencyrulesallowedversions), [pnpm Docker](https://pnpm.io/docker) and [Docker build arguments](https://docs.docker.com/build/building/variables/).

Keep third-party license/attribution notices when copying substantial source material; avoid accumulating copied manuals or universal rules from individual examples.
