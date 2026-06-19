import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { AiNote, DetectImageResponse, ExtractFromTextInput, ExtractFromTopicInput, ProcessDocumentResponse, RelatedNotesInput, RelatedNotesResponse } from "@/schemas/ai.schema";

const aiService = {
    extractFromText: (data: ExtractFromTextInput) => {
        return http.post<ApiResponse<AiNote[]>>("/ai/extract-from-text", data);
    },

    extractFromTopic: (data: ExtractFromTopicInput) => {
        return http.post<ApiResponse<AiNote[]>>("/ai/extract-from-topic", data);
    },

    getRelatedNotes: (data: RelatedNotesInput) => {
        return http.post<ApiResponse<RelatedNotesResponse>>("/ai/related-notes", data);
    },

    processDocument: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return http.post<ApiResponse<ProcessDocumentResponse>>("/ai/process-document", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    detectImage: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return http.post<ApiResponse<DetectImageResponse>>("/ai/detect-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};

export default aiService;
