import type { Fetcher } from "swr";
import { del, get, patch, post, put } from "./base";
import type { LoginResponse } from "@/models/common";

export const login: Fetcher<
  LoginResponse,
  { url: string; body: Record<string, any> }
> = ({ url, body }) => {
  return post(url, { body }) as Promise<LoginResponse>;
};
