import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import cardService from "@/services/card.service";
import { CardParams, DueCardsParams, ReviewCardInput } from "@/schemas/card.schema";
import { handleError } from "@/utils/handleError";

export const useCardsByDeck = (deckId: string, params?: CardParams) => {
    return useQuery({
        queryKey: ["cards", deckId, params],
        queryFn: () => cardService.listByDeck(deckId, params),
        enabled: !!deckId,
    });
};

export const useDueCards = (params?: DueCardsParams) => {
    return useQuery({
        queryKey: ["cards", "due", params],
        queryFn: () => cardService.getDue(params),
    });
};

export const useCardStats = (deckId?: string) => {
    return useQuery({
        queryKey: ["cards", "stats", deckId],
        queryFn: () => cardService.getStats(deckId),
    });
};

export const useCard = (id: string) => {
    return useQuery({
        queryKey: ["cards", id],
        queryFn: () => cardService.getById(id),
        enabled: !!id,
    });
};

export const useReviewCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ReviewCardInput }) => cardService.review(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
            queryClient.invalidateQueries({ queryKey: ["study-sessions"] });
        },
        onError: (error) => {
            handleError(error, "Failed to submit review");
        },
    });
};

export const useFlagCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, flags }: { id: string; flags: number }) => cardService.flag(id, flags),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
        },
        onError: (error) => {
            handleError(error, "Failed to flag card");
        },
    });
};

export const useSuspendCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => cardService.toggleSuspend(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
            toast.success("Card suspended!");
        },
        onError: (error) => {
            handleError(error, "Failed to suspend card");
        },
    });
};

export const useBuryCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => cardService.bury(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
            toast.success("Card buried!");
        },
        onError: (error) => {
            handleError(error, "Failed to bury card");
        },
    });
};
