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

export interface IHeaderNode extends Node {
  type: "Header";
  data: { header: string };
}

export interface IDefinitionNode extends Node {
  type: "Definition";
  data: { header: string; definition: string };
}

type ProcessStage = { id: number; name: string };
export interface IProcessStages extends Node {
  type: "ProcessStages";
  data: { header: string; stages: ProcessStage[] };
}

export type DiagramNode = IHeaderNode | IDefinitionNode | IProcessStages;

const initialNodes: DiagramNode[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "Header",
    data: { header: "Theme of the conspect" },
  },
  {
    id: "2",
    position: { x: 80, y: 100 },
    type: "Definition",
    data: { header: "Definition", definition: "Definition text" },
  },
  {
    id: "3",
    position: { x: 60, y: 230 },
    type: "ProcessStages",
    data: { header: "Process stages", stages: [{ id: 0, name: "Stage 1" }] },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
];

type DisplayMode = "edit" | "view";

type DiagramState = {
  nodes: DiagramNode[];
  edges: Edge[];
  displayMode: DisplayMode;
};

export type DiagramVariant = "answer" | "exercise";
type RFState = {
  diagrams: {
    [taskId: string]: { answer: DiagramState; exercise: DiagramState };
  };
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
    nodes: DiagramNode[],
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
  setDefinitionTitle: (
    taskId: string,
    diagramVariant: DiagramVariant,
    id: string,
    title: string,
  ) => void;
  setDefinitionText: (
    taskId: string,
    diagramVariant: DiagramVariant,
    id: string,
    text: string,
  ) => void;
  setProcessStagesHeader: (
    taskId: string,
    diagramVariant: DiagramVariant,
    id: string,
    title: string,
  ) => void;
  addProcessStage: (
    taskId: string,
    diagramVariant: DiagramVariant,
    stage: ProcessStage,
  ) => void;
  setProcessStagesStage: (
    taskId: string,
    diagramVariant: DiagramVariant,
    id: string,
    stage: ProcessStage,
  ) => void;
  removeProcessStage: (
    taskId: string,
    diagramVariant: DiagramVariant,
    id: string,
    stageId: number,
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
          // @ts-ignore
          diagram[diagramVariant].nodes = applyNodeChanges<DiagramNode["data"]>(
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
      nodes: DiagramNode[],
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

    setDefinitionTitle: (
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
              node.id === id && node.type === "Definition"
                ? { ...node, data: { ...node.data, header: title } }
                : node,
          );
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    setDefinitionText: (
      taskId: string,
      diagramVariant: DiagramVariant,
      id: string,
      text: string,
    ) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].nodes = diagram[diagramVariant].nodes.map(
            (node) =>
              node.id === id && node.type === "Definition"
                ? { ...node, data: { ...node.data, definition: text } }
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

    setProcessStagesHeader: (
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
              node.id === id && node.type === "ProcessStages"
                ? { ...node, data: { ...node.data, header: title } }
                : node,
          );
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    addProcessStage: (
      taskId: string,
      diagramVariant: DiagramVariant,
      stage: ProcessStage,
    ) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].nodes = diagram[diagramVariant].nodes.map(
            (node) =>
              node.type === "ProcessStages"
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      stages: [...node.data.stages, stage],
                    },
                  }
                : node,
          );
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    setProcessStagesStage: (
      taskId: string,
      diagramVariant: DiagramVariant,
      id: string,
      stage: ProcessStage,
    ) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].nodes = diagram[diagramVariant].nodes.map(
            (node) =>
              node.id === id && node.type === "ProcessStages"
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      stages: node.data.stages.map((s) =>
                        s.id === stage.id ? stage : s,
                      ),
                    },
                  }
                : node,
          );
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    removeProcessStage: (
      taskId: string,
      diagramVariant: DiagramVariant,
      id: string,
      stageId: number,
    ) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].nodes = diagram[diagramVariant].nodes.map(
            (node) =>
              node.id === id && node.type === "ProcessStages"
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      stages: node.data.stages.filter((s) => s.id !== stageId),
                    },
                  }
                : node,
          );
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },
  }),
  shallow,
);
