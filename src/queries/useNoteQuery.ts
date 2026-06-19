import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import noteService from "@/services/note.service";
import { ConfirmNoteInput, DocumentNoteInput, NoteParams, PreviewNoteInput, UpdateNoteInput } from "@/schemas/note.schema";
import { handleError } from "@/utils/handleError";

export const useNotesByDeck = (deckId: string, params?: NoteParams) => {
    return useQuery({
        queryKey: ["notes", deckId, params],
        queryFn: () => noteService.listByDeck(deckId, params),
        enabled: !!deckId,
    });
};

export const usePreviewNotes = () => {
    return useMutation({
        mutationFn: (data: PreviewNoteInput) => noteService.preview(data),
    });
};

export const useConfirmNotes = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ConfirmNoteInput) => noteService.confirm(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Notes created!");
        },
        onError: (error) => {
            handleError(error, "Failed to create notes");
        },
    });
};

export const useUpdateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateNoteInput }) => noteService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Note updated!");
        },
        onError: (error) => {
            handleError(error, "Failed to update note");
        },
    });
};

export const useDeleteNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => noteService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Note deleted!");
        },
        onError: (error) => {
            handleError(error, "Failed to delete note");
        },
    });
};

export const useDocumentNotes = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: DocumentNoteInput) => noteService.fromDocument(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            toast.success("Document processed!");
        },
        onError: (error) => {
            handleError(error, "Failed to process document");
        },
    });
};
