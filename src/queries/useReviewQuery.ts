import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import reviewService from "@/services/review.service"
import { CreateReviewInput, ReviewParams } from "@/schemas/review.schema"

export const REVIEW_QUERY_KEY = ["reviews"]

export const useReviewsByDeck = (deckId: string, params?: ReviewParams) => {
    return useQuery({
        queryKey: [...REVIEW_QUERY_KEY, deckId, params],
        queryFn: async () => {
            const res = await reviewService.listByDeck(deckId, params)
            return res.data
        },
        enabled: !!deckId,
    })
}

export const useDeleteReview = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => reviewService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY })
        },
    })
}

export const useLatestReviews = () => {
    return useQuery({
        queryKey: [...REVIEW_QUERY_KEY, "latest"],
        queryFn: async () => {
            const res = await reviewService.listLatest()
            return res.data
        },
    })
}

export const useUpsertReview = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ deckId, data }: { deckId: string; data: CreateReviewInput }) =>
            reviewService.createOrUpdate(deckId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["decks"] })
            queryClient.invalidateQueries({ queryKey: REVIEW_QUERY_KEY })
        },
    })
}
