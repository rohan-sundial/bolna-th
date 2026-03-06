import {
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BuilderCanvasInner } from "./BuilderCanvasInner";
import { NodeType } from "./nodes";

interface BuilderCanvasProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onAddNode: (type: NodeType, position?: { x: number; y: number }) => void;
  onNodeDoubleClick: (node: Node) => void;
  editingNode?: Node | null;
  focusNodeId?: string | null;
  fitViewTrigger?: number;
}

export function BuilderCanvas({
  editingNode = null,
  focusNodeId = null,
  fitViewTrigger = 0,
  ...props
}: BuilderCanvasProps) {
  return (
    <ReactFlowProvider>
      <BuilderCanvasInner
        {...props}
        editingNode={editingNode}
        focusNodeId={focusNodeId}
        fitViewTrigger={fitViewTrigger}
      />
    </ReactFlowProvider>
  );
}
