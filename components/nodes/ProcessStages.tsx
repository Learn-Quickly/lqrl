import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import {
  DiagramVariant,
  IProcessStages,
  useDiagramStore,
} from "@/store/diagram";
import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export function ProcessStagesNode({
  id,
  data: { header, stages },
}: {
  id: string;
  data: IProcessStages["data"];
}) {
  const { task: taskId } = useParams<{ task: string }>();
  const pathname = usePathname();
  const diagramVariant: DiagramVariant = pathname.includes("answer")
    ? "answer"
    : "exercise";
  const { displayMode } = useDiagramStore((state) => ({
    displayMode: state.diagrams[taskId]?.[diagramVariant].displayMode,
  }));

  const onHeaderChange = useCallback(
    (evt: any) => {
      useDiagramStore
        .getState()
        .setProcessStagesHeader(taskId, diagramVariant, id, evt.target.value);
    },
    [taskId, diagramVariant, id],
  );

  const onStageChange = useCallback(
    (stageId: number) => (evt: any) => {
      const updatedStage = { ...stages[stageId], name: evt.target.value };
      useDiagramStore
        .getState()
        .setProcessStagesStage(taskId, diagramVariant, id, updatedStage);
    },
    [taskId, diagramVariant, id, stages],
  );

  const onAddStage = useCallback(() => {
    const newStage = { id: stages.length, name: "" };
    useDiagramStore
      .getState()
      .addProcessStage(taskId, diagramVariant, newStage);
  }, [taskId, diagramVariant, stages]);

  const onRemoveStage = useCallback(
    (stageId: number) => () => {
      useDiagramStore
        .getState()
        .removeProcessStage(taskId, diagramVariant, id, stageId);
    },
    [taskId, diagramVariant, id],
  );

  if (displayMode === "edit") {
    return (
      <>
        <Handle type="target" position={Position.Top} />
        <div className="flex flex-col border border-primary-500 bg-primary-50 p-1">
          <label htmlFor="header" className="text-xs">
            Заголовок
          </label>
          <input
            id="header"
            name="header"
            value={header}
            onChange={onHeaderChange}
            className="nodrag"
          />
          <label className="mt-2 text-xs">Етапи</label>
          <div className="flex h-auto justify-between gap-2">
            <div className="flex flex-grow flex-col justify-between gap-2">
              {stages.map((stage, index) => (
                <span key={stage.id} className="text-sm">
                  {index + 1}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={stage.name}
                    onChange={onStageChange(stage.id)}
                    placeholder={`Назва етапу ${index + 1}`}
                    className="nodrag"
                  />
                  <Button
                    onClick={onRemoveStage(stage.id)}
                    size="icon"
                    variant="ghost"
                    className="size-5"
                  >
                    <Trash className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onAddStage} className="mt-2 text-xs text-blue-500">
            + Додати етап
          </button>
        </div>
        <Handle type="source" position={Position.Bottom} id="a" />
      </>
    );
  } else {
    return (
      <>
        <Handle type="target" position={Position.Top} />
        <div className="flex max-w-96 flex-col rounded-md border-2 border-blue-500 bg-blue-50 p-4 shadow-lg">
          <h1 className="text-lg font-bold text-blue-700">{header}</h1>
          {stages.map((stage, index) => (
            <p key={stage.id} className="mt-2 text-sm text-blue-600">
              {index + 1}. {stage.name}
            </p>
          ))}
        </div>
        <Handle type="source" position={Position.Bottom} id="a" />
      </>
    );
  }
}
