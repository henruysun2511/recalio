import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import noteTemplateService from "@/services/note-template.service";
import {
    CreateCardTemplateInput,
    CreateNoteTemplateInput,
    UpdateCardTemplateInput,
    UpdateNoteTemplateInput,
} from "@/schemas/note-template.schema";
import { handleError } from "@/utils/handleError";

export const useNoteTemplates = () => {
    return useQuery({
        queryKey: ["note-templates"],
        queryFn: () => noteTemplateService.list(),
    });
};

export const useNoteTemplate = (id: string) => {
    return useQuery({
        queryKey: ["note-templates", id],
        queryFn: () => noteTemplateService.getById(id),
        enabled: !!id,
    });
};

export const useCreateNoteTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateNoteTemplateInput) => noteTemplateService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["note-templates"] });
            toast.success("Template created!");
        },
        onError: (error) => {
            handleError(error, "Failed to create template");
        },
    });
};

export const useUpdateNoteTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateNoteTemplateInput }) => noteTemplateService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["note-templates"] });
            toast.success("Template updated!");
        },
        onError: (error) => {
            handleError(error, "Failed to update template");
        },
    });
};

export const useDeleteNoteTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => noteTemplateService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["note-templates"] });
            toast.success("Template deleted!");
        },
        onError: (error) => {
            handleError(error, "Failed to delete template");
        },
    });
};

export const useCardTemplates = (noteTemplateId: string) => {
    return useQuery({
        queryKey: ["note-templates", noteTemplateId, "card-templates"],
        queryFn: () => noteTemplateService.listCardTemplates(noteTemplateId),
        enabled: !!noteTemplateId,
    });
};

export const useCreateCardTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteTemplateId, data }: { noteTemplateId: string; data: CreateCardTemplateInput }) =>
            noteTemplateService.createCardTemplate(noteTemplateId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["card-templates"] });
            toast.success("Card template created!");
        },
        onError: (error) => {
            handleError(error, "Failed to create card template");
        },
    });
};

export const useUpdateCardTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteTemplateId, id, data }: { noteTemplateId: string; id: string; data: UpdateCardTemplateInput }) =>
            noteTemplateService.updateCardTemplate(noteTemplateId, id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["card-templates"] });
            toast.success("Card template updated!");
        },
        onError: (error) => {
            handleError(error, "Failed to update card template");
        },
    });
};

export const useDeleteCardTemplate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ noteTemplateId, id }: { noteTemplateId: string; id: string }) =>
            noteTemplateService.deleteCardTemplate(noteTemplateId, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["card-templates"] });
            toast.success("Card template deleted!");
        },
        onError: (error) => {
            handleError(error, "Failed to delete card template");
        },
    });
};
