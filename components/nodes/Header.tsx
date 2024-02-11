import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import { getFlowStore } from "@/store";
import { useParams } from "next/navigation";

export function HeaderNode({ id, data }: { id: string; data: {} }) {
  const { task: taskId } = useParams<{ task: string }>();
  const useFlowStore = getFlowStore({ taskId });
  const { setHeaderTitle, displayMode } = useFlowStore();
  const onChange = useCallback((evt: any) => {
    setHeaderTitle(id, evt.target.value);
  }, []);
  const title = useFlowStore(
    (state) => state.nodes.find((n) => n.id === id)?.data.label,
  );

  if (displayMode === "edit") {
    return (
      <>
        <Handle type="target" position={Position.Top} />
        <div className="flex flex-col border border-stone-500 bg-stone-50 p-1">
          <label htmlFor="text" className="text-sm">
            Header
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
