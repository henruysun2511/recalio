import { z } from "zod"

export const suggestionSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    content: z.string(),
    isRead: z.boolean(),
    email: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    user: z.object({
        id: z.string().uuid(),
        username: z.string(),
        displayName: z.string(),
        avatarUrl: z.string().nullable(),
    }).optional(),
})

export type Suggestion = z.infer<typeof suggestionSchema>

export const createSuggestionSchema = z.object({
    content: z.string().min(1, "Nội dung góp ý không được để trống").max(2000, "Nội dung góp ý không được quá 2000 kí tự"),
})

export type CreateSuggestionInput = z.infer<typeof createSuggestionSchema>

export const suggestionParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
})

export type SuggestionParams = z.infer<typeof suggestionParamsSchema>
