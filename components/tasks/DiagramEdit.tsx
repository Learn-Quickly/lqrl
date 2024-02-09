"use client";

import { useCallback } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Theme 1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "Theme 2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export function DiagramEdit() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );
  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <div className="flex gap-4 p-4 md:h-full md:flex-col">
        <h1>Diagram controls</h1>
        <h1>Diagram controls</h1>
        <h1>Diagram controls</h1>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        proOptions={{ hideAttribution: true }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        className="rounded-tl-2xl border border-stone-300 bg-stone-50"
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
