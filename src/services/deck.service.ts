import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { CreateDeckInput, DeckParams, DeckResponse, MoveDeckInput, UpdateDeckInput } from "@/schemas/deck.schema";
import { Pagination } from "@/constants/pagination";

const deckService = {
    listPublic: (params?: DeckParams) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>("/decks", { params });
    },

    listMine: (params?: DeckParams) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>("/decks/me", { params });
    },

    listArchived: (params?: DeckParams) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>("/decks/archived", { params });
    },

    listCloned: (params?: DeckParams) => {
        return http.get<ApiResponse<DeckResponse[]> & { meta?: Pagination }>("/decks/cloned", { params });
    },

    getById: (id: string) => {
        return http.get<ApiResponse<DeckResponse>>(`/decks/${id}`);
    },

    create: (data: CreateDeckInput) => {
        return http.post<ApiResponse<DeckResponse>>("/decks", data);
    },

    update: (id: string, data: UpdateDeckInput) => {
        return http.patch<ApiResponse<DeckResponse>>(`/decks/${id}`, data);
    },

    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`/decks/${id}`);
    },

    move: (id: string, data: MoveDeckInput) => {
        return http.patch<ApiResponse<DeckResponse>>(`/decks/${id}/move`, data);
    },

    clone: (id: string) => {
        return http.post<ApiResponse<DeckResponse>>(`/decks/${id}/clone`);
    },

    toggleBan: (id: string) => {
        return http.patch<ApiResponse<DeckResponse>>(`/decks/${id}/ban`);
    },
};

export default deckService;
