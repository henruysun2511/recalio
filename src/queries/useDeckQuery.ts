import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import deckService from "@/services/deck.service";
import { CreateDeckInput, DeckParams, MoveDeckInput, UpdateDeckInput } from "@/schemas/deck.schema";
import { handleError } from "@/utils/handleError";

export const usePublicDecks = (params?: DeckParams) => {
    return useQuery({
        queryKey: ["decks", "public", params],
        queryFn: () => deckService.listPublic(params),
    });
};

export const useMyDecks = (params?: DeckParams) => {
    return useQuery({
        queryKey: ["decks", "mine", params],
        queryFn: () => deckService.listMine(params),
    });
};

export const useArchivedDecks = (params?: DeckParams) => {
    return useQuery({
        queryKey: ["decks", "archived", params],
        queryFn: () => deckService.listArchived(params),
    });
};

export const useClonedDecks = (params?: DeckParams) => {
    return useQuery({
        queryKey: ["decks", "cloned", params],
        queryFn: () => deckService.listCloned(params),
    });
};

export const useDeck = (id: string) => {
    return useQuery({
        queryKey: ["decks", id],
        queryFn: () => deckService.getById(id),
        enabled: !!id,
    });
};

export const useCreateDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDeckInput) => deckService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["decks"] });
            toast.success("Deck created!");
        },
        onError: (error) => {
            handleError(error, "Failed to create deck");
        },
    });
};

export const useUpdateDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDeckInput }) => deckService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["decks"] });
            toast.success("Deck updated!");
        },
        onError: (error) => {
            handleError(error, "Failed to update deck");
        },
    });
};

export const useDeleteDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deckService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["decks"] });
            toast.success("Deck deleted!");
        },
        onError: (error) => {
            handleError(error, "Failed to delete deck");
        },
    });
};

export const useMoveDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: MoveDeckInput }) => deckService.move(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["decks"] });
            toast.success("Deck moved!");
        },
        onError: (error) => {
            handleError(error, "Failed to move deck");
        },
    });
};

export const useCloneDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deckService.clone(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["decks"] });
            toast.success("Deck cloned!");
        },
        onError: (error) => {
            handleError(error, "Failed to clone deck");
        },
    });
};
