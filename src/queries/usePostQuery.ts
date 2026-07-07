import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import postService from "@/services/post.service"
import { CreatePostInput, PostQuery, ReportPostInput, UpdatePostInput } from "@/schemas/post.schema"

export const POST_QUERY_KEY = ["posts"]

export const usePosts = (params?: PostQuery) => {
    return useQuery({
        queryKey: [...POST_QUERY_KEY, "published", params],
        queryFn: async () => {
            const res = await postService.list(params)
            return res.data
        },
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreatePostInput) => postService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY })
        },
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePostInput }) => postService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY })
        },
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => postService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY })
        },
    })
}

export const useTogglePostLike = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => postService.toggleLike(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY })
        },
    })
}

export const useReportPost = () => {
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ReportPostInput }) => postService.report(id, data),
    })
}

export const useAdminPosts = (params?: PostQuery) => {
    return useQuery({
        queryKey: [...POST_QUERY_KEY, "admin", params],
        queryFn: async () => {
            const res = await postService.listAdmin(params)
            return res.data
        },
    })
}

export const useBanPost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, isBanned }: { id: string; isBanned: boolean }) => postService.ban(id, isBanned),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: POST_QUERY_KEY })
        },
    })
}
