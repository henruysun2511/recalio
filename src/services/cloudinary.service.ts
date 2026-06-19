import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { DeleteMediaInput, UploadMediaResponse } from "@/schemas/cloudinary.schema";

const cloudinaryService = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return http.post<ApiResponse<UploadMediaResponse>>("/cloudinaries/media", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    delete: (data: DeleteMediaInput) => {
        return http.delete<ApiResponse<null>>("/cloudinaries/media", { config: { data } });
    },
};

export default cloudinaryService;
