import type { Fetcher } from "swr";
import { del, get, patch, post, put } from "./base";
import type { CommonResponse } from "@/models/common";

export const login: Fetcher<
  CommonResponse & { data: string },
  { url: string; params: Record<string, any> }
> = ({ url, params }) => {
  return post(
    url,
    {
      params: {
        username: params.email,
        password: params.password,
      },
    },
    { form: true }
  ) as Promise<CommonResponse & { data: string }>;
};
