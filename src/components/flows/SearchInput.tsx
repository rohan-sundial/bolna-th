import cx from "classnames";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  return (
    <div className={cx("relative", "w-64")}>
      <Search
        className={cx(
          "absolute left-3 top-1/2 -translate-y-1/2",
          "w-4 h-4",
          "text-charcoal-700 pointer-events-none",
        )}
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          "pl-10",
          "bg-cream-50",
          "border-cream-300",
          "text-charcoal-800",
          "placeholder:text-charcoal-700",
          "focus-visible:ring-terracotta-500",
        )}
      />
    </div>
  );
}
