import { ServerDiagramBody } from "@/hooks/useApiGetExerciseHandler/models";

export type ExerciseCompletionForSaveChanges = {
  /**
   * @type integer, int64
   */
  exercise_completion_id: number;

  body: ServerDiagramBody;
};

/**
 * @description Exercise changes saved successfully
 */
export type ApiSaveChangesHandler200 = any;

export type ApiSaveChangesHandlerMutationRequest =
  ExerciseCompletionForSaveChanges;

export type ApiSaveChangesHandlerMutationResponse = any;

export type ApiSaveChangesHandlerMutation = {
  Response: ApiSaveChangesHandlerMutationResponse;
  Request: ApiSaveChangesHandlerMutationRequest;
};
