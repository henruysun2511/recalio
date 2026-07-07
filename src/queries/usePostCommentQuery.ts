import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import postCommentService from "@/services/post-comment.service"
import { CreateCommentInput, CommentQuery, UpdateCommentInput } from "@/schemas/post-comment.schema"

export const COMMENT_QUERY_KEY = ["post-comments"]

export const usePostComments = (postId: string, params?: CommentQuery) => {
    return useQuery({
        queryKey: [...COMMENT_QUERY_KEY, postId, params],
        queryFn: async () => {
            const res = await postCommentService.list(postId, params)
            return res.data
        },
        enabled: !!postId,
    })
}

export const useCreateComment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ postId, data }: { postId: string; data: CreateCommentInput }) =>
            postCommentService.create(postId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEY })
        },
    })
}

export const useUpdateComment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentInput }) =>
            postCommentService.update(commentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEY })
        },
    })
}

export const useDeleteComment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (commentId: string) => postCommentService.delete(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEY })
        },
    })
}

export const useToggleCommentLike = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (commentId: string) => postCommentService.toggleLike(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEY })
        },
    })
}
