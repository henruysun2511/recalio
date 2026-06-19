import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import userService from "@/services/user.service";
import { UpdateProfileInput } from "@/schemas/user.schema";
import { handleError } from "@/utils/handleError";

export const useMyProfile = () => {
    return useQuery({
        queryKey: ["me"],
        queryFn: () => userService.getMe(),
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateProfileInput) => userService.updateMe(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["me"] });
            toast.success("Profile updated!");
        },
        onError: (error) => {
            handleError(error, "Failed to update profile");
        },
    });
};
