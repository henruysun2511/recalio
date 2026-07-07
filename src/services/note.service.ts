import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { ConfirmNoteInput, DocumentNoteInput, Note, NoteParams, PreviewNoteInput, UpdateNoteInput } from "@/schemas/note.schema";
import { Pagination } from "@/constants/pagination";

const prefix = "/notes";

const noteService = {
    listByDeck: (deckId: string, params?: NoteParams) => {
        return http.get<ApiResponse<Note[]> & { meta?: Pagination }>(`${prefix}/decks/${deckId}`, { params });
    },

    preview: (data: PreviewNoteInput) => {
        return http.post<ApiResponse<any>>(`${prefix}/preview`, data);
    },

    confirm: (data: ConfirmNoteInput) => {
        return http.post<ApiResponse<Note[]>>(`${prefix}/confirm`, data);
    },

    update: (id: string, data: UpdateNoteInput) => {
        return http.patch<ApiResponse<Note>>(`${prefix}/${id}`, data);
    },

    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`${prefix}/${id}`);
    },

    fromDocument: (data: DocumentNoteInput) => {
        return http.post<ApiResponse<Note[]>>(`${prefix}/from-document`, data);
    },
};

export default noteService;
