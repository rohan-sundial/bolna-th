import { Input } from "@/components/ui/input";
import cx from "classnames";
import { Check, Copy } from "lucide-react";
import { NodeDetailsPanelLabel } from "./NodeDetailsPanelLabel";
import { inputBaseStyles, inputReadOnlyStyles } from "./nodeDetailsPanelStyles";
import type { NodeData } from "./nodeTypeStyles";

interface NodeDetailsPanelIdAndNameProps {
  nodeId: string;
  nodeType: string | undefined;
  data: NodeData;
  copied: boolean;
  hasNameError: boolean;
  onCopyId: () => void;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NodeDetailsPanelIdAndName({
  nodeId,
  nodeType,
  data,
  copied,
  hasNameError,
  onCopyId,
  onNameChange,
}: NodeDetailsPanelIdAndNameProps) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr] gap-x-2 gap-y-2 items-center">
      {/* ID Field */}
      <NodeDetailsPanelLabel>ID</NodeDetailsPanelLabel>
      <div className="relative group">
        <Input
          value={nodeId}
          readOnly
          className={inputReadOnlyStyles}
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
        <button
          onClick={onCopyId}
          className={cx(
            "absolute right-1 top-1/2 -translate-y-1/2",
            "p-1 rounded",
            "text-charcoal-400 hover:text-charcoal-600",
            "hover:bg-cream-200",
            "opacity-0 group-hover:opacity-100",
            "transition-all",
          )}
          title="Copy ID"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Name Field (not for start node) */}
      {nodeType !== "start" && (
        <>
          <NodeDetailsPanelLabel>Name</NodeDetailsPanelLabel>
          <Input
            value={data.label || ""}
            onChange={onNameChange}
            className={cx(
              inputBaseStyles,
              hasNameError && "ring-1 ring-red-400",
            )}
          />
        </>
      )}
    </div>
  );
}
