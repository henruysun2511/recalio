"use client";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Post } from "@/schemas/post.schema";

interface ColumnProps {
    onToggleBan: (id: string, currentBanned: boolean, title: string) => void;
}

export const getColumns = ({ onToggleBan }: ColumnProps): ColumnDef<Post>[] => [
    {
        accessorKey: "title",
        header: "Tiêu đề",
        cell: ({ row }) => (
            <span className="text-sm font-semibold text-gray-800 max-w-[300px] truncate block">
                {row.original.title}
            </span>
        ),
    },
    {
        accessorKey: "user.displayName",
        header: "Tác giả",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.original.user?.displayName || row.original.user?.username || "---"}
            </span>
        ),
    },
    {
        accessorKey: "tags",
        header: "Tags",
        cell: ({ row }) => (
            <div className="flex flex-wrap gap-1 max-w-[200px]">
                {row.original.tags?.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {tag}
                    </Badge>
                ))}
                {(row.original.tags?.length || 0) > 3 && (
                    <span className="text-[10px] text-gray-400">+{row.original.tags.length - 3}</span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "likeCount",
        header: "Lượt thích",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">{row.original.likeCount}</span>
        ),
    },
    {
        accessorKey: "isBanned",
        header: "Trạng thái",
        cell: ({ row }) => (
            <Badge className={cn(
                "text-xs font-medium",
                row.original.isBanned
                    ? "bg-red-100 text-red-700 border-red-300"
                    : "bg-green-100 text-green-700 border-green-300"
            )}>
                {row.original.isBanned ? "Đã cấm" : "Hoạt động"}
            </Badge>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Ngày tạo",
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
            const post = row.original;
            return (
                <Switch
                    checked={!post.isBanned}
                    onCheckedChange={() => onToggleBan(post.id, post.isBanned, post.title)}
                    size="default"
                />
            );
        },
    },
];
