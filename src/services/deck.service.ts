import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import api from "@/utils/axios";
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

    exportDeck: async (id: string, includeMedia = false) => {
        const res = await api.get(`${prefix}/${id}/export`, {
            params: { includeMedia },
            responseType: 'blob',
        });
        const disposition = res.headers['content-disposition'] || '';
        const match = disposition.match(/filename\s*=\s*"?([^"\s]+)"?\s*$/);
        const filename = match ? match[1] : `${id}.rcl`;
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },
};

export default deckService;
