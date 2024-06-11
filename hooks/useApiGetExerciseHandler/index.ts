import client from "@/client";
import {
  useQuery,
  queryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type {
  ApiGetExerciseHandlerQueryResponse,
  ApiGetExerciseHandlerPathParams,
} from "./models";
import type {
  QueryObserverOptions,
  UseQueryResult,
  QueryKey,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";

type ApiGetExerciseHandlerClient = typeof client<
  ApiGetExerciseHandlerQueryResponse,
  never,
  never
>;
type ApiGetExerciseHandler = {
  data: ApiGetExerciseHandlerQueryResponse;
  error: never;
  request: never;
  pathParams: ApiGetExerciseHandlerPathParams;
  queryParams: never;
  headerParams: never;
  response: ApiGetExerciseHandlerQueryResponse;
  client: {
    parameters: Partial<Parameters<ApiGetExerciseHandlerClient>[0]>;
    return: Awaited<ReturnType<ApiGetExerciseHandlerClient>>;
  };
};
export const apiGetExerciseHandlerQueryKey = (
  exerciseId: ApiGetExerciseHandlerPathParams["exercise_id"],
) =>
  [
    {
      url: "/api/course/lesson/exercise/get_exercise/:exercise_id",
      params: { exerciseId: exerciseId },
    },
  ] as const;
export type ApiGetExerciseHandlerQueryKey = ReturnType<
  typeof apiGetExerciseHandlerQueryKey
>;
export function apiGetExerciseHandlerQueryOptions(
  exerciseId: ApiGetExerciseHandlerPathParams["exercise_id"],
  options: ApiGetExerciseHandler["client"]["parameters"] = {},
) {
  const queryKey = apiGetExerciseHandlerQueryKey(exerciseId);
  return queryOptions({
    queryKey,
    queryFn: async () => {
      const res = await client<
        ApiGetExerciseHandler["data"],
        ApiGetExerciseHandler["error"]
      >({
        method: "get",
        url: `/api/course/lesson/exercise/get_exercise/${exerciseId}`,
        ...options,
      });
      return res.data;
    },
  });
}
/**
 * @link /api/course/lesson/exercise/get_exercise/:exercise_id
 */
export function useApiGetExerciseHandler<
  TData = ApiGetExerciseHandler["response"],
  TQueryData = ApiGetExerciseHandler["response"],
  TQueryKey extends QueryKey = ApiGetExerciseHandlerQueryKey,
>(
  exerciseId: ApiGetExerciseHandlerPathParams["exercise_id"],
  options: {
    query?: Partial<
      QueryObserverOptions<
        ApiGetExerciseHandler["response"],
        ApiGetExerciseHandler["error"],
        TData,
        TQueryData,
        TQueryKey
      >
    >;
    client?: ApiGetExerciseHandler["client"]["parameters"];
  } = {},
): UseQueryResult<TData, ApiGetExerciseHandler["error"]> & {
  queryKey: TQueryKey;
} {
  const { query: queryOptions, client: clientOptions = {} } = options ?? {};
  const queryKey =
    queryOptions?.queryKey ?? apiGetExerciseHandlerQueryKey(exerciseId);
  const query = useQuery({
    ...(apiGetExerciseHandlerQueryOptions(
      exerciseId,
      clientOptions,
    ) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">),
  }) as UseQueryResult<TData, ApiGetExerciseHandler["error"]> & {
    queryKey: TQueryKey;
  };
  query.queryKey = queryKey as TQueryKey;
  return query;
}
export const apiGetExerciseHandlerSuspenseQueryKey = (
  exerciseId: ApiGetExerciseHandlerPathParams["exercise_id"],
) =>
  [
    {
      url: "/api/course/lesson/exercise/get_exercise/:exercise_id",
      params: { exerciseId: exerciseId },
    },
  ] as const;
export type ApiGetExerciseHandlerSuspenseQueryKey = ReturnType<
  typeof apiGetExerciseHandlerSuspenseQueryKey
>;
export function apiGetExerciseHandlerSuspenseQueryOptions(
  exerciseId: ApiGetExerciseHandlerPathParams["exercise_id"],
  options: ApiGetExerciseHandler["client"]["parameters"] = {},
) {
  const queryKey = apiGetExerciseHandlerSuspenseQueryKey(exerciseId);
  return queryOptions({
    queryKey,
    queryFn: async () => {
      const res = await client<
        ApiGetExerciseHandler["data"],
        ApiGetExerciseHandler["error"]
      >({
        method: "get",
        url: `/api/course/lesson/exercise/get_exercise/${exerciseId}`,
        ...options,
      });
      return res.data;
    },
  });
}
/**
 * @link /api/course/lesson/exercise/get_exercise/:exercise_id
 */
export function useApiGetExerciseHandlerSuspense<
  TData = ApiGetExerciseHandler["response"],
  TQueryKey extends QueryKey = ApiGetExerciseHandlerSuspenseQueryKey,
>(
  exerciseId: ApiGetExerciseHandlerPathParams["exercise_id"],
  options: {
    query?: Partial<
      UseSuspenseQueryOptions<
        ApiGetExerciseHandler["response"],
        ApiGetExerciseHandler["error"],
        TData,
        TQueryKey
      >
    >;
    client?: ApiGetExerciseHandler["client"]["parameters"];
  } = {},
): UseSuspenseQueryResult<TData, ApiGetExerciseHandler["error"]> & {
  queryKey: TQueryKey;
} {
  const { query: queryOptions, client: clientOptions = {} } = options ?? {};
  const queryKey =
    queryOptions?.queryKey ?? apiGetExerciseHandlerSuspenseQueryKey(exerciseId);
  const query = useSuspenseQuery({
    ...(apiGetExerciseHandlerSuspenseQueryOptions(
      exerciseId,
      clientOptions,
    ) as unknown as QueryObserverOptions),
    queryKey,
    ...(queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">),
  }) as UseSuspenseQueryResult<TData, ApiGetExerciseHandler["error"]> & {
    queryKey: TQueryKey;
  };
  query.queryKey = queryKey as TQueryKey;
  return query;
}
