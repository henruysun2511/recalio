import { useMutation } from "@tanstack/react-query";
import cloudinaryService from "@/services/cloudinary.service";
import { DeleteMediaInput } from "@/schemas/cloudinary.schema";

export const useUploadMedia = () => {
    return useMutation({
        mutationFn: ({ file, folder }: { file: File; folder?: string }) => cloudinaryService.upload(file, folder),
    });
};

export const useDeleteMedia = () => {
    return useMutation({
        mutationFn: (data: DeleteMediaInput) => cloudinaryService.delete(data),
    });
};
