import cx from "classnames";
import { useAuthContext } from "../../../context/AuthContext";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { UserProfile } from "./UserProfile";

export function Sidebar() {
  const { user } = useAuthContext();

  return (
    <aside
      className={cx(
        "w-60",
        "flex flex-col",
        "bg-cream-100 border-r border-cream-300",
      )}
    >
      <SidebarHeader />
      <SidebarNav />
      {user && <UserProfile user={user} />}
    </aside>
  );
}
