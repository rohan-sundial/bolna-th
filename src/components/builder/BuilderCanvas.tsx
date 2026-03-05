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
  Connection,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  reconnectEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes, NodeType } from "./nodes";
import { edgeTypes } from "./edges";
import { NodeLibrary } from "./NodeLibrary";

interface BuilderCanvasInnerProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onAddNode: (type: NodeType, position?: { x: number; y: number }) => void;
}

function BuilderCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  setEdges,
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

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      setEdges((edges) => reconnectEdge(oldEdge, newConnection, edges));
    },
    [setEdges],
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // No self-connections
      if (connection.source === connection.target) {
        return false;
      }

      // Start node cannot be a target
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (targetNode?.type === 'start') {
        return false;
      }

      // Check if there's already an edge from this sourceHandle
      const existingEdge = edges.find(
        (e) =>
          e.source === connection.source &&
          e.sourceHandle === connection.sourceHandle
      );
      if (existingEdge) {
        return false;
      }

      return true;
    },
    [nodes, edges],
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
        onReconnect={onReconnect}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: "labeled",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#9a8478",
          },
          style: { stroke: "#9a8478", strokeWidth: 1.5 },
        }}
        deleteKeyCode={['Backspace', 'Delete']}
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
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onAddNode: (type: NodeType, position?: { x: number; y: number }) => void;
}

export function BuilderCanvas(props: BuilderCanvasProps) {
  return (
    <ReactFlowProvider>
      <BuilderCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
