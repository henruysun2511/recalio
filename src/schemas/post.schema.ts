import { ReportReason } from "@/constants/type"
import { SortOrder } from "@/constants/sort"
import { z } from "zod"

export const postUserSchema = z.object({
    id: z.string().uuid(),
    username: z.string(),
    displayName: z.string(),
    avatarUrl: z.string().nullable(),
})

export const postDeckSchema = z.object({
    postId: z.string().uuid().optional(),
    deckId: z.string().uuid(),
    orderIndex: z.number().optional(),
    deck: z.object({
        id: z.string().uuid(),
        name: z.string(),
        fullPath: z.string().nullable(),
        coverImage: z.string().nullable(),
        description: z.string().nullable(),
    }),
})

export const postSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    title: z.string(),
    content: z.string().nullable().optional(),
    coverImage: z.string().nullable().optional(),
    tags: z.array(z.string()),
    isPublished: z.boolean(),
    isBanned: z.boolean(),
    likeCount: z.number(),
    publishedAt: z.string().nullable().optional(),
    bannedAt: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
    user: postUserSchema.optional(),
    decks: z.array(postDeckSchema).optional(),
})

export type Post = z.infer<typeof postSchema>

export const createPostSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống").max(200, "Tiêu đề không được quá 200 kí tự"),
    content: z.string().max(10000, "Nội dung không được quá 10000 kí tự").optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).max(20, "Tối đa 20 thẻ tag").optional(),
    deckIds: z.array(z.string().uuid()).min(1, "Phải chọn ít nhất 1 deck").max(50, "Tối đa 50 deck"),
})

export type CreatePostInput = z.infer<typeof createPostSchema>

export const updatePostSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().max(10000).optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).max(20).optional(),
    deckIds: z.array(z.string().uuid()).max(50).optional(),
})

export type UpdatePostInput = z.infer<typeof updatePostSchema>

export const reportPostSchema = z.object({
    reason: z.nativeEnum(ReportReason, { message: "Lý do báo cáo không hợp lệ" }),
    description: z.string().optional(),
})

export type ReportPostInput = z.infer<typeof reportPostSchema>

export interface PostQuery {
    page?: number
    limit?: number
    search?: string
    sortOrder?: SortOrder
    tag?: string
    userId?: string
}
