import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import deckSettingService from "@/services/deck-setting.service";
import { UpdateDeckSettingInput } from "@/schemas/deck-setting.schema";

export const DECK_SETTING_QUERY_KEY = ["deck-setting"];

export const useDeckSetting = (deckId: string) => {
    return useQuery({
        queryKey: [...DECK_SETTING_QUERY_KEY, deckId],
        queryFn: async () => {
            const res = await deckSettingService.get(deckId);
            return res.data;
        },
        enabled: !!deckId,
    });
};

export const useUpdateDeckSetting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ deckId, data }: { deckId: string; data: UpdateDeckSettingInput }) =>
            deckSettingService.update(deckId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [...DECK_SETTING_QUERY_KEY, variables.deckId] });
        },
    });
};
