import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { CreateLanguageInput, Language, LanguageQuery, UpdateLanguageInput } from "@/schemas/language.schema";

const prefix = "/languages";

const languageService = {
    getSupported: () => {
        return http.get<ApiResponse<Language[]>>(`${prefix}/supported`);
    },

    list: (params?: LanguageQuery) => {
        return http.get<ApiResponse<Language[]>>(prefix, { params });
    },

    create: (data: CreateLanguageInput) => {
        return http.post<ApiResponse<Language>>(prefix, data);
    },

    update: (id: string, data: UpdateLanguageInput) => {
        return http.patch<ApiResponse<Language>>(`${prefix}/${id}`, data);
    },

    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`${prefix}/${id}`);
    },
};

export default languageService;
