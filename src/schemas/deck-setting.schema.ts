import { Algorithm, LeechAction } from "@/constants/type";
import { z } from "zod";

export const deckSettingSchema = z.object({
    id: z.string().uuid(),
    deckId: z.string().uuid(),
    algorithm: z.nativeEnum(Algorithm),
    newCardsPerDay: z.number().int(),
    reviewsPerDay: z.number().int(),
    learningSteps: z.string(),
    graduatingInterval: z.number(),
    easyInterval: z.number(),
    intervalModifier: z.number(),
    easyBonus: z.number(),
    hardInterval: z.number(),
    maximumInterval: z.number(),
    lapseSteps: z.string(),
    minimumInterval: z.number(),
    leechThreshold: z.number().int(),
    leechAction: z.nativeEnum(LeechAction),
    fsrsWeights: z.string().nullable(),
    requestRetention: z.number(),
    updatedAt: z.string(),
});

export type DeckSetting = z.infer<typeof deckSettingSchema>;

export const updateDeckSettingSchema = z.object({
    algorithm: z.nativeEnum(Algorithm).optional(),
    newCardsPerDay: z.number().int().optional(),
    reviewsPerDay: z.number().int().optional(),
    learningSteps: z.string().optional(),
    graduatingInterval: z.number().optional(),
    easyInterval: z.number().optional(),
    intervalModifier: z.number().optional(),
    easyBonus: z.number().optional(),
    hardInterval: z.number().optional(),
    maximumInterval: z.number().optional(),
    lapseSteps: z.string().optional(),
    minimumInterval: z.number().optional(),
    leechThreshold: z.number().int().optional(),
    leechAction: z.nativeEnum(LeechAction).optional(),
    fsrsWeights: z.string().nullable().optional(),
    requestRetention: z.number().optional(),
});

export type UpdateDeckSettingInput = z.infer<typeof updateDeckSettingSchema>;
