import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { Card, CardParams, CardStats, DueCardsParams, ReviewCardInput } from "@/schemas/card.schema";
import { Pagination } from "@/constants/pagination";

const prefix = "/cards";

const cardService = {
    listByDeck: (deckId: string, params?: CardParams) => {
        return http.get<ApiResponse<Card[]> & { meta?: Pagination }>(`${prefix}/decks/${deckId}`, { params });
    },

    getDue: (params?: DueCardsParams) => {
        return http.get<ApiResponse<Card[]> & { meta?: Pagination }>(`${prefix}/due`, { params });
    },

    getStats: (deckId?: string) => {
        return http.get<ApiResponse<CardStats>>(`${prefix}/stats`, { params: { deckId } });
    },

    getById: (id: string) => {
        return http.get<ApiResponse<Card>>(`${prefix}/${id}`);
    },

    review: (id: string, data: ReviewCardInput) => {
        return http.post<ApiResponse<Card>>(`${prefix}/${id}/review`, data);
    },

    flag: (id: string, flags: number) => {
        return http.patch<ApiResponse<null>>(`${prefix}/${id}/flag`, { flags });
    },

    toggleSuspend: (id: string) => {
        return http.patch<ApiResponse<null>>(`${prefix}/${id}/suspend`);
    },

    bury: (id: string) => {
        return http.patch<ApiResponse<null>>(`${prefix}/${id}/bury`);
    },
};

export default cardService;
