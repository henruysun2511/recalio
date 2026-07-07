import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import noteTemplateService from "@/services/note-template.service";
import {
    CreateCardTemplateInput,
    CreateNoteTemplateInput,
    UpdateCardTemplateInput,
    UpdateNoteTemplateInput,
} from "@/schemas/note-template.schema";

export const NOTE_TEMPLATE_QUERY_KEY = ["note-templates"];
export const CARD_TEMPLATE_QUERY_KEY = ["card-templates"];

export const useNoteTemplates = () => {
    return useQuery({
        queryKey: NOTE_TEMPLATE_QUERY_KEY,
        queryFn: async () => {
            const res = await noteTemplateService.list();
            return res.data;
        },
    });
};

export const useNoteTemplate = (id: string) => {
    return useQuery({
        queryKey: [...NOTE_TEMPLATE_QUERY_KEY, id],
        queryFn: async () => {
            const res = await noteTemplateService.getById(id);
            return res.data;
        },
        enabled: !!id,
    });
};

export const useCreateNoteTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateNoteTemplateInput) => noteTemplateService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTE_TEMPLATE_QUERY_KEY });
        },
    });
};

export const useUpdateNoteTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateNoteTemplateInput }) => noteTemplateService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTE_TEMPLATE_QUERY_KEY });
        },
    });
};

export const useDeleteNoteTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => noteTemplateService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTE_TEMPLATE_QUERY_KEY });
        },
    });
};

export const useCardTemplates = (noteTemplateId: string) => {
    return useQuery({
        queryKey: [...NOTE_TEMPLATE_QUERY_KEY, noteTemplateId, "card-templates"],
        queryFn: async () => {
            const res = await noteTemplateService.listCardTemplates(noteTemplateId);
            return res.data;
        },
        enabled: !!noteTemplateId,
    });
};

export const useCreateCardTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteTemplateId, data }: { noteTemplateId: string; data: CreateCardTemplateInput }) =>
            noteTemplateService.createCardTemplate(noteTemplateId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CARD_TEMPLATE_QUERY_KEY });
        },
    });
};

export const useUpdateCardTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteTemplateId, id, data }: { noteTemplateId: string; id: string; data: UpdateCardTemplateInput }) =>
            noteTemplateService.updateCardTemplate(noteTemplateId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CARD_TEMPLATE_QUERY_KEY });
        },
    });
};

export const useDeleteCardTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteTemplateId, id }: { noteTemplateId: string; id: string }) =>
            noteTemplateService.deleteCardTemplate(noteTemplateId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CARD_TEMPLATE_QUERY_KEY });
        },
    });
};
