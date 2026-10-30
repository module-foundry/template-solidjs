# Build a Solid component

Load Solid/style rules through `AGENTS.md` and inspect the owner/callers.

1. Define the smallest contract for actual callers: values in, meaningful callbacks out, one state owner.
2. Implement reactive updates and, for async work, relevant loading/error/empty states, cancellation/stale-result handling and cleanup.
3. Add colocated SCSS Modules using tokens and native controls. Decorative SVGs use `aria-hidden`; icon-only actions need accessible names.
4. Verify interactions, changing props/locales, keyboard focus and affected viewports; follow `AGENTS.md` for automated checks.

Living examples: `pages/home/ui/locale-select.tsx` (controlled props/events), `note-form.tsx` (Valibot/errors/submit), `pages/home/model/create-notes.ts` (local/derived state), `home.module.scss` (tokens/layout). Read only the relevant example; adapt its responsibility rather than copying the notes domain.
