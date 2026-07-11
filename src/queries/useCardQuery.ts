import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cardService from "@/services/card.service";
import { CardParams, DueCardsParams, ReviewCardInput } from "@/schemas/card.schema";
import { STUDY_SESSION_QUERY_KEY } from "@/queries/useStudySessionQuery";

export const CARD_QUERY_KEY = ["cards"];

export const useCardsByDeck = (deckId: string, params?: CardParams) => {
    return useQuery({
        queryKey: [...CARD_QUERY_KEY, deckId, params],
        queryFn: async () => {
            const res = await cardService.listByDeck(deckId, params);
            return res.data;
        },
        enabled: !!deckId,
    });
};

export const useDueCards = (params?: DueCardsParams) => {
    return useQuery({
        queryKey: [...CARD_QUERY_KEY, "due", params],
        queryFn: async () => {
            const res = await cardService.getDue(params);
            return res.data;
        },
    });
};

export const useCardStats = (userId?: string, deckId?: string) => {
    const params = userId ? { userId, ...(deckId ? { deckId } : {}) } : deckId;
    return useQuery({
        queryKey: [...CARD_QUERY_KEY, "stats", params],
        queryFn: async () => {
            const res = await cardService.getStats(params);
            return res.data;
        },
    });
};

export const useCard = (id: string) => {
    return useQuery({
        queryKey: [...CARD_QUERY_KEY, id],
        queryFn: async () => {
            const res = await cardService.getById(id);
            return res.data;
        },
        enabled: !!id,
    });
};

export const useReviewCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ReviewCardInput }) => cardService.review(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: STUDY_SESSION_QUERY_KEY });
        },
    });
};

export const useSuspendCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => cardService.toggleSuspend(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEY });
        },
    });
};

export const useBuryCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => cardService.bury(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEY });
        },
    });
};
