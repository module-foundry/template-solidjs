import { Component, JSX } from "solid-js";
import { i18n } from "@/shared/i18n";

interface HomeProps extends JSX.HTMLAttributes<HTMLElement> {}

const Home: Component<HomeProps> = () => {
  const { t } = i18n;

  return <div>{t("app")} 12</div>;
};

export default Home;
