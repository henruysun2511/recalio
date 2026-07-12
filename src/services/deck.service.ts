import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { CreateDeckInput, DeckParams, DeckResponse, UpdateDeckInput } from "@/schemas/deck.schema";
import { Pagination } from "@/constants/pagination";

const prefix = "/decks";

const deckService = {
    listPublic: (params?: Partial<DeckParams>) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>(prefix, { params });
    },

    listMine: (params?: Partial<DeckParams>) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>(`${prefix}/me`, { params });
    },

    listArchived: (params?: Partial<DeckParams>) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>(`${prefix}/archived`, { params });
    },

    listFeatured: (params?: Partial<DeckParams>) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>(`${prefix}/featured`, { params });
    },

    listCloned: (params?: Partial<DeckParams>) => {
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

    clone: (id: string) => {
        return http.post<ApiResponse<DeckResponse>>(`${prefix}/${id}/clone`);
    },

    toggleArchive: (id: string) => {
        return http.patch<ApiResponse<DeckResponse>>(`${prefix}/${id}/archive`);
    },

    toggleBan: (id: string) => {
        return http.patch<ApiResponse<DeckResponse>>(`${prefix}/${id}/ban`);
    },

    toggleFeatured: (id: string) => {
        return http.patch<ApiResponse<DeckResponse>>(`${prefix}/${id}/feature`);
    },
};

export default deckService;
