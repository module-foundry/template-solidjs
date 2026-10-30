import styles from "./locale-select.module.scss";

import { type Component, For, type JSX } from "solid-js";

import { i18n, type Locale } from "@/shared/i18n";

interface LocaleSelectProps {
  value: Locale;
  options: readonly { value: Locale; label: string }[];
  onChange: (locale: Locale) => void;
}

const LocaleSelect: Component<LocaleSelectProps> = (props) => {
  const selectLocale: JSX.EventHandler<HTMLSelectElement, Event> = (event) => {
    const option = props.options.find(
      (item) => item.value === event.currentTarget.value,
    );

    if (option) {
      props.onChange(option.value);
    }
  };

  return (
    <label class={styles["locale-select"]}>
      <span>{i18n.t("settings.language")}</span>
      <select
        class={styles["locale-select__control"]}
        value={props.value}
        onChange={selectLocale}
      >
        <For each={props.options}>
          {(option) => <option value={option.value}>{option.label}</option>}
        </For>
      </select>
    </label>
  );
};

export default LocaleSelect;
