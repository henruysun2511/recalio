"use client";

import { UserRole } from "@/constants/type";
import { UserProfile } from "@/schemas/user.schema";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ColumnProps {
    onToggleActive: (user: UserProfile) => void;
    onRoleChange: (user: UserProfile, newRole: string) => void;
}

export const getColumns = ({ onToggleActive, onRoleChange }: ColumnProps): ColumnDef<UserProfile>[] => [
    {
        accessorKey: "username",
        header: "Tên đăng nhập",
        cell: ({ row }) => (
            <span className="font-mono text-sm font-semibold text-gray-800">{row.original.username}</span>
        ),
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <span className="text-sm text-gray-600">{row.original.email}</span>
        ),
    },
    {
        accessorKey: "displayName",
        header: "Tên hiển thị",
        cell: ({ row }) => (
            <span className="text-sm text-gray-800">{row.original.displayName || "---"}</span>
        ),
    },
    {
        accessorKey: "role",
        header: "Vai trò",
        cell: ({ row }) => (
            <Select
                defaultValue={row.original.role}
                onValueChange={(val) => {
                    if (val !== row.original.role) {
                        onRoleChange(row.original, val);
                    }
                }}
            >
                <SelectTrigger className="w-[130px] h-9 border-gray-300 bg-white shadow-sm text-sm">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent data-role="admin">
                    {Object.values(UserRole).map((role) => (
                        <SelectItem key={role} value={role}>
                            <Badge className={cn(
                                "text-white",
                                role === UserRole.ADMIN && "bg-terracotta text-white",
                                role === UserRole.MODERATOR && "bg-yellow-soft text-text-primary",
                                role === UserRole.USER && "bg-blue-soft text-text-primary",
                            )}>
                                {role}
                            </Badge>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        ),
    },
    {
        accessorKey: "isActive",
        header: "Trạng thái",
        cell: ({ row }) => (
            <Switch
                checked={row.original.isActive}
                onCheckedChange={() => onToggleActive(row.original)}
                size="default"
            />
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
];
