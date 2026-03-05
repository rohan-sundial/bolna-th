import cx from "classnames";
import { AppLogo } from "../../ui/AppLogo";

export function SidebarHeader() {
  return (
    <div className={cx("h-14 px-4", "flex items-center", "border-b border-cream-300")}>
      <div className={cx("flex items-center gap-2")}>
        <AppLogo className={cx("w-6 h-6", "text-terracotta-600")} />
        <h1 className={cx("text-lg font-semibold", "text-charcoal-800")}>
          Flow Builder
        </h1>
      </div>
    </div>
  );
}
