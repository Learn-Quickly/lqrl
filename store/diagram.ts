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

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Theme 1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "Theme 2" } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

type DisplayMode = "edit" | "view";

type DiagramState = {
  nodes: Node[];
  edges: Edge[];
  displayMode: DisplayMode;
};

type RFState = {
  diagrams: { [key: string]: DiagramState };
  onNodesChange: (taskId: string, changes: NodeChange[]) => void;
  onEdgesChange: (taskId: string, changes: EdgeChange[]) => void;
  onConnect: (taskId: string, connection: Connection) => void;
  setNodes: (taskId: string, nodes: Node[]) => void;
  setEdges: (taskId: string, edges: Edge[]) => void;
  setDisplayMode: (taskId: string, mode: DisplayMode) => void;
  setHeaderTitle: (taskId: string, id: string, title: string) => void;
  initializeDiagram: (taskId: string, defaultDisplayMode?: DisplayMode) => void;
};

export const useDiagramStore = createWithEqualityFn<RFState>(
  (set, get) => ({
    diagrams: {},

    onNodesChange: (taskId: string, changes: NodeChange[]) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram.nodes = applyNodeChanges(changes, diagram.nodes);
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    onEdgesChange: (taskId: string, changes: EdgeChange[]) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram.edges = applyEdgeChanges(changes, diagram.edges);
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    onConnect: (taskId: string, connection: Connection) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram.edges = addEdge(connection, diagram.edges);
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    setNodes: (taskId: string, nodes: Node[]) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram.nodes = [...diagram.nodes, ...nodes];
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    setEdges: (taskId: string, edges: Edge[]) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram.edges = edges;
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    setDisplayMode: (taskId: string, mode: DisplayMode) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram.displayMode = mode;
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    setHeaderTitle: (taskId: string, id: string, title: string) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram.nodes = diagram.nodes.map((node) =>
            node.id === id && node.type === "Header"
              ? { ...node, data: { ...node.data, label: title } }
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
            nodes: initialNodes,
            edges: initialEdges,
            displayMode: defaultDisplayMode,
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
