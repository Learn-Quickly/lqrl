import { ExerciseCreatedPayload } from "@/dist/kubb";
export type ExerciseCreatePayload = {
  /**
   * @type string
   */
  description: string;
  /**
   * @type string
   */
  difficult: string;
  /**
   * @type string
   */
  exercise_type: string;
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
  /**
   * @type string
   */
  exercise_body: string | Object;
  /**
   * @type string
   */
  answer_body: string | Object;
};

/**
 * @description Exercise created successfully
 */
export type ApiCreateExerciseHandler200 = ExerciseCreatedPayload;

export type ApiCreateExerciseHandlerMutationRequest = ExerciseCreatePayload;

/**
 * @description Exercise created successfully
 */
export type ApiCreateExerciseHandlerMutationResponse = ExerciseCreatedPayload;

export type ApiCreateExerciseHandlerMutation = {
  Response: ApiCreateExerciseHandlerMutationResponse;
  Request: ApiCreateExerciseHandlerMutationRequest;
};
