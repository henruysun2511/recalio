import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import {
    CardTemplate,
    CreateCardTemplateInput,
    CreateNoteTemplateInput,
    NoteTemplate,
    UpdateCardTemplateInput,
    UpdateNoteTemplateInput,
} from "@/schemas/note-template.schema";

const noteTemplateService = {
    list: () => {
        return http.get<ApiResponse<NoteTemplate[]>>("/note-templates");
    },

    getById: (id: string) => {
        return http.get<ApiResponse<NoteTemplate>>(`/note-templates/${id}`);
    },

    create: (data: CreateNoteTemplateInput) => {
        return http.post<ApiResponse<NoteTemplate>>("/note-templates", data);
    },

    update: (id: string, data: UpdateNoteTemplateInput) => {
        return http.patch<ApiResponse<NoteTemplate>>(`/note-templates/${id}`, data);
    },

    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`/note-templates/${id}`);
    },

    listCardTemplates: (noteTemplateId: string) => {
        return http.get<ApiResponse<CardTemplate[]>>(`/note-templates/${noteTemplateId}/card-templates`);
    },

    getCardTemplate: (noteTemplateId: string, id: string) => {
        return http.get<ApiResponse<CardTemplate>>(`/note-templates/${noteTemplateId}/card-templates/${id}`);
    },

    createCardTemplate: (noteTemplateId: string, data: CreateCardTemplateInput) => {
        return http.post<ApiResponse<CardTemplate>>(`/note-templates/${noteTemplateId}/card-templates`, data);
    },

    updateCardTemplate: (noteTemplateId: string, id: string, data: UpdateCardTemplateInput) => {
        return http.patch<ApiResponse<CardTemplate>>(`/note-templates/${noteTemplateId}/card-templates/${id}`, data);
    },

    deleteCardTemplate: (noteTemplateId: string, id: string) => {
        return http.delete<ApiResponse<null>>(`/note-templates/${noteTemplateId}/card-templates/${id}`);
    },
};

export default noteTemplateService;
