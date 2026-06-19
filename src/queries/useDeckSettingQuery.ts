import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import deckSettingService from "@/services/deck-setting.service";
import { UpdateDeckSettingInput } from "@/schemas/deck-setting.schema";
import { handleError } from "@/utils/handleError";

export const useDeckSetting = (deckId: string) => {
    return useQuery({
        queryKey: ["deck-setting", deckId],
        queryFn: () => deckSettingService.get(deckId),
        enabled: !!deckId,
    });
};

export const useUpdateDeckSetting = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ deckId, data }: { deckId: string; data: UpdateDeckSettingInput }) =>
            deckSettingService.update(deckId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["deck-setting", variables.deckId] });
            toast.success("Settings updated!");
        },
        onError: (error) => {
            handleError(error, "Failed to update settings");
        },
    });
};
