import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { DiagramVariant, IHeaderNode, useDiagramStore } from "@/store/diagram";
import { useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export function HeaderNode({
  id,
  data: { header: title },
}: {
  id: string;
  data: IHeaderNode["data"];
}) {
  const { task: taskId } = useParams<{ task: string }>();
  const pathname = usePathname();
  const diagramVariant: DiagramVariant = pathname.includes("answer")
    ? "answer"
    : "exercise";
  const { displayMode } = useDiagramStore((state) => ({
    displayMode: state.diagrams[taskId]?.[diagramVariant].displayMode,
  }));
  const onChange = useCallback(
    (evt: any) => {
      useDiagramStore
        .getState()
        .setHeaderTitle(taskId, diagramVariant, id, evt.target.value);
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
            value={title}
            onChange={onChange}
            className="nodrag"
          />
        </div>
      ) : (
        <div className="flex max-w-96 flex-col rounded-md border-2 border-amber-500 bg-amber-50 p-4 shadow-lg">
          <h1 className="text-2xl font-bold text-amber-700">{title}</h1>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
