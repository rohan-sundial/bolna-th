import cx from "classnames";
import { Loader2 } from "lucide-react";

interface RefetchingIndicatorProps {
  isRefetching: boolean;
}

export function RefetchingIndicator({ isRefetching }: RefetchingIndicatorProps) {
  return (
    <div className="w-4">
      {isRefetching && (
        <Loader2
          className={cx("w-4 h-4", "text-charcoal-500", "animate-spin")}
        />
      )}
    </div>
  );
}
