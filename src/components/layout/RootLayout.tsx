import cx from "classnames";
import { MainContent } from "./MainContent";
import { Sidebar } from "./sidebar/Sidebar";

export function RootLayout() {
  return (
    <div className={cx("min-h-screen", "flex")}>
      <Sidebar />
      <MainContent />
    </div>
  );
}
