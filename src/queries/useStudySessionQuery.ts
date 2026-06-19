import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import studySessionService from "@/services/study-session.service";
import { CreateSessionInput, ReviewLogParams, SessionParams } from "@/schemas/study-session.schema";
import { handleError } from "@/utils/handleError";

export const useStudySessions = (params?: SessionParams) => {
    return useQuery({
        queryKey: ["study-sessions", params],
        queryFn: () => studySessionService.list(params),
    });
};

export const useStudySession = (id: string) => {
    return useQuery({
        queryKey: ["study-sessions", id],
        queryFn: () => studySessionService.getById(id),
        enabled: !!id,
    });
};

export const useReviewLogs = (sessionId: string, params?: ReviewLogParams) => {
    return useQuery({
        queryKey: ["study-sessions", sessionId, "review-logs", params],
        queryFn: () => studySessionService.getReviewLogs(sessionId, params),
        enabled: !!sessionId,
    });
};

export const useCreateSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSessionInput) => studySessionService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
        },
        onError: (error) => {
            handleError(error, "Failed to start session");
        },
    });
};

export const useEndSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => studySessionService.end(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
            toast.success("Session ended!");
        },
        onError: (error) => {
            handleError(error, "Failed to end session");
        },
    });
};
