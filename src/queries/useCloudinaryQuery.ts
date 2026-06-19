import { useMutation } from "@tanstack/react-query";
import cloudinaryService from "@/services/cloudinary.service";
import { DeleteMediaInput } from "@/schemas/cloudinary.schema";
import { handleError } from "@/utils/handleError";

export const useUploadMedia = () => {
    return useMutation({
        mutationFn: (file: File) => cloudinaryService.upload(file),
        onError: (error) => {
            handleError(error, "Failed to upload media");
        },
    });
};

export const useDeleteMedia = () => {
    return useMutation({
        mutationFn: (data: DeleteMediaInput) => cloudinaryService.delete(data),
        onError: (error) => {
            handleError(error, "Failed to delete media");
        },
    });
};
