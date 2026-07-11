import { z } from "zod"

export const postCommentSchema = z.object({
    id: z.string().uuid(),
    postId: z.string().uuid(),
    userId: z.string().uuid(),
    content: z.string(),
    parentId: z.string().uuid().nullable(),
    likeCount: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
    user: z.object({
        id: z.string().uuid(),
        username: z.string(),
        displayName: z.string(),
        avatarUrl: z.string().nullable(),
    }),
    _count: z.object({ replies: z.number() }).optional(),
})

export type PostComment = z.infer<typeof postCommentSchema>

export const createCommentSchema = z.object({
    content: z.string().min(1, "Nội dung không được để trống").max(2000, "Nội dung tối đa 2000 kí tự"),
    parentId: z.string().uuid().optional(),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>

export const updateCommentSchema = z.object({
    content: z.string().min(1, "Nội dung không được để trống").max(2000, "Nội dung tối đa 2000 kí tự"),
})

export type UpdateCommentInput = z.infer<typeof updateCommentSchema>

export interface CommentQuery {
    page?: number
    limit?: number
}
