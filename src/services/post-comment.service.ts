import { ApiResponse } from "@/constants/apiResponse"
import http from "@/utils/http"
import { CreateCommentInput, PostComment, CommentQuery, UpdateCommentInput } from "@/schemas/post-comment.schema"

const prefix = "/posts"

const postCommentService = {
    list: (postId: string, params?: CommentQuery) => {
        return http.get<ApiResponse<PostComment[]>>(`${prefix}/${postId}/comments`, { params })
    },

    listReplies: (commentId: string, params?: CommentQuery) => {
        return http.get<ApiResponse<PostComment[]>>(`/comments/${commentId}/replies`, { params })
    },

    create: (postId: string, data: CreateCommentInput) => {
        return http.post<ApiResponse<PostComment>>(`${prefix}/${postId}/comments`, data)
    },

    update: (commentId: string, data: UpdateCommentInput) => {
        return http.patch<ApiResponse<PostComment>>(`/comments/${commentId}`, data)
    },

    delete: (commentId: string) => {
        return http.delete<ApiResponse<null>>(`/comments/${commentId}`)
    },

    toggleLike: (commentId: string) => {
        return http.post<ApiResponse<{ liked: boolean }>>(`/comments/${commentId}/like`)
    },
}

export default postCommentService
