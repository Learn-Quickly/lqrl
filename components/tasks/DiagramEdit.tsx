"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
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

function Sidebar() {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="flex gap-4 p-4 md:h-full md:flex-col">
      <div className="description">
        Add nodes to the diagram by dragging them from the sidebar
      </div>
      <div onDragStart={(event) => onDragStart(event, "input")} draggable>
        Input Node
      </div>
      <div onDragStart={(event) => onDragStart(event, "default")} draggable>
        Default Node
      </div>
      <div onDragStart={(event) => onDragStart(event, "output")} draggable>
        Output Node
      </div>
    </aside>
  );
}

let id = 0;
const getId = () => `dndnode_${id++}`;

export function DiagramEdit() {
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      // @ts-ignore
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <ReactFlowProvider>
        <Sidebar />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          proOptions={{ hideAttribution: true }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // @ts-ignore
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          className="rounded-tl-2xl border border-stone-300 bg-stone-50"
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
