import cx from "classnames";

/** Base styles for label elements in the node details panel */
export const labelStyles = cx(
  "text-[10px] font-medium uppercase tracking-wide",
  "text-charcoal-400",
);

/** Base styles for editable input fields in the node details panel */
export const inputBaseStyles = cx("h-7 text-xs", "bg-white/80");

/** Styles for read-only input fields (like ID) */
export const inputReadOnlyStyles = cx(
  "h-7 text-xs font-mono pr-7",
  "bg-cream-100/50",
  "text-charcoal-500",
  "cursor-default select-all",
);
