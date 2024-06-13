import client from "@/client";
import { useMutation } from "@tanstack/react-query";
import type {
  ApiSaveChangesHandlerMutationRequest,
  ApiSaveChangesHandlerMutationResponse,
} from "./models";
import type { UseMutationOptions } from "@tanstack/react-query";

type ApiSaveChangesHandlerClient = typeof client<
  ApiSaveChangesHandlerMutationResponse,
  never,
  ApiSaveChangesHandlerMutationRequest
>;
type ApiSaveChangesHandler = {
  data: ApiSaveChangesHandlerMutationResponse;
  error: never;
  request: ApiSaveChangesHandlerMutationRequest;
  pathParams: never;
  queryParams: never;
  headerParams: never;
  response: ApiSaveChangesHandlerMutationResponse;
  client: {
    parameters: Partial<Parameters<ApiSaveChangesHandlerClient>[0]>;
    return: Awaited<ReturnType<ApiSaveChangesHandlerClient>>;
  };
};
/**
 * @link /api/course/lesson/exercise/save_changes
 */
export function useApiSaveChangesHandler(
  options: {
    mutation?: UseMutationOptions<
      ApiSaveChangesHandler["response"],
      ApiSaveChangesHandler["error"],
      {
        data: ApiSaveChangesHandler["request"];
      }
    >;
    client?: ApiSaveChangesHandler["client"]["parameters"];
  } = {},
) {
  const { mutation: mutationOptions, client: clientOptions = {} } =
    options ?? {};
  return useMutation({
    mutationFn: async ({ data }) => {
      const res = await client<
        ApiSaveChangesHandler["data"],
        ApiSaveChangesHandler["error"],
        ApiSaveChangesHandler["request"]
      >({
        method: "post",
        url: `/api/course/lesson/exercise/save_changes`,
        data,
        ...clientOptions,
      });
      return res.data;
    },
    ...mutationOptions,
  });
}
