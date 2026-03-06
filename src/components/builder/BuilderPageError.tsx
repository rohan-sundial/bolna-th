import cx from "classnames";
import { Link } from "react-router-dom";

export function BuilderPageError() {
  return (
    <div
      className={cx("flex-1 flex flex-col items-center justify-center gap-4")}
    >
      <p className="text-charcoal-700">Workflow not found</p>
      <Link
        to="/flows"
        className={cx("text-terracotta-600", "hover:underline")}
      >
        Back to workflows
      </Link>
    </div>
  );
}
