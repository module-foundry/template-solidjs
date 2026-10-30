import styles from "./home.module.scss";

import { type Component, For, Show } from "solid-js";

import { DeleteIcon } from "@/shared/assets";
import { i18n } from "@/shared/i18n";
import { createNotes } from "../model/create-notes";
import LocaleSelect from "./locale-select";
import NoteForm from "./note-form";

const HomePage: Component = () => {
  const notes = createNotes();

  return (
    <div class={styles.home}>
      <header class={styles.home__header}>
        <div>
          <p class={styles.home__eyebrow}>SolidJS / TypeScript / SCSS</p>
          <h1 class={styles.home__title}>{i18n.t("app")}</h1>
        </div>
        <LocaleSelect
          value={i18n.locale()}
          options={i18n.options}
          onChange={i18n.updateLocale}
        />
      </header>
      <p class={styles.home__intro}>{i18n.t("intro")}</p>
      <section class={styles.home__panel} aria-labelledby="notes-heading">
        <h2 class={styles.home__heading} id="notes-heading">
          {i18n.t("notes.title")}
        </h2>
        <NoteForm onAdd={notes.addNote} />
        <div class={styles.home__toolbar}>
          <p role="status">
            {i18n.t("notes.remaining")}: {notes.remaining()}
          </p>
          <label class={styles.home__filter}>
            <input
              type="checkbox"
              checked={notes.showCompleted()}
              onChange={(event) =>
                notes.setShowCompleted(event.currentTarget.checked)
              }
            />
            {i18n.t("notes.showCompleted")}
          </label>
        </div>
        <Show
          when={notes.visibleNotes().length > 0}
          fallback={
            <p class={styles.home__empty}>
              {notes.notes.length > 0
                ? i18n.t("notes.allDone")
                : i18n.t("notes.empty")}
            </p>
          }
        >
          <ul class={styles.home__list}>
            <For each={notes.visibleNotes()}>
              {(note) => (
                <li class={styles.home__note} data-completed={note.completed}>
                  <label class={styles.home__check}>
                    <input
                      type="checkbox"
                      checked={note.completed}
                      onChange={() => notes.toggleNote(note.id)}
                    />
                    <span class={styles.home__text}>{note.title}</span>
                  </label>
                  <button
                    class={styles.home__remove}
                    type="button"
                    aria-label={`${i18n.t("notes.remove")}: ${note.title}`}
                    onClick={() => notes.removeNote(note.id)}
                  >
                    <DeleteIcon class={styles.home__icon} aria-hidden="true" />
                  </button>
                </li>
              )}
            </For>
          </ul>
        </Show>
      </section>
      <p class={styles.home__hint}>{i18n.t("notes.sessionOnly")}</p>
    </div>
  );
};

export default HomePage;
