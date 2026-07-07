import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { CreateSessionInput, ReviewLog, ReviewLogParams, SessionParams, StudySession } from "@/schemas/study-session.schema";
import { Pagination } from "@/constants/pagination";

const prefix = "/study-sessions";

const studySessionService = {
    create: (data: CreateSessionInput) => {
        return http.post<ApiResponse<StudySession>>(prefix, data);
    },

    end: (id: string) => {
        return http.patch<ApiResponse<StudySession>>(`${prefix}/${id}/end`);
    },

    list: (params?: SessionParams) => {
        return http.get<ApiResponse<StudySession[]> & { meta?: Pagination }>(prefix, { params });
    },

    getById: (id: string) => {
        return http.get<ApiResponse<StudySession>>(`${prefix}/${id}`);
    },

    getReviewLogs: (id: string, params?: ReviewLogParams) => {
        return http.get<ApiResponse<ReviewLog[]> & { meta?: Pagination }>(`${prefix}/${id}/review-logs`, { params });
    },
};

export default studySessionService;
