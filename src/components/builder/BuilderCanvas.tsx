import { DragEvent, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes, NodeType } from "./nodes";
import { NodeLibrary } from "./NodeLibrary";

interface BuilderCanvasInnerProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onAddNode: (type: NodeType, position?: { x: number; y: number }) => void;
}

function BuilderCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onAddNode,
}: BuilderCanvasInnerProps) {
  const { screenToFlowPosition } = useReactFlow();

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();

      const type = e.dataTransfer.getData("application/reactflow") as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });

      onAddNode(type, position);
    },
    [screenToFlowPosition, onAddNode],
  );

  const handleAddNodeClick = useCallback(
    (type: NodeType) => {
      onAddNode(type);
    },
    [onAddNode],
  );

  return (
    <div
      className="relative w-full h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={{
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#9a8478",
          },
          style: { stroke: "#9a8478", strokeWidth: 2 },
        }}
        fitView
        fitViewOptions={{ padding: 0.5, maxZoom: 1 }}
        maxZoom={1.2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#d4c4b5" gap={16} />
        <Controls />
      </ReactFlow>
      <NodeLibrary onAddNode={handleAddNodeClick} />
    </div>
  );
}

interface BuilderCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onAddNode: (type: NodeType, position?: { x: number; y: number }) => void;
}

export function BuilderCanvas(props: BuilderCanvasProps) {
  return (
    <ReactFlowProvider>
      <BuilderCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
