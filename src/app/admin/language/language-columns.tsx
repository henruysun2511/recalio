"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Language } from "@/schemas/language.schema";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVerticalIcon, PencilIcon, TrashIcon, GlobeIcon } from "lucide-react";

interface ColumnProps {
    onEdit: (lang: Language) => void;
    onDelete: (id: string) => void;
}

export const getColumns = ({ onEdit, onDelete }: ColumnProps): ColumnDef<Language>[] => [
    {
        accessorKey: "id",
        header: "Mã ngôn ngữ",
        cell: ({ row }) => (
            <span className="font-mono text-sm font-semibold text-gray-800">{row.original.id}</span>
        ),
    },
    {
        accessorKey: "name",
        header: "Tên ngôn ngữ",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <span className="text-lg">{row.original.flagEmoji || "🌐"}</span>
                <span className="font-semibold text-gray-800">{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "nativeName",
        header: "Tên bản ngữ",
        cell: ({ row }) => (
            <span className="text-gray-500">{row.original.nativeName || "---"}</span>
        ),
    },
    {
        accessorKey: "isSupported",
        header: "Trạng thái",
        cell: ({ row }) => (
            <Badge className={row.original.isSupported ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"}>
                {row.original.isSupported ? "Hỗ trợ" : "Không hỗ trợ"}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-right pr-6">Thao tác</div>,
        cell: ({ row }) => (
            <div className="text-right pr-6">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-9">
                            <MoreVerticalIcon className="size-5 text-gray-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(row.original)}>
                            <PencilIcon className="mr-2 size-4" /> Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(row.original.id)} className="text-red-600">
                            <TrashIcon className="mr-2 size-4" /> Xóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];
