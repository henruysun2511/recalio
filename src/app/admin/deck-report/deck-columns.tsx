"use client";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ReportReason, ReportStatus } from "@/constants/type";

interface ReportRow {
    id: string;
    deckId: string;
    reason: ReportReason;
    description: string | null;
    status: ReportStatus;
    createdAt: string;
    deck: { id: string; name: string; isBanned: boolean };
    reportedBy: { id: string; username: string; displayName: string | null };
}

interface ColumnProps {
    onToggleBan: (deckId: string, currentBanned: boolean, deckName: string) => void;
}

const statusStyles: Record<string, string> = {
    [ReportStatus.PENDING]: "bg-yellow-100 text-yellow-800 border-yellow-300",
    [ReportStatus.REVIEWED]: "bg-blue-100 text-blue-800 border-blue-300",
    [ReportStatus.DISMISSED]: "bg-gray-100 text-gray-600 border-gray-300",
    [ReportStatus.ACTION_TAKEN]: "bg-green-100 text-green-800 border-green-300",
};

const reasonStyles: Record<string, string> = {
    [ReportReason.COPYRIGHT]: "bg-purple-100 text-purple-800 border-purple-300",
    [ReportReason.SPAM]: "bg-orange-100 text-orange-800 border-orange-300",
    [ReportReason.INAPPROPRIATE]: "bg-red-100 text-red-800 border-red-300",
    [ReportReason.OTHER]: "bg-gray-100 text-gray-600 border-gray-300",
};

export const getColumns = ({ onToggleBan }: ColumnProps): ColumnDef<ReportRow>[] => [
    {
        accessorKey: "deck.name",
        header: "Deck",
        cell: ({ row }) => (
            <span className="font-mono text-sm font-semibold text-gray-800">
                {row.original.deck.name}
            </span>
        ),
    },
    {
        accessorKey: "reason",
        header: "Lý do",
        cell: ({ row }) => (
            <Badge className={cn("border text-xs font-medium", reasonStyles[row.original.reason] || "")}>
                {row.original.reason}
            </Badge>
        ),
    },
    {
        accessorKey: "reportedBy.username",
        header: "Người báo cáo",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">
                {row.original.reportedBy?.displayName || row.original.reportedBy?.username || "---"}
            </span>
        ),
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
            <Badge className={cn("border text-xs font-medium", statusStyles[row.original.status] || "")}>
                {row.original.status}
            </Badge>
        ),
    },
    {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => (
            <span className="text-sm text-gray-500 max-w-[200px] truncate block">
                {row.original.description || "---"}
            </span>
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
            const deck = row.original.deck;
            return (
                <Switch
                    checked={!deck.isBanned}
                    onCheckedChange={() => onToggleBan(deck.id, deck.isBanned, deck.name)}
                    size="default"
                />
            );
        },
    },
];
