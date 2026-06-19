import { useMutation } from "@tanstack/react-query";
import aiService from "@/services/ai.service";
import { ExtractFromTextInput, ExtractFromTopicInput, RelatedNotesInput } from "@/schemas/ai.schema";
import { handleError } from "@/utils/handleError";

export const useExtractFromText = () => {
    return useMutation({
        mutationFn: (data: ExtractFromTextInput) => aiService.extractFromText(data),
        onError: (error) => {
            handleError(error, "Failed to extract notes");
        },
    });
};

export const useExtractFromTopic = () => {
    return useMutation({
        mutationFn: (data: ExtractFromTopicInput) => aiService.extractFromTopic(data),
        onError: (error) => {
            handleError(error, "Failed to generate notes");
        },
    });
};

export const useRelatedNotes = () => {
    return useMutation({
        mutationFn: (data: RelatedNotesInput) => aiService.getRelatedNotes(data),
        onError: (error) => {
            handleError(error, "Failed to get related notes");
        },
    });
};

export const useProcessDocument = () => {
    return useMutation({
        mutationFn: (file: File) => aiService.processDocument(file),
        onError: (error) => {
            handleError(error, "Failed to process document");
        },
    });
};

export const useDetectImage = () => {
    return useMutation({
        mutationFn: (file: File) => aiService.detectImage(file),
        onError: (error) => {
            handleError(error, "Failed to detect image");
        },
    });
};
