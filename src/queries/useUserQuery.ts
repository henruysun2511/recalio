import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userService from "@/services/user.service";
import { UpdateProfileInput, UpdateRoleInput, UserQuery } from "@/schemas/user.schema";

export const USER_QUERY_KEY = ["user"];

export const useMyProfile = () => {
    return useQuery({
        queryKey: [...USER_QUERY_KEY, "me"],
        queryFn: async () => {
            const res = await userService.getMe();
            return res.data;
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileInput) => userService.updateMe(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
        },
    });
};

export const useUsers = (params?: UserQuery) => {
    return useQuery({
        queryKey: [...USER_QUERY_KEY, "admin", "list", params],
        queryFn: async () => {
            const res = await userService.list(params);
            return res.data;
        },
    });
};

export const useToggleActive = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => userService.toggleActive(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY, "admin"] });
        },
    });
};

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRoleInput }) => userService.updateRole(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...USER_QUERY_KEY, "admin"] });
        },
    });
};
