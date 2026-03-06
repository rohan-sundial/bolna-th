import cx from "classnames";
import { Loader2 } from "lucide-react";

export function FlowsPageLoader() {
  return (
    <div className={cx("flex items-center justify-center", "h-64")}>
      <Loader2
        className={cx("w-6 h-6", "text-terracotta-500", "animate-spin")}
      />
    </div>
  );
}
