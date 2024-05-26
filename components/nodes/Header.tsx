import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { useDiagramStore } from "@/store/diagram";
import { useParams } from "next/navigation";

let count = 1;
export function HeaderNode({ id, data }: { id: string; data: {} }) {
  const { task: taskId } = useParams<{ task: string }>();
  const { nodes, edges } = useDiagramStore((state) => state.diagrams[taskId]);
  const { displayMode } = useDiagramStore((state) => ({
    displayMode: state.diagrams[taskId]?.displayMode,
  }));
  const onChange = useCallback(
    (evt: any) => {
      useDiagramStore.getState().setHeaderTitle(taskId, id, evt.target.value);
    },
    [taskId, id],
  );
  const title = nodes.find((n) => n.id === id)?.data.label;
  count++;

  if (displayMode === "edit") {
    return (
      <>
        <Handle type="target" position={Position.Top} />
        <div className="flex flex-col border border-stone-500 bg-stone-50 p-1">
          <label htmlFor="text" className="text-xs">
            Header {count}
          </label>
          <input
            id="text"
            name="text"
            value={title}
            onChange={onChange}
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
        <div className="flex flex-col border border-stone-500 bg-stone-50 p-1">
          <h1>{title}</h1>
        </div>
        <Handle type="source" position={Position.Bottom} id="a" />
      </>
    );
  }
}
