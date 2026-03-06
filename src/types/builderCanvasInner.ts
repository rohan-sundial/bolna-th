import { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange } from '@xyflow/react';
import { NodeType } from '@/components/builder/nodes';

export interface BuilderCanvasInnerProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onAddNode: (type: NodeType, position?: { x: number; y: number }) => void;
  onNodeDoubleClick: (node: Node) => void;
  editingNode: Node | null;
  focusNodeId: string | null;
  fitViewTrigger: number;
}
