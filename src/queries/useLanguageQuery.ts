import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import languageService from "@/services/language.service";
import { CreateLanguageInput, LanguageQuery, UpdateLanguageInput } from "@/schemas/language.schema";

export const LANGUAGE_QUERY_KEY = ["languages"];

export const useSupportedLanguages = () => {
    return useQuery({
        queryKey: [...LANGUAGE_QUERY_KEY, "supported"],
        queryFn: async () => {
            const res = await languageService.getSupported();
            return res.data;
        },
        staleTime: 10 * 60 * 1000,
    });
};

export const useLanguages = (params?: LanguageQuery) => {
    return useQuery({
        queryKey: [...LANGUAGE_QUERY_KEY, params],
        queryFn: async () => {
            const res = await languageService.list(params);
            return res.data;
        }
    });
};

export const useCreateLanguage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateLanguageInput) => languageService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LANGUAGE_QUERY_KEY });
        },
    });
};

export const useUpdateLanguage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateLanguageInput }) => languageService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LANGUAGE_QUERY_KEY });
        },
    });
};

export const useDeleteLanguage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => languageService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LANGUAGE_QUERY_KEY });
        },
    });
};
