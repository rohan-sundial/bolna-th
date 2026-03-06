import { Input } from "@/components/ui/input";
import { NodeDetailsPanelSection } from "./NodeDetailsPanelSection";
import { inputBaseStyles } from "./nodeDetailsPanelStyles";

interface NodeDetailsPanelDescriptionProps {
  description: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function NodeDetailsPanelDescription({
  description,
  onChange,
}: NodeDetailsPanelDescriptionProps) {
  return (
    <NodeDetailsPanelSection label="Description">
      <Input
        value={description}
        onChange={onChange}
        className={inputBaseStyles}
      />
    </NodeDetailsPanelSection>
  );
}
