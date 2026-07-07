import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import noteService from "@/services/note.service";
import { ConfirmNoteInput, DocumentNoteInput, NoteParams, PreviewNoteInput, UpdateNoteInput } from "@/schemas/note.schema";

export const NOTE_QUERY_KEY = ["notes"];

export const useNotesByDeck = (deckId: string, params?: NoteParams) => {
    return useQuery({
        queryKey: [...NOTE_QUERY_KEY, deckId, params],
        queryFn: async () => {
            const res = await noteService.listByDeck(deckId, params);
            return res.data;
        },
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
            queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEY });
        },
    });
};

export const useUpdateNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateNoteInput }) => noteService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEY });
        },
    });
};

export const useDeleteNote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => noteService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEY });
        },
    });
};

export const useDocumentNotes = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: DocumentNoteInput) => noteService.fromDocument(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTE_QUERY_KEY });
        },
    });
};
