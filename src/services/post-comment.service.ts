import { ApiResponse } from "@/constants/apiResponse"
import http from "@/utils/http"
import { CreateCommentInput, PostComment, CommentQuery, UpdateCommentInput } from "@/schemas/post-comment.schema"
import { Pagination } from "@/constants/pagination"

const prefix = "/posts"

interface CommentListResponse {
    comments: PostComment[]
    total: number
    page: number
    limit: number
}

const postCommentService = {
    list: (postId: string, params?: CommentQuery) => {
        return http.get<ApiResponse<CommentListResponse>>(`${prefix}/${postId}/comments`, { params })
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
