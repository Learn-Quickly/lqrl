import { useCallback } from "react";
import {
  DiagramVariant,
  IDefinitionNode,
  useDiagramStore,
} from "@/store/diagram";
import { useParams, usePathname } from "next/navigation";
import { Handle, Position } from "reactflow";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export function DefinitionNode({
  id,
  data: { header, definition },
}: {
  id: string;
  data: IDefinitionNode["data"];
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
        .setDefinitionTitle(taskId, diagramVariant, id, evt.target.value);
    },
    [taskId, diagramVariant, id],
  );

  const onDefinitionChange = useCallback(
    (evt: any) => {
      useDiagramStore
        .getState()
        .setDefinitionText(taskId, diagramVariant, id, evt.target.value);
    },
    [taskId, diagramVariant, id],
  );

  const { removeNode } = useDiagramStore.getState();
  function handleRemoveNode() {
    removeNode({
      taskId,
      diagramVariant,
      nodeId: id,
    });
  }

  return (
    <>
      <Handle type="target" position={Position.Top} />
      {displayMode == "edit" ? (
        <div className="flex flex-col border border-primary-500 bg-primary-50 p-1">
          <div className="flex justify-between">
            <label htmlFor="text" className="text-xs">
              Заголовок
            </label>
            {diagramVariant == "answer" && (
              <Button
                variant="ghost"
                className="size-fit p-1.5"
                onClick={handleRemoveNode}
              >
                <Trash size={10} />
              </Button>
            )}
          </div>
          <input
            id="text"
            name="text"
            value={header}
            onChange={onHeaderChange}
            className="nodrag"
          />
          <label htmlFor="definition" className="text-xs">
            Визначення
          </label>
          <textarea
            id="definition"
            name="definition"
            value={definition}
            onChange={onDefinitionChange}
            className="nodrag"
          />
        </div>
      ) : (
        <div className="flex max-w-96 flex-col rounded-md border-2 border-green-500 bg-green-50 p-4 shadow-lg">
          <h1 className="text-lg font-bold text-green-700">{header}</h1>
          <p className="mt-2 text-sm text-green-600">{definition}</p>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
