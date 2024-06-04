import client from "@/client";
import { useMutation } from "@tanstack/react-query";
import type {
  ApiCreateExerciseHandlerMutationRequest,
  ApiCreateExerciseHandlerMutationResponse,
} from "./models";
import type { UseMutationOptions } from "@tanstack/react-query";

type ApiCreateExerciseHandlerClient = typeof client<
  ApiCreateExerciseHandlerMutationResponse,
  never,
  ApiCreateExerciseHandlerMutationRequest
>;
type ApiCreateExerciseHandler = {
  data: ApiCreateExerciseHandlerMutationResponse;
  error: never;
  request: ApiCreateExerciseHandlerMutationRequest;
  pathParams: never;
  queryParams: never;
  headerParams: never;
  response: ApiCreateExerciseHandlerMutationResponse;
  client: {
    parameters: Partial<Parameters<ApiCreateExerciseHandlerClient>[0]>;
    return: Awaited<ReturnType<ApiCreateExerciseHandlerClient>>;
  };
};
/**
 * @link /api/course/lesson/exercise/create
 */
export function useApiCreateExerciseHandler(
  options: {
    mutation?: UseMutationOptions<
      ApiCreateExerciseHandler["response"],
      ApiCreateExerciseHandler["error"],
      {
        data: ApiCreateExerciseHandler["request"];
      }
    >;
    client?: ApiCreateExerciseHandler["client"]["parameters"];
  } = {},
) {
  const { mutation: mutationOptions, client: clientOptions = {} } =
    options ?? {};
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await client<
        ApiCreateExerciseHandler["data"],
        ApiCreateExerciseHandler["error"],
        ApiCreateExerciseHandler["request"]
      >({
        method: "post",
        url: `/api/course/lesson/exercise/create`,
        data,
        ...clientOptions,
      });
      return res.data;
    },
    ...mutationOptions,
  });
}
