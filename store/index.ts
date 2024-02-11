import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "Theme 1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "Theme 2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

type DisplayMode = "edit" | "view";
export type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  setHeaderTitle: (id: string, title: string) => void;
};

type CreateStore = {
  taskId: string;
  defaultDisplayMode?: DisplayMode;
};

export const createStore = ({
  taskId,
  defaultDisplayMode = "view",
}: CreateStore) =>
  create<RFState>((set, get) => ({
    taskId,
    nodes: initialNodes,
    edges: initialEdges,
    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection: Connection) => {
      set({
        edges: addEdge(connection, get().edges),
      });
    },
    setNodes: (nodes: Node[]) => {
      set((prev: RFState) => ({ nodes: [...prev.nodes, ...nodes] }));
    },
    setEdges: (edges: Edge[]) => {
      set({ edges });
    },
    displayMode: defaultDisplayMode,
    setDisplayMode: (mode: DisplayMode) => {
      set({ displayMode: mode });
    },
    setHeaderTitle: (id: string, title: string) => {
      set((prev) => ({
        nodes: prev.nodes.map((node) =>
          node.id === id && node.type == "Header"
            ? { ...node, data: { ...node.data, label: title } }
            : node,
        ),
      }));
    },
  }));

const stores: {
  [key: string]: ReturnType<typeof createStore>;
} = {};

export const getFlowStore = ({ taskId, defaultDisplayMode }: CreateStore) => {
  if (!stores[taskId]) {
    stores[taskId] = createStore({ taskId, defaultDisplayMode });
  }
  return stores[taskId];
};
