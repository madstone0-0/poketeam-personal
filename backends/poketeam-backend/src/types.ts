import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface ServiceReturn<Data = any> {
    status: ContentfulStatusCode;
    message?: string;
    data?: Data;
    extra?: any;
}

export type PromiseReturn<Data = any> = Promise<ServiceReturn<Data>>;
