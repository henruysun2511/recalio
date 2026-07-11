import { ApiResponse } from "@/constants/apiResponse"
import http from "@/utils/http"
import { CreatePostInput, Post, PostQuery, ReportPostInput, UpdatePostInput } from "@/schemas/post.schema"

const prefix = "/posts"

const postService = {
    create: (data: CreatePostInput) => {
        return http.post<ApiResponse<Post>>(prefix, data)
    },

    list: (params?: PostQuery) => {
        return http.get<ApiResponse<Post[]>>(prefix, { params })
    },

    update: (id: string, data: UpdatePostInput) => {
        return http.patch<ApiResponse<Post>>(`${prefix}/${id}`, data)
    },

    delete: (id: string) => {
        return http.delete<ApiResponse<null>>(`${prefix}/${id}`)
    },

    toggleLike: (id: string) => {
        return http.post<ApiResponse<{ liked: boolean }>>(`${prefix}/${id}/like`)
    },

    report: (id: string, data: ReportPostInput) => {
        return http.post<ApiResponse<unknown>>(`${prefix}/${id}/report`, data)
    },

    listAdmin: (params?: PostQuery) => {
        return http.get<ApiResponse<Post[]>>(`${prefix}/admin/reported`, { params })
    },

    ban: (id: string, isBanned: boolean) => {
        return http.patch<ApiResponse<Post>>(`${prefix}/${id}/ban`, { isBanned })
    },
}

export default postService
