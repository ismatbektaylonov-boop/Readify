import "express-session";
import { Member } from "./member";

declare module "express-session" {
  interface SessionData {
    member?: Member | null;
  }
}

export interface PageRequest {
  page: number;
  limit: number;
}

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
