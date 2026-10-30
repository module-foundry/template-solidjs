import styles from "./note-form.module.scss";

import {
  type Component,
  createMemo,
  createSignal,
  createUniqueId,
  type JSX,
  Show,
} from "solid-js";
import { safeParse } from "valibot";

import { AddIcon } from "@/shared/assets";
import { i18n } from "@/shared/i18n";
import { noteTitleSchema } from "../model/create-notes";

interface NoteFormProps {
  onAdd: (title: string) => void;
}

const NoteForm: Component<NoteFormProps> = (props) => {
  const [title, setTitle] = createSignal("");
  const [submitted, setSubmitted] = createSignal(false);
  const errorId = createUniqueId();
  const validation = createMemo(() => safeParse(noteTitleSchema, title()));
  const error = () => {
    if (!submitted() || validation().success) {
      return undefined;
    }

    return title().trim().length === 0
      ? i18n.t("notes.required")
      : i18n.t("notes.tooLong");
  };

  const addNote: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault();
    setSubmitted(true);
    const result = validation();

    if (!result.success) {
      return;
    }

    props.onAdd(result.output);
    setTitle("");
    setSubmitted(false);
  };

  return (
    <form class={styles["note-form"]} onSubmit={addNote} noValidate>
      <label class={styles["note-form__label"]}>
        <span>{i18n.t("notes.label")}</span>
        <input
          class={styles["note-form__input"]}
          type="text"
          name="note"
          value={title()}
          required
          aria-invalid={Boolean(error())}
          aria-describedby={error() ? errorId : undefined}
          placeholder={i18n.t("notes.placeholder")}
          onInput={(event) => setTitle(event.currentTarget.value)}
        />
      </label>
      <button class={styles["note-form__submit"]} type="submit">
        <AddIcon class={styles["note-form__icon"]} aria-hidden="true" />
        {i18n.t("notes.add")}
      </button>
      <Show when={error()}>
        {(message) => (
          <p class={styles["note-form__error"]} id={errorId} role="alert">
            {message()}
          </p>
        )}
      </Show>
    </form>
  );
};

export default NoteForm;
