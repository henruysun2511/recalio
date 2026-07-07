import { useState } from "react";
import { useUploadMedia, useDeleteMedia } from "@/queries/useCloudinaryQuery";
import { toast } from "sonner";
import { handleError } from "@/utils/handleError";

export const useImageUpload = () => {
    const uploadMediaMutation = useUploadMedia();
    const deleteMediaMutation = useDeleteMedia();
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (file: File, folder?: string) => {
        setIsUploading(true);
        try {
            const res = await uploadMediaMutation.mutateAsync({ file, folder });
            if (res.data) {
                toast.success("Tải ảnh lên thành công");
                return res.data.data;
            }
        } catch (error) {
            handleError(error, "Lỗi khi tải ảnh lên");
        } finally {
            setIsUploading(false);
        }
        return null;
    };

    return {
        handleUpload,
        isUploading,
        deleteMediaMutation,
    };
};
