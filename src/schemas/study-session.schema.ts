import { StudyMode } from "@/constants/type";
import { z } from "zod";

export const createSessionSchema = z.object({
    deckId: z.string().uuid().optional(),
    mode: z.nativeEnum(StudyMode).optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;

export const sessionParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
    deckId: z.string().uuid().optional(),
});

export type SessionParams = z.infer<typeof sessionParamsSchema>;

export const reviewLogParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
});

export type ReviewLogParams = z.infer<typeof reviewLogParamsSchema>;

export interface StudySession {
    id: string;
    deckId: string | null;
    mode: string;
    startedAt: string;
    endedAt: string | null;
    stats?: {
        reviewedCards: number;
        timeSpentMs: number;
        again: number;
        hard: number;
        good: number;
        easy: number;
    };
}

export interface ReviewLog {
    id: string;
    cardId: string;
    sessionId: string;
    rating: string;
    responseTimeMs: number;
    stateBefore: string;
    stateAfter: string;
    reviewedAt: string;
}
