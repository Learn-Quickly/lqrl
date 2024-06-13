import { DiagramNode, DiagramVariant } from "@/store/diagram";
import { Edge, MarkerType } from "reactflow";
import { ServerDiagramBody } from "@/hooks/useApiGetExerciseHandler/models";

export function storeDiagramToRequestDiagram({
  nodes,
  edges,
}: {
  nodes: DiagramNode[];
  edges: Edge[];
}): ServerDiagramBody {
  return {
    connections: edges.map(({ source, target }) => ({
      from: source,
      to: target,
    })),
    nodes: nodes.map(({ id, position: { x, y }, type, data }) => ({
      id,
      x: Math.round(x),
      y: Math.round(y),
      node_type: type,
      body: data,
    })),
  };
}

export function serverConnectionsToEdges({
  taskId,
  diagramVariant,
  connections,
}: {
  taskId: string;
  diagramVariant: DiagramVariant;
  connections: ServerDiagramBody["connections"];
}): Edge[] {
  return connections.map(({ from, to }) => ({
    id: `${from}-${to}`,
    source: from,
    target: to,
    type: diagramVariant != "solution" ? "removable" : undefined,
    markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
    data: { taskId, diagramVariant },
  }));
}

export function serverNodesToNodes(
  nodes: ServerDiagramBody["nodes"],
): DiagramNode[] {
  // @ts-ignore
  return nodes.map(({ id, x, y, node_type, body }) => ({
    id,
    position: { x, y },
    type: node_type,
    data: body,
  }));
}
