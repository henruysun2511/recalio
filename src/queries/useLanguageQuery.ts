import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import languageService from "@/services/language.service";
import { CreateLanguageInput, UpdateLanguageInput } from "@/schemas/language.schema";
import { handleError } from "@/utils/handleError";

export const useSupportedLanguages = () => {
    return useQuery({
        queryKey: ["languages", "supported"],
        queryFn: () => languageService.getSupported(),
        staleTime: 10 * 60 * 1000,
    });
};

export const useLanguages = () => {
    return useQuery({
        queryKey: ["languages"],
        queryFn: () => languageService.list(),
    });
};

export const useCreateLanguage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLanguageInput) => languageService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["languages"] });
            toast.success("Language created!");
        },
        onError: (error) => {
            handleError(error, "Failed to create language");
        },
    });
};

export const useUpdateLanguage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateLanguageInput }) => languageService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["languages"] });
            toast.success("Language updated!");
        },
        onError: (error) => {
            handleError(error, "Failed to update language");
        },
    });
};

export const useDeleteLanguage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => languageService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["languages"] });
            toast.success("Language deleted!");
        },
        onError: (error) => {
            handleError(error, "Failed to delete language");
        },
    });
};
