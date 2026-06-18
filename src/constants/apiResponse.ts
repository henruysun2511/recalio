import { Pagination } from "./pagination";

interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: Pagination;
}

export type { ApiResponse };
