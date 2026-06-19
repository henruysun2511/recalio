import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import reviewService from "@/services/review.service";
import { CreateReviewInput, ReviewParams } from "@/schemas/review.schema";
import { handleError } from "@/utils/handleError";

export const useReviewsByDeck = (deckId: string, params?: ReviewParams) => {
    return useQuery({
        queryKey: ["reviews", deckId, params],
        queryFn: () => reviewService.listByDeck(deckId, params),
        enabled: !!deckId,
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ deckId, data }: { deckId: string; data: CreateReviewInput }) =>
            reviewService.createOrUpdate(deckId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            toast.success("Review submitted!");
        },
        onError: (error) => {
            handleError(error, "Failed to submit review");
        },
    });
};

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => reviewService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
            toast.success("Review deleted!");
        },
        onError: (error) => {
            handleError(error, "Failed to delete review");
        },
    });
};
