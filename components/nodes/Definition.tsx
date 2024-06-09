import { useCallback } from "react";
import {
  DiagramVariant,
  IDefinitionNode,
  useDiagramStore,
} from "@/store/diagram";
import { useParams, usePathname } from "next/navigation";
import { Handle, Position } from "reactflow";

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

  if (displayMode === "edit") {
    return (
      <>
        <Handle type="target" position={Position.Top} />
        <div className="flex flex-col border border-primary-500 bg-primary-50 p-1">
          <label htmlFor="text" className="text-xs">
            Заголовок
          </label>
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
        <Handle type="source" position={Position.Bottom} id="a" />
      </>
    );
  } else {
    return (
      <>
        <Handle type="target" position={Position.Top} />
        <div className="flex max-w-96 flex-col rounded-md border-2 border-green-500 bg-green-50 p-4 shadow-lg">
          <h1 className="text-lg font-bold text-green-700">{header}</h1>
          <p className="mt-2 text-sm text-green-600">{definition}</p>
        </div>
        <Handle type="source" position={Position.Bottom} id="a" />
      </>
    );
  }
}
