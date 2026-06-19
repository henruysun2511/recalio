import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { CreateLanguageInput, Language, UpdateLanguageInput } from "@/schemas/language.schema";

const languageService = {
    getSupported: () => {
        return http.get<ApiResponse<Language[]>>("/languages/supported");
    },

    list: () => {
        return http.get<ApiResponse<Language[]>>("/languages");
    },

    create: (data: CreateLanguageInput) => {
        return http.post<ApiResponse<Language>>("/languages", data);
    },

    update: (id: string, data: UpdateLanguageInput) => {
        return http.patch<ApiResponse<Language>>(`/languages/${id}`, data);
    },

    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`/languages/${id}`);
    },
};

export default languageService;
