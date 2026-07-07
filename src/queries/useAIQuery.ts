import { useMutation } from "@tanstack/react-query";
import aiService from "@/services/ai.service";
import { ExtractFromTextInput, ExtractFromTopicInput, RelatedNotesInput } from "@/schemas/ai.schema";

export const useExtractFromText = () => {
    return useMutation({
        mutationFn: (data: ExtractFromTextInput) => aiService.extractFromText(data),
    });
};

export const useExtractFromTopic = () => {
    return useMutation({
        mutationFn: (data: ExtractFromTopicInput) => aiService.extractFromTopic(data),
    });
};

export const useRelatedNotes = () => {
    return useMutation({
        mutationFn: (data: RelatedNotesInput) => aiService.getRelatedNotes(data),
    });
};

export const useProcessDocument = () => {
    return useMutation({
        mutationFn: (file: File) => aiService.processDocument(file),
    });
};

export const useDetectImage = () => {
    return useMutation({
        mutationFn: (file: File) => aiService.detectImage(file),
    });
};
