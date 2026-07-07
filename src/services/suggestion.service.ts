import { ApiResponse } from "@/constants/apiResponse"
import http from "@/utils/http"
import { CreateSuggestionInput, Suggestion, SuggestionParams } from "@/schemas/suggestion.schema"
import { Pagination } from "@/constants/pagination"

const prefix = "/suggestions"

const suggestionService = {
    create: (data: CreateSuggestionInput) => {
        return http.post<ApiResponse<Suggestion>>(prefix, data)
    },

    list: (params?: SuggestionParams) => {
        return http.get<ApiResponse<Suggestion[]> & { meta?: Pagination }>(prefix, { params })
    },

    markAsRead: (id: string) => {
        return http.patch<ApiResponse<Suggestion>>(`${prefix}/${id}/read`)
    },
}

export default suggestionService
