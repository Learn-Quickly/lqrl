import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "Header",
    data: { header: "Theme 1" },
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    type: "Header",
    data: { header: "Theme 2" },
  },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

type DisplayMode = "edit" | "view";

type DiagramState = {
  nodes: Node[];
  edges: Edge[];
  displayMode: DisplayMode;
};

export type DiagramVariant = "answer" | "exercise";
type RFState = {
  diagrams: { [key: string]: { answer: DiagramState; exercise: DiagramState } };
  onNodesChange: (
    taskId: string,
    diagramVariant: DiagramVariant,
    changes: NodeChange[],
  ) => void;
  onEdgesChange: (
    taskId: string,
    diagramVariant: DiagramVariant,
    changes: EdgeChange[],
  ) => void;
  onConnect: (
    taskId: string,
    diagramVariant: DiagramVariant,
    connection: Connection,
  ) => void;
  setNodes: (
    taskId: string,
    diagramVariant: DiagramVariant,
    nodes: Node[],
  ) => void;
  setEdges: (
    taskId: string,
    diagramVariant: DiagramVariant,
    edges: Edge[],
  ) => void;
  setDisplayMode: (
    taskId: string,
    diagramVariant: DiagramVariant,
    mode: DisplayMode,
  ) => void;
  setHeaderTitle: (
    taskId: string,
    diagramVariant: DiagramVariant,
    id: string,
    title: string,
  ) => void;
  initializeDiagram: (taskId: string, defaultDisplayMode?: DisplayMode) => void;
};

export const useDiagramStore = createWithEqualityFn<RFState>(
  (set, get) => ({
    diagrams: {},

    onNodesChange: (
      taskId: string,
      diagramVariant: DiagramVariant,
      changes: NodeChange[],
    ) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].nodes = applyNodeChanges(
            changes,
            diagram[diagramVariant].nodes,
          );
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    onEdgesChange: (
      taskId: string,
      diagramVariant: DiagramVariant,
      changes: EdgeChange[],
    ) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].edges = applyEdgeChanges(
            changes,
            diagram[diagramVariant].edges,
          );
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    onConnect: (
      taskId: string,
      diagramVariant: DiagramVariant,
      connection: Connection,
    ) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].edges = addEdge(
            connection,
            diagram[diagramVariant].edges,
          );
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    setNodes: (
      taskId: string,
      diagramVariant: DiagramVariant,
      nodes: Node[],
    ) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].nodes = [
            ...diagram[diagramVariant].nodes,
            ...nodes,
          ];
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    setEdges: (
      taskId: string,
      diagramVariant: DiagramVariant,
      edges: Edge[],
    ) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].edges = edges;
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    setDisplayMode: (
      taskId: string,
      diagramVariant: DiagramVariant,
      mode: DisplayMode,
    ) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].displayMode = mode;
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    setHeaderTitle: (
      taskId: string,
      diagramVariant: DiagramVariant,
      id: string,
      title: string,
    ) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].nodes = diagram[diagramVariant].nodes.map(
            (node) =>
              node.id === id && node.type === "Header"
                ? { ...node, data: { ...node.data, header: title } }
                : node,
          );
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    initializeDiagram: (
      taskId: string,
      defaultDisplayMode: DisplayMode = "view",
    ) => {
      set((state) => {
        if (!state.diagrams[taskId]) {
          state.diagrams[taskId] = {
            answer: {
              nodes: initialNodes,
              edges: initialEdges,
              displayMode: defaultDisplayMode,
            },
            exercise: {
              nodes: initialNodes,
              edges: initialEdges,
              displayMode: defaultDisplayMode,
            },
          };
        }
        return {
          diagrams: { ...state.diagrams, [taskId]: state.diagrams[taskId] },
        };
      });
    },
  }),
  shallow,
);
