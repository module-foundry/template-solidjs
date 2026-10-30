export const enDict = {
  app: "Make it yours",
  intro:
    "A small working example. Add a note, complete it, and switch the language.",
  settings: { language: "Language" },
  notes: {
    title: "Your notes",
    label: "What would you like to do?",
    placeholder: "Build something useful",
    add: "Add note",
    required: "Enter a note before adding it.",
    tooLong: "Keep your note within 120 characters.",
    remaining: "Remaining",
    showCompleted: "Show completed",
    empty: "No notes yet. Add your first one above.",
    allDone: "All done. Completed notes are hidden.",
    remove: "Delete note",
    sessionOnly: "Notes stay in memory and reset when you reload the page.",
  },
};

export type Dict = typeof enDict;
