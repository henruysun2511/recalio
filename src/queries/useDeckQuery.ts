import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import deckService from "@/services/deck.service";
import { CreateDeckInput, DeckParams, MoveDeckInput, UpdateDeckInput } from "@/schemas/deck.schema";

export const DECK_QUERY_KEY = ["decks"];

export const usePublicDecks = (params?: DeckParams) => {
    return useQuery({
        queryKey: [...DECK_QUERY_KEY, "public", params],
        queryFn: async () => {
            const res = await deckService.listPublic(params);
            return res.data;
        },
    });
};

export const useMyDecks = (params?: DeckParams) => {
    return useQuery({
        queryKey: [...DECK_QUERY_KEY, "mine", params],
        queryFn: async () => {
            const res = await deckService.listMine(params);
            return res.data;
        },
    });
};

export const useArchivedDecks = (params?: DeckParams) => {
    return useQuery({
        queryKey: [...DECK_QUERY_KEY, "archived", params],
        queryFn: async () => {
            const res = await deckService.listArchived(params);
            return res.data;
        },
    });
};

export const useClonedDecks = (params?: DeckParams) => {
    return useQuery({
        queryKey: [...DECK_QUERY_KEY, "cloned", params],
        queryFn: async () => {
            const res = await deckService.listCloned(params);
            return res.data;
        },
    });
};

export const useDeck = (id: string) => {
    return useQuery({
        queryKey: [...DECK_QUERY_KEY, id],
        queryFn: async () => {
            const res = await deckService.getById(id);
            return res.data;
        },
        enabled: !!id,
    });
};

export const useCreateDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDeckInput) => deckService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEY });
        },
    });
};

export const useUpdateDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateDeckInput }) => deckService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEY });
        },
    });
};

export const useDeleteDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deckService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEY });
        },
    });
};

export const useMoveDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: MoveDeckInput }) => deckService.move(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEY });
        },
    });
};

export const useCloneDeck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deckService.clone(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEY });
        },
    });
};
