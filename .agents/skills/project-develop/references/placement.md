# Place or split a responsibility

Read `.agents/rules/structure.md`; inspect current callers and dependencies.

1. State `owner -> responsibility -> consumers/import direction` in task context. Use the canonical owner criteria and checkout example; do not create a new architecture document per component.
2. Resolve material business ambiguity with the user before the dependent change. For example, does a promotion change the shared order or only this screen's preview?
3. Implement the real owner and public API; after moves, update consumers and search for stale or forbidden imports. Follow `AGENTS.md` for verification.
