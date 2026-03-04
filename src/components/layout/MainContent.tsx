import cx from "classnames";
import { Outlet } from "react-router-dom";

export function MainContent() {
  return (
    <main className={cx("flex-1", "bg-cream-50", "overflow-auto")}>
      <div className={cx("max-w-6xl mx-auto")}>
        <Outlet />
      </div>
    </main>
  );
}
