"use client";

import { useState, useEffect, useCallback } from "react";
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
import { BookA, Eye, FastForward } from "lucide-react";
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
import {
  DiagramNode,
  DiagramVariant,
  IDefinitionNode,
  IHeaderNode,
  IProcessStages,
  useDiagramStore,
} from "@/store/diagram";
import { DefinitionNode } from "@/components/nodes/Definition";
import { ProcessStagesNode } from "@/components/nodes/ProcessStages";
import { useApiGetExerciseHandler } from "@/hooks/useApiGetExerciseHandler";
import { serverConnectionsToEdges, serverNodesToNodes } from "@/lib/diagram";

const nodeTypes = {
  Header: HeaderNode,
  Definition: DefinitionNode,
  ProcessStages: ProcessStagesNode,
};

function getNewNodeTypeData(
  type: DiagramNode["type"],
):
  | Pick<IHeaderNode, "type" | "data">
  | Pick<IDefinitionNode, "type" | "data">
  | Pick<IProcessStages, "type" | "data"> {
  if (type == "Header") {
    return { type, data: { header: `${type} node` } };
  } else if (type == "Definition") {
    return {
      type,
      data: {
        header: `${type} node`,
        definition: `${type} node definition`,
      },
    };
  } else {
    return {
      type,
      data: { header: `${type} node`, stages: [{ id: 0, name: "name" }] },
    };
  }
}

function Diagram({ diagramVariant }: { diagramVariant: DiagramVariant }) {
  const { task: taskId } = useParams<{ task: string }>();
  const exercise = useApiGetExerciseHandler(parseInt(taskId));

  const { diagrams, initializeDiagram } = useDiagramStore((state) => ({
    diagrams: state.diagrams,
    initializeDiagram: state.initializeDiagram,
  }));
  const { nodes, edges, displayMode } = useDiagramStore((state) => ({
    nodes: state.diagrams[taskId]?.[diagramVariant].nodes || [],
    edges: state.diagrams[taskId]?.[diagramVariant].edges || [],
    displayMode: state.diagrams[taskId]?.[diagramVariant].displayMode || "edit",
  }));

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!diagrams[taskId] && exercise.data) {
      initializeDiagram({
        taskId,
        defaultDisplayMode: "edit",
        initialExerciseNodes: serverNodesToNodes(
          exercise.data.exercise_body.nodes,
        ),
        initialExerciseEdges: serverConnectionsToEdges(
          exercise.data.exercise_body.connections,
        ),
        initialAnswerNodes: serverNodesToNodes(exercise.data.answer_body.nodes),
        initialAnswerEdges: serverConnectionsToEdges(
          exercise.data.answer_body.connections,
        ),
      });
    }
    setIsInitialized(true);
  }, [taskId, diagrams, initializeDiagram, exercise.data]);

  const reactFlow = useReactFlow();

  const onNewNodeClick = useCallback(
    (event: any, type: DiagramNode["type"]) => {
      const position = reactFlow.screenToFlowPosition({
        x: event.clientX + 75,
        y: event.clientY,
      });
      const newNodeTypeData = getNewNodeTypeData(type);
      const newNode: DiagramNode = {
        id: nanoid(),
        position,
        ...newNodeTypeData,
      };

      useDiagramStore.getState().setNodes(taskId, diagramVariant, [newNode]);
    },
    [taskId, diagramVariant, reactFlow],
  );

  if (!isInitialized) return <div />;

  const { onNodesChange, onEdgesChange, onConnect, setDisplayMode } =
    useDiagramStore.getState();

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        proOptions={{ hideAttribution: true }}
        onNodesChange={(changes) =>
          onNodesChange(taskId, diagramVariant, changes)
        }
        onEdgesChange={(changes) =>
          onEdgesChange(taskId, diagramVariant, changes)
        }
        onConnect={(connection) =>
          onConnect(taskId, diagramVariant, connection)
        }
        className="border-t border-stone-300 bg-stone-50"
        fitView
      >
        <Panel position="top-right" className="bg-white">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  variant="outline"
                  aria-label="Toggle preview"
                  pressed={displayMode === "view"}
                  onPressedChange={(pressed) =>
                    setDisplayMode(
                      taskId,
                      diagramVariant,
                      pressed ? "view" : "edit",
                    )
                  }
                >
                  <Eye className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>Попередній перегляд</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Panel>
        {displayMode == "edit" && (
          <div className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2 rounded-2xl bg-stone-700 bg-opacity-10 p-1">
            <div className="flex flex-col gap-1.5 rounded-xl bg-white p-2">
              <Button
                variant="ghost"
                className="flex size-16 flex-col gap-1"
                onClick={(e) => onNewNodeClick(e, "Header")}
              >
                <IconHeading className="size-5" />
                <span className="text-xs">Заголовок</span>
              </Button>
            </div>
            <div className="flex flex-col gap-1.5 rounded-xl bg-white p-2">
              <Button
                variant="ghost"
                className="flex size-16 flex-col gap-1"
                onClick={(e) => onNewNodeClick(e, "Definition")}
              >
                <BookA className="size-5" />
                <span className="text-xs">Визначення</span>
              </Button>
            </div>
            <div className="flex flex-col gap-1.5 rounded-xl bg-white p-2">
              <Button
                variant="ghost"
                className="flex size-16 flex-col gap-1"
                onClick={(e) => onNewNodeClick(e, "ProcessStages")}
              >
                <FastForward className="size-5" />
                <span className="text-xs">Етапи</span>
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

export function DiagramEdit({
  diagramVariant,
}: {
  diagramVariant: DiagramVariant;
}) {
  return (
    <ReactFlowProvider>
      <Diagram diagramVariant={diagramVariant} />
    </ReactFlowProvider>
  );
}
