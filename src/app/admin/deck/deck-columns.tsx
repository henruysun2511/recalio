"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeckResponse } from "@/schemas/deck.schema";

interface ColumnProps {
    onToggleFeature: (deck: DeckResponse) => void;
}

export const getColumns = ({ onToggleFeature }: ColumnProps): ColumnDef<DeckResponse>[] => [
    {
        accessorKey: "name",
        header: "Deck",
        cell: ({ row }) => (
            <span className="font-mono text-sm font-semibold text-gray-800">
                {row.original.name}
            </span>
        ),
    },
    {
        accessorKey: "user.displayName",
        header: "Chủ sở hữu",
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
            <span className="text-sm text-gray-500">
                {row.original.tags?.length ? row.original.tags.join(", ") : "---"}
            </span>
        ),
    },
    {
        accessorKey: "downloadCount",
        header: "Lượt tải",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">{row.original.downloadCount}</span>
        ),
    },
    {
        id: "cards",
        header: "Lượt thẻ",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500">{row.original._count?.cards ?? 0}</span>
        ),
    },
    {
        id: "actions",
        header: "Nổi bật",
        cell: ({ row }) => {
            const deck = row.original;
            return (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFeature(deck)}
                    className={cn("p-1 h-8 w-8", deck.isFeatured && "text-yellow-500")}
                >
                    <Star className={cn("size-5", deck.isFeatured ? "fill-yellow-500" : "fill-none")} />
                </Button>
            );
        },
    },
];
