import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { maxLength, minLength, pipe, string, trim } from "valibot";

const MAX_NOTE_LENGTH = 120;

export const noteTitleSchema = pipe(
  string(),
  trim(),
  minLength(1),
  maxLength(MAX_NOTE_LENGTH),
);

type Note = {
  id: string;
  title: string;
  completed: boolean;
};

export const createNotes = () => {
  const [notes, setNotes] = createStore<Note[]>([]);
  const [showCompleted, setShowCompleted] = createSignal(true);
  const remaining = createMemo(
    () => notes.filter((note) => !note.completed).length,
  );
  const visibleNotes = createMemo(() =>
    showCompleted() ? notes : notes.filter((note) => !note.completed),
  );

  const addNote = (title: string) => {
    setNotes(notes.length, {
      id: crypto.randomUUID(),
      title,
      completed: false,
    });
  };

  const toggleNote = (id: string) => {
    setNotes(
      (note) => note.id === id,
      "completed",
      (completed) => !completed,
    );
  };

  const removeNote = (id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id));
  };

  return {
    notes,
    showCompleted,
    setShowCompleted,
    remaining,
    visibleNotes,
    addNote,
    toggleNote,
    removeNote,
  };
};
