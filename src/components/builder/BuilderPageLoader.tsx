import cx from "classnames";
import { Loader2 } from "lucide-react";

export function BuilderPageLoader() {
  return (
    <div className={cx("flex-1 flex items-center justify-center")}>
      <Loader2
        className={cx("w-6 h-6", "text-terracotta-500", "animate-spin")}
      />
    </div>
  );
}
