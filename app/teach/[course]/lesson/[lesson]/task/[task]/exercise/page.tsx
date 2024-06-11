"use client";

import { useEffect, useState } from "react";
import { DiagramEdit } from "@/components/tasks/DiagramEdit";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useDiagramStore } from "@/store/diagram";
import { useParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Shuffle, Workflow } from "lucide-react";
import { getNodesBounds } from "reactflow";

export default function EditTaskPage() {
  const { task: taskId } = useParams<{ task: string }>();

  const [navLinksPortal, setNavLinksPortal] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setNavLinksPortal(document.getElementById("navLinksPortal"));
  }, []);

  const { answerNodes, answerEdges, exerciseNodes } = useDiagramStore(
    (state) => ({
      answerNodes: state.diagrams[taskId]?.answer.nodes || [],
      answerEdges: state.diagrams[taskId]?.answer.edges || [],
      exerciseNodes: state.diagrams[taskId]?.exercise.nodes || [],
    }),
  );

  const { setNodes, setEdges } = useDiagramStore.getState();
  function duplicateAnswer() {
    setNodes(taskId, "exercise", answerNodes);
    setEdges(taskId, "exercise", answerEdges);
  }

  function clearEdges() {
    setEdges(taskId, "exercise", []);
  }

  function shuffleNodes() {
    const { x, y, width, height } = getNodesBounds(exerciseNodes);

    const newNodes = exerciseNodes.map((node) => ({
      ...node,
      position: {
        x: x + Math.random() * width,
        y: y + Math.random() * height,
      },
    }));

    setNodes(taskId, "exercise", newNodes);
  }

  return (
    <>
      {navLinksPortal
        ? createPortal(
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="self-end"
                      onClick={duplicateAnswer}
                    >
                      <Copy className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Дублювати відповідь</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="self-end"
                      onClick={clearEdges}
                    >
                      <Workflow className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Очистити зв&apos;язки</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="self-end"
                      onClick={shuffleNodes}
                    >
                      <Shuffle className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Випадкове розташування вузлів</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>,
            navLinksPortal,
          )
        : null}
      <DiagramEdit diagramVariant="exercise" />;
    </>
  );
}
