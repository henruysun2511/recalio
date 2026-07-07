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

const prefix = "/note-templates";

const noteTemplateService = {
    list: () => {
        return http.get<ApiResponse<NoteTemplate[]>>(prefix);
    },

    getById: (id: string) => {
        return http.get<ApiResponse<NoteTemplate>>(`${prefix}/${id}`);
    },

    create: (data: CreateNoteTemplateInput) => {
        return http.post<ApiResponse<NoteTemplate>>(prefix, data);
    },

    update: (id: string, data: UpdateNoteTemplateInput) => {
        return http.patch<ApiResponse<NoteTemplate>>(`${prefix}/${id}`, data);
    },

    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`${prefix}/${id}`);
    },

    listCardTemplates: (noteTemplateId: string) => {
        return http.get<ApiResponse<CardTemplate[]>>(`${prefix}/${noteTemplateId}/card-templates`);
    },

    getCardTemplate: (noteTemplateId: string, id: string) => {
        return http.get<ApiResponse<CardTemplate>>(`${prefix}/${noteTemplateId}/card-templates/${id}`);
    },

    createCardTemplate: (noteTemplateId: string, data: CreateCardTemplateInput) => {
        return http.post<ApiResponse<CardTemplate>>(`${prefix}/${noteTemplateId}/card-templates`, data);
    },

    updateCardTemplate: (noteTemplateId: string, id: string, data: UpdateCardTemplateInput) => {
        return http.patch<ApiResponse<CardTemplate>>(`${prefix}/${noteTemplateId}/card-templates/${id}`, data);
    },

    deleteCardTemplate: (noteTemplateId: string, id: string) => {
        return http.delete<ApiResponse<null>>(`${prefix}/${noteTemplateId}/card-templates/${id}`);
    },
};

export default noteTemplateService;
