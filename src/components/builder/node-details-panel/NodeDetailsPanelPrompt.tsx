import cx from "classnames";
import { TiptapEditor } from "@/components/ui/TiptapEditor";
import { ExpandableTextModal } from "@/components/ui/ExpandableTextModal";
import { NodeDetailsPanelSection } from "./NodeDetailsPanelSection";

interface NodeDetailsPanelPromptProps {
  prompt: string;
  hasError: boolean;
  onChange: (content: string) => void;
}

export function NodeDetailsPanelPrompt({
  prompt,
  hasError,
  onChange,
}: NodeDetailsPanelPromptProps) {
  return (
    <NodeDetailsPanelSection label="Prompt">
      <ExpandableTextModal
        title="Edit Prompt"
        expandedContent={
          <TiptapEditor content={prompt} onChange={onChange} />
        }
      >
        <div className={cx(hasError && "ring-1 ring-red-400 rounded-md")}>
          <TiptapEditor content={prompt} onChange={onChange} />
        </div>
      </ExpandableTextModal>
    </NodeDetailsPanelSection>
  );
}
