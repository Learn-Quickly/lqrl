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
  MarkerType,
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

type DisplayMode = "edit" | "view" | "hidden";

type DiagramState = {
  nodes: DiagramNode[];
  edges: Edge[];
  displayMode: DisplayMode;
};

export type DiagramVariant = "answer" | "exercise" | "solution";
type RFState = {
  diagrams: {
    [taskId: string]: {
      answer: DiagramState;
      exercise: DiagramState;
      solution: DiagramState;
    };
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
  removeNode: (params: {
    taskId: string;
    diagramVariant: DiagramVariant;
    nodeId: string;
  }) => void;
  setEdges: (
    taskId: string,
    diagramVariant: DiagramVariant,
    edges: Edge[],
  ) => void;
  removeEdge: (params: {
    taskId: string;
    diagramVariant: DiagramVariant;
    edgeId: string;
  }) => void;
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
  initializeDiagram: (params: {
    taskId: string;
    defaultDisplayMode?: DisplayMode;
    initialAnswerNodes?: DiagramNode[];
    initialAnswerEdges?: Edge[];
    initialExerciseNodes?: DiagramNode[];
    initialExerciseEdges?: Edge[];
    initialSolutionNodes?: DiagramNode[];
    initialSolutionEdges?: Edge[];
  }) => void;
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
        const newEdge: Edge = {
          id: `${connection.source}-${connection.target}`,
          source: connection.source || "",
          target: connection.target || "",
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20 },
          type: "removable",
          data: {
            taskId,
            diagramVariant,
          },
        };
        if (diagram) {
          diagram[diagramVariant].edges = addEdge(
            newEdge,
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
          diagram[diagramVariant].nodes = [...nodes];
        }
        return { diagrams: { ...state.diagrams, [taskId]: diagram } };
      });
    },

    removeNode: ({ taskId, diagramVariant, nodeId }) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          // remove edges connected to the node
          diagram[diagramVariant].edges = diagram[diagramVariant].edges.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId,
          );

          diagram[diagramVariant].nodes = diagram[diagramVariant].nodes.filter(
            (node) => node.id !== nodeId,
          );
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

    removeEdge: ({ taskId, diagramVariant, edgeId }) => {
      set((state) => {
        const diagram = state.diagrams[taskId];
        if (diagram) {
          diagram[diagramVariant].edges = diagram[diagramVariant].edges.filter(
            (edge) => edge.id !== edgeId,
          );
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

    initializeDiagram: ({
      taskId,
      defaultDisplayMode = "view",
      initialAnswerNodes = [],
      initialAnswerEdges = [],
      initialExerciseNodes = [],
      initialExerciseEdges = [],
      initialSolutionNodes = [],
      initialSolutionEdges = [],
    }) => {
      set((state) => {
        if (!state.diagrams[taskId]) {
          state.diagrams[taskId] = {
            answer: {
              nodes: initialAnswerNodes,
              edges: initialAnswerEdges,
              displayMode: defaultDisplayMode,
            },
            exercise: {
              nodes: initialExerciseNodes,
              edges: initialExerciseEdges,
              displayMode: defaultDisplayMode,
            },
            solution: {
              nodes: initialSolutionNodes,
              edges: initialSolutionEdges,
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
