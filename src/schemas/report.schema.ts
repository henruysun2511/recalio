import { ReportReason, ReportStatus } from "@/constants/type";
import { z } from "zod";

export const reportSchema = z.object({
    id: z.string().uuid(),
    deckId: z.string().uuid(),
    reportedBy: z.string().uuid(),
    reason: z.nativeEnum(ReportReason),
    description: z.string().nullable().optional(),
    status: z.nativeEnum(ReportStatus),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type Report = z.infer<typeof reportSchema>;

export const createReportSchema = z.object({
    reason: z.nativeEnum(ReportReason),
    description: z.string().optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;

export const reportParamsSchema = z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20),
});

export type ReportParams = z.infer<typeof reportParamsSchema>;

export const updateReportStatusSchema = z.object({
    status: z.nativeEnum(ReportStatus),
});

export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;
