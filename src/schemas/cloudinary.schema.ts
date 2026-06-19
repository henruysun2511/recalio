import { z } from "zod";

export const uploadMediaResponseSchema = z.object({
    url: z.string().url(),
    publicId: z.string(),
});

export type UploadMediaResponse = z.infer<typeof uploadMediaResponseSchema>;

export const deleteMediaSchema = z.object({
    publicId: z.string().min(1, "Public ID is required"),
    resourceType: z.enum(["image", "video", "raw", "auto"]).default("image"),
});

export type DeleteMediaInput = z.infer<typeof deleteMediaSchema>;
