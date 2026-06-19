import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { CreateSessionInput, ReviewLog, ReviewLogParams, SessionParams, StudySession } from "@/schemas/study-session.schema";
import { Pagination } from "@/constants/pagination";

const studySessionService = {
    create: (data: CreateSessionInput) => {
        return http.post<ApiResponse<StudySession>>("/study-sessions", data);
    },

    end: (id: string) => {
        return http.patch<ApiResponse<StudySession>>(`/study-sessions/${id}/end`);
    },

    list: (params?: SessionParams) => {
        return http.get<ApiResponse<StudySession[]> & { meta?: Pagination }>("/study-sessions", { params });
    },

    getById: (id: string) => {
        return http.get<ApiResponse<StudySession>>(`/study-sessions/${id}`);
    },

    getReviewLogs: (id: string, params?: ReviewLogParams) => {
        return http.get<ApiResponse<ReviewLog[]> & { meta?: Pagination }>(`/study-sessions/${id}/review-logs`, { params });
    },
};

export default studySessionService;
