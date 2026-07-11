"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Suggestion } from "@/schemas/suggestion.schema";

interface ColumnProps {
    onMarkRead: (id: string) => void;
}

export const getColumns = ({ onMarkRead }: ColumnProps): ColumnDef<Suggestion>[] => [
    {
        accessorKey: "content",
        header: "Nội dung",
        cell: ({ row }) => (
            <div className="flex items-center gap-3 max-w-[400px]">
                {!row.original.isRead && (
                    <span className="size-2 shrink-0 rounded-full bg-blue-500" />
                )}
                <span className={cn(
                    "text-sm",
                    row.original.isRead ? "text-gray-500" : "font-semibold text-gray-900"
                )}>
                    {row.original.content}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "user",
        header: "Người gửi",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.original.user?.displayName || row.original.user?.username || "---"}
            </span>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">
                {row.original.email || "---"}
            </span>
        ),
    },
    {
        accessorKey: "isRead",
        header: "Trạng thái",
        cell: ({ row }) => (
            <Badge className={cn(
                "text-xs font-medium",
                row.original.isRead
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
            )}>
                {row.original.isRead ? "Đã đọc" : "Chưa đọc"}
            </Badge>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Ngày gửi",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">
                {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
            </span>
        ),
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => {
            const suggestion = row.original;
            if (suggestion.isRead) return null;
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkRead(suggestion.id)}
                    className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                    <CheckCheck className="size-4" />
                    Đã đọc
                </Button>
            );
        },
    },
];
