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
import { getFlowStore } from "@/store";
import { shallow } from "zustand/shallow";
import { Eye } from "lucide-react";
import { IconHeading } from "@tabler/icons-react";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HeaderNode } from "@/components/nodes/Header";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";

const nodeTypes = {
  Header: HeaderNode,
};

function Diagram() {
  const { task: taskId } = useParams<{ task: string }>();
  const useFlowStore = getFlowStore({ taskId, defaultDisplayMode: "edit" });
  const {
    nodes,
    setNodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    displayMode,
    setDisplayMode,
  } = useFlowStore((state) => state, shallow);
  const reactFlow = useReactFlow();

  const onNewNodeClick = useCallback(
    (event: any, type: string) => {
      const position = reactFlow.screenToFlowPosition({
        x: event.clientX + 75,
        y: event.clientY,
      });
      const newNode = {
        id: nanoid(),
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
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        proOptions={{ hideAttribution: true }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        className="border-t border-stone-300 bg-stone-50"
        fitView
      >
        <Panel position="top-right" className="bg-white">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Toggle
                  variant="outline"
                  aria-label="Toggle preview"
                  pressed={displayMode === "view"}
                  onPressedChange={(pressed) =>
                    setDisplayMode(pressed ? "view" : "edit")
                  }
                >
                  <Eye className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Preview</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Panel>
        {displayMode == "edit" && (
          <div className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1 rounded-2xl bg-stone-700 bg-opacity-10 p-1">
            <div className="flex flex-col gap-1.5 rounded-xl bg-white p-2">
              <Button
                variant="ghost"
                className="flex size-16 flex-col gap-1"
                onClick={(e) => onNewNodeClick(e, "Header")}
              >
                <IconHeading className="size-5" />
                <span className="text-xs">Header</span>
              </Button>
            </div>
          </div>
        )}
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
