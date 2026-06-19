import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import reportService from "@/services/report.service";
import { CreateReportInput, ReportParams, UpdateReportStatusInput } from "@/schemas/report.schema";
import { handleError } from "@/utils/handleError";

export const useReports = (params?: ReportParams) => {
    return useQuery({
        queryKey: ["reports", params],
        queryFn: () => reportService.list(params),
    });
};

export const useCreateReport = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ deckId, data }: { deckId: string; data: CreateReportInput }) =>
            reportService.create(deckId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports"] });
            toast.success("Report submitted!");
        },
        onError: (error) => {
            handleError(error, "Failed to submit report");
        },
    });
};

export const useUpdateReportStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateReportStatusInput }) =>
            reportService.updateStatus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reports"] });
            toast.success("Report status updated!");
        },
        onError: (error) => {
            handleError(error, "Failed to update report status");
        },
    });
};
