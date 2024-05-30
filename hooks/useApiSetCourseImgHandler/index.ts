import client from "@/client";
import { useMutation } from "@tanstack/react-query";
import type {
  ApiSetCourseImgHandlerMutationRequest,
  ApiSetCourseImgHandlerMutationResponse,
  ApiSetCourseImgHandlerPathParams,
} from "./models";
import type { UseMutationOptions } from "@tanstack/react-query";

type ApiSetCourseImgHandlerClient = typeof client<
  ApiSetCourseImgHandlerMutationResponse,
  never,
  ApiSetCourseImgHandlerMutationRequest
>;
type ApiSetCourseImgHandler = {
  data: ApiSetCourseImgHandlerMutationResponse;
  error: never;
  request: ApiSetCourseImgHandlerMutationRequest;
  pathParams: ApiSetCourseImgHandlerPathParams;
  queryParams: never;
  headerParams: never;
  response: ApiSetCourseImgHandlerMutationResponse;
  client: {
    parameters: Partial<Parameters<ApiSetCourseImgHandlerClient>[0]>;
    return: Awaited<ReturnType<ApiSetCourseImgHandlerClient>>;
  };
};
/**
 * @link /api/course/set_course_img/:course_id
 */
export function useApiSetCourseImgHandler(
  options: {
    mutation?: UseMutationOptions<
      ApiSetCourseImgHandler["response"],
      ApiSetCourseImgHandler["error"],
      {
        courseId: ApiSetCourseImgHandlerPathParams["course_id"];
        data?: ApiSetCourseImgHandler["request"];
      }
    >;
    client?: ApiSetCourseImgHandler["client"]["parameters"];
  } = {},
) {
  const { mutation: mutationOptions, client: clientOptions = {} } =
    options ?? {};
  return useMutation({
    mutationFn: async ({ courseId, data }) => {
      const res = await client<
        ApiSetCourseImgHandler["data"],
        ApiSetCourseImgHandler["error"],
        ApiSetCourseImgHandler["request"]
      >({
        method: "put",
        url: `/api/course/set_course_img/${courseId}`,
        data,
        ...clientOptions,
      });
      return res.data;
    },
    ...mutationOptions,
  });
}
