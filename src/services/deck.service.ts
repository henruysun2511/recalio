import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { CreateDeckInput, DeckParams, DeckResponse, MoveDeckInput, UpdateDeckInput } from "@/schemas/deck.schema";
import { Pagination } from "@/constants/pagination";

const prefix = "/decks";

const deckService = {
    listPublic: (params?: DeckParams) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>(prefix, { params });
    },

    listMine: (params?: DeckParams) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>(`${prefix}/me`, { params });
    },

    listArchived: (params?: DeckParams) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>(`${prefix}/archived`, { params });
    },

    listCloned: (params?: DeckParams) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>(`${prefix}/cloned`, { params });
    },

    getById: (id: string) => {
        return http.get<ApiResponse<DeckResponse>>(`${prefix}/${id}`);
    },

    create: (data: CreateDeckInput) => {
        return http.post<ApiResponse<DeckResponse>>(prefix, data);
    },

    update: (id: string, data: UpdateDeckInput) => {
        return http.patch<ApiResponse<DeckResponse>>(`${prefix}/${id}`, data);
    },

    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`${prefix}/${id}`);
    },

    move: (id: string, data: MoveDeckInput) => {
        return http.patch<ApiResponse<DeckResponse>>(`${prefix}/${id}/move`, data);
    },

    clone: (id: string) => {
        return http.post<ApiResponse<DeckResponse>>(`${prefix}/${id}/clone`);
    },

    toggleBan: (id: string) => {
        return http.patch<ApiResponse<DeckResponse>>(`${prefix}/${id}/ban`);
    },
};

export default deckService;
