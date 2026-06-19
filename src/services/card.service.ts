import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { Card, CardParams, CardStats, DueCardsParams, ReviewCardInput } from "@/schemas/card.schema";
import { Pagination } from "@/constants/pagination";

const cardService = {
    listByDeck: (deckId: string, params?: CardParams) => {
        return http.get<ApiResponse<Card[]> & { meta?: Pagination }>(`/cards/decks/${deckId}`, { params });
    },

    getDue: (params?: DueCardsParams) => {
        return http.get<ApiResponse<Card[]> & { meta?: Pagination }>("/cards/due", { params });
    },

    getStats: (deckId?: string) => {
        return http.get<ApiResponse<CardStats>>("/cards/stats", { params: { deckId } });
    },

    getById: (id: string) => {
        return http.get<ApiResponse<Card>>(`/cards/${id}`);
    },

    review: (id: string, data: ReviewCardInput) => {
        return http.post<ApiResponse<Card>>(`/cards/${id}/review`, data);
    },

    flag: (id: string, flags: number) => {
        return http.patch<ApiResponse<null>>(`/cards/${id}/flag`, { flags });
    },

    toggleSuspend: (id: string) => {
        return http.patch<ApiResponse<null>>(`/cards/${id}/suspend`);
    },

    bury: (id: string) => {
        return http.patch<ApiResponse<null>>(`/cards/${id}/bury`);
    },
};

export default cardService;
