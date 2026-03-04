import cx from "classnames";
import { IUser } from "../../../types/auth";

interface UserProfileProps {
  user: IUser;
}

export function UserProfile({ user }: UserProfileProps) {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className={cx("p-2", "border-t border-cream-300")}>
      <div className={cx("flex items-center gap-3", "px-3 py-2")}>
        <div
          className={cx(
            "w-8 h-8",
            "flex items-center justify-center",
            "rounded-full bg-clay-500",
          )}
        >
          <span className={cx("text-sm font-medium", "text-cream-50")}>
            {initial}
          </span>
        </div>
        <span
          className={cx("text-sm font-medium", "text-charcoal-700", "truncate")}
        >
          {user.name}
        </span>
      </div>
    </div>
  );
}
