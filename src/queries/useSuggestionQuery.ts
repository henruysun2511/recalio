import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import suggestionService from "@/services/suggestion.service"
import { CreateSuggestionInput, SuggestionParams } from "@/schemas/suggestion.schema"

export const SUGGESTION_QUERY_KEY = ["suggestions"]

export const useSuggestions = (params?: SuggestionParams) => {
    return useQuery({
        queryKey: [...SUGGESTION_QUERY_KEY, params],
        queryFn: async () => {
            const res = await suggestionService.list(params)
            return res.data
        },
    })
}

export const useCreateSuggestion = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateSuggestionInput) => suggestionService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUGGESTION_QUERY_KEY })
        },
    })
}

export const useMarkSuggestionRead = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => suggestionService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SUGGESTION_QUERY_KEY })
        },
    })
}
