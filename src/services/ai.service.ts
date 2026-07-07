import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { AiNote, DetectImageResponse, ExtractFromTextInput, ExtractFromTopicInput, ProcessDocumentResponse, RelatedNotesInput, RelatedNotesResponse } from "@/schemas/ai.schema";

const prefix = "/ai";

const aiService = {
    extractFromText: (data: ExtractFromTextInput) => {
        return http.post<ApiResponse<AiNote[]>>(`${prefix}/extract-from-text`, data);
    },

    extractFromTopic: (data: ExtractFromTopicInput) => {
        return http.post<ApiResponse<AiNote[]>>(`${prefix}/extract-from-topic`, data);
    },

    getRelatedNotes: (data: RelatedNotesInput) => {
        return http.post<ApiResponse<RelatedNotesResponse>>(`${prefix}/related-notes`, data);
    },

    processDocument: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return http.post<ApiResponse<ProcessDocumentResponse>>(`${prefix}/process-document`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    detectImage: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return http.post<ApiResponse<DetectImageResponse>>(`${prefix}/detect-image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};

export default aiService;
