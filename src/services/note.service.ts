import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { ConfirmNoteInput, DocumentNoteInput, Note, NoteParams, PreviewNoteInput, UpdateNoteInput } from "@/schemas/note.schema";
import { Pagination } from "@/constants/pagination";

const noteService = {
    listByDeck: (deckId: string, params?: NoteParams) => {
        return http.get<ApiResponse<Note[]> & { meta?: Pagination }>(`/notes/decks/${deckId}`, { params });
    },

    preview: (data: PreviewNoteInput) => {
        return http.post<ApiResponse<any>>("/notes/preview", data);
    },

    confirm: (data: ConfirmNoteInput) => {
        return http.post<ApiResponse<Note[]>>("/notes/confirm", data);
    },

    update: (id: string, data: UpdateNoteInput) => {
        return http.patch<ApiResponse<Note>>(`/notes/${id}`, data);
    },

    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`/notes/${id}`);
    },

    fromDocument: (data: DocumentNoteInput) => {
        return http.post<ApiResponse<Note[]>>("/notes/from-document", data);
    },
};

export default noteService;
