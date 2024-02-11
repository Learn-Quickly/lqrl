"use client";

import { useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Panel,
  Controls,
  MiniMap,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { RFState, useFlowStore } from "@/store";
import { shallow } from "zustand/shallow";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  setNodes: state.setNodes,
  edges: state.edges,
  setEdges: state.setEdges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

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

function Diagram() {
  const { nodes, setNodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useFlowStore(selector, shallow);
  const reactFlow = useReactFlow();

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

      const position = reactFlow.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes([newNode]);
    },
    [reactFlow],
  );

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <Sidebar />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        proOptions={{ hideAttribution: true }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
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

export function DiagramEdit() {
  return (
    <ReactFlowProvider>
      <Diagram />
    </ReactFlowProvider>
  );
}
