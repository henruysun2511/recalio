import { ApiResponse } from "@/constants/apiResponse";
import http from "@/utils/http";
import { DeleteMediaInput, UploadMediaResponse } from "@/schemas/cloudinary.schema";

const prefix = "/cloudinaries";

const cloudinaryService = {
    upload: (file: File, folder?: string) => {
        const formData = new FormData();
        formData.append("file", file);
        if (folder) formData.append("folder", folder);
        return http.post<ApiResponse<UploadMediaResponse>>(`${prefix}/media`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    delete: (data: DeleteMediaInput) => {
        return http.delete<ApiResponse<null>>(`${prefix}/media`, { config: { data } });
    },
};

export default cloudinaryService;
