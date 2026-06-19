import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { DeckSetting, UpdateDeckSettingInput } from "@/schemas/deck-setting.schema";

const deckSettingService = {
    get: (deckId: string) => {
        return http.get<ApiResponse<DeckSetting>>(`/decks/${deckId}/setting`);
    },

    update: (deckId: string, data: UpdateDeckSettingInput) => {
        return http.patch<ApiResponse<DeckSetting>>(`/decks/${deckId}/setting`, data);
    },
};

export default deckSettingService;
