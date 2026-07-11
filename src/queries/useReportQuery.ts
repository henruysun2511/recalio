import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import reportService from "@/services/report.service";
import { CreateReportInput, ReportParams } from "@/schemas/report.schema";

export const REPORT_QUERY_KEY = ["reports"];

export const useReports = (params?: ReportParams) => {
    return useQuery({
        queryKey: [...REPORT_QUERY_KEY, params],
        queryFn: async () => {
            const res = await reportService.list(params);
            return res.data;
        },
    });
};

export const useCreateReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ deckId, data }: { deckId: string; data: CreateReportInput }) =>
            reportService.create(deckId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REPORT_QUERY_KEY });
        },
    });
};

