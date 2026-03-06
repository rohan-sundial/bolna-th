import cx from "classnames";

interface AppInitScreenProps {
  message: string;
  variant: "loading" | "error";
}

export function AppInitScreen({
  message,
  variant,
}: AppInitScreenProps) {
  return (
    <div
      className={cx(
        "min-h-screen",
        "flex flex-col items-center justify-center",
        "bg-cream-50",
      )}
    >
      {variant === "loading" && (
        <div
          className={cx(
            "w-8 h-8",
            "border-4 border-cream-300 border-t-terracotta-500",
            "rounded-full animate-spin",
          )}
        />
      )}
      <p
        className={cx(
          "font-medium",
          variant === "loading" && "mt-4 text-charcoal-700",
          variant === "error" && "text-terracotta-600",
        )}
      >
        {message}
      </p>
    </div>
  );
}
