"use client";

import axios from "axios";

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { authStoreKey } from "@/constants";

export const AXIOS_BASE = "http://localhost:8080";

const accessToken =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem(authStoreKey) ?? "{}")?.state?.accessToken
    : null;
const refreshToken =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem(authStoreKey) ?? "{}")?.state
        ?.refreshToken
    : null;
const AXIOS_HEADERS: AxiosRequestConfig["headers"] | undefined =
  accessToken && refreshToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : undefined;

/**
 * Subset of AxiosRequestConfig
 */
export type RequestConfig<TData = unknown> = {
  url?: string;
  method: "get" | "put" | "patch" | "post" | "delete";
  params?: object;
  data?: TData;
  responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";
  signal?: AbortSignal;
  headers?: AxiosRequestConfig["headers"];
};
/**
 * Subset of AxiosResponse
 */
export type ResponseConfig<TData = unknown> = {
  data: TData;
  status: number;
  statusText: string;
  headers?: AxiosResponse["headers"];
};

export const axiosInstance = axios.create({
  baseURL: typeof AXIOS_BASE !== "undefined" ? AXIOS_BASE : undefined,
  headers: AXIOS_HEADERS,
});

export const axiosClient = async <
  TData,
  TError = unknown,
  TVariables = unknown,
>(
  config: RequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
  const promise = axiosInstance
    .request<TVariables, ResponseConfig<TData>>({ ...config })
    .catch((e: AxiosError<TError>) => {
      throw e;
    });

  return promise;
};

export default axiosClient;
