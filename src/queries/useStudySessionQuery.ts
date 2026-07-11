import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import studySessionService from "@/services/study-session.service";
import { CreateSessionInput, ReviewLogParams, SessionParams } from "@/schemas/study-session.schema";

export const STUDY_SESSION_QUERY_KEY = ["study-sessions"];

export const useStudySessions = (params?: SessionParams) => {
    return useQuery({
        queryKey: [...STUDY_SESSION_QUERY_KEY, params],
        queryFn: async () => {
            const res = await studySessionService.list(params);
            return res.data;
        },
    });
};

export const useStudySession = (id: string) => {
    return useQuery({
        queryKey: [...STUDY_SESSION_QUERY_KEY, id],
        queryFn: async () => {
            const res = await studySessionService.getById(id);
            return res.data;
        },
        enabled: !!id,
    });
};

export const useReviewLogs = (sessionId: string, params?: ReviewLogParams) => {
    return useQuery({
        queryKey: [...STUDY_SESSION_QUERY_KEY, sessionId, "review-logs", params],
        queryFn: async () => {
            const res = await studySessionService.getReviewLogs(sessionId, params);
            return res.data;
        },
        enabled: !!sessionId,
    });
};

export const useCreateSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateSessionInput) => {
            const res = await studySessionService.create(data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STUDY_SESSION_QUERY_KEY });
        },
    });
};

export const useEndSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => studySessionService.end(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STUDY_SESSION_QUERY_KEY });
        },
    });
};
