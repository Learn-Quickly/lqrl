import { DiagramNode } from "@/store/diagram";

export type ServerConnection = {
  from: string;
  to: string;
};
export type ServerDiagramBody = {
  connections: ServerConnection[];
  nodes: {
    id: string;
    x: number;
    y: number;
    node_type: DiagramNode["type"];
    body: DiagramNode["data"];
  }[];
};

export type ExercisePayload = {
  /**
   * @type string
   */
  description: string;
  /**
   * @type string
   */
  difficult: string;
  /**
   * @type integer, int64
   */
  exercise_id: number;
  /**
   * @type integer, int32
   */
  exercise_order: number;
  /**
   * @type string
   */
  exercise_type: string;
  /**
   * @type ServerDiagramBody
   */
  exercise_body: ServerDiagramBody;
  /**
   * @type ServerDiagramBody
   */
  answer_body: ServerDiagramBody;
  /**
   * @type integer, int64
   */
  lesson_id: number;
  /**
   * @type integer, int32
   */
  time_to_complete?: number | null;
  /**
   * @type string
   */
  title: string;
};

export type ApiGetExerciseHandlerPathParams = {
  /**
   * @description ID of the exercise
   * @type integer, int64
   */
  exercise_id: number;
};

export type ApiGetExerciseHandler200 = ExercisePayload;

export type ApiGetExerciseHandlerQueryResponse = ExercisePayload;

export type ApiGetExerciseHandlerQuery = {
  Response: ApiGetExerciseHandlerQueryResponse;
  PathParams: ApiGetExerciseHandlerPathParams;
};
