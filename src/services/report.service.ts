import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { CreateReportInput, Report, ReportParams, UpdateReportStatusInput } from "@/schemas/report.schema";
import { Pagination } from "@/constants/pagination";

const prefix = "/reports";

const reportService = {
    create: (deckId: string, data: CreateReportInput) => {
        return http.post<ApiResponse<Report>>(`${prefix}/decks/${deckId}`, data);
    },

    list: (params?: ReportParams) => {
        return http.get<ApiResponse<Report[]> & { meta?: Pagination }>(prefix, { params });
    },

    updateStatus: (id: string, data: UpdateReportStatusInput) => {
        return http.patch<ApiResponse<Report>>(`${prefix}/${id}/status`, data);
    },
};

export default reportService;
