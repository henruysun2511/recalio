"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import { AchievementResponse } from "@/schemas/achievement.schema";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ColumnProps {
    onEdit: (achievement: AchievementResponse) => void;
    onDelete: (achievement: AchievementResponse) => void;
}

const CONDITION_LABELS: Record<string, string> = {
    streak: "Streak",
    reviews: "Lượt ôn",
    cards: "Thẻ",
    xp: "XP",
};

export const getColumns = ({ onEdit, onDelete }: ColumnProps): ColumnDef<AchievementResponse>[] => [
    {
        accessorKey: "key",
        header: "Key",
        cell: ({ row }) => (
            <span className="font-mono text-sm font-semibold text-gray-800">{row.original.key}</span>
        ),
    },
    {
        accessorKey: "name",
        header: "Tên",
        cell: ({ row }) => (
            <span className="text-sm font-medium text-gray-800">{row.original.name}</span>
        ),
    },
    {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500 max-w-[200px] truncate block">
                {row.original.description}
            </span>
        ),
    },
    {
        accessorKey: "xpReward",
        header: "XP",
        cell: ({ row }) => (
            <Badge variant="secondary" className="text-xs">
                +{row.original.xpReward} XP
            </Badge>
        ),
    },
    {
        accessorKey: "condition",
        header: "Điều kiện",
        cell: ({ row }) => {
            const c = row.original.condition;
            return (
                <Badge variant="outline" className="text-xs border-gray-300">
                    {CONDITION_LABELS[c.type] || c.type}: {c.value}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => {
            const achievement = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(achievement)} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(achievement)}
                            className="flex items-center gap-2 text-red-600 focus:text-red-600"
                        >
                            <Trash2 className="h-4 w-4" />
                            Xoá
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];