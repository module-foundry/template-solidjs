import { i18n } from "@/shared/i18n";

const HomePage = () => {
  const { t } = i18n;

  return <div>{t("app")} 12</div>;
};

export default HomePage;
