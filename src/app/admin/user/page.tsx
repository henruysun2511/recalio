"use client";

import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { DataTable } from "@/components/common/data-table";
import { useUsers, useToggleActive, useUpdateUserRole } from "@/queries/useUserQuery";
import { UserProfile, UserQuery } from "@/schemas/user.schema";
import { handleError } from "@/utils/handleError";
import { useState } from "react";
import { toast } from "sonner";
import { getColumns } from "./user-columns";
import { UserFilter } from "./user-filter";

export default function AdminUserPage() {
    const [query, setQuery] = useState<UserQuery>({ page: 1, limit: 10 });
    const { data, isLoading } = useUsers(query);
    const toggleActiveMutation = useToggleActive();
    const updateRoleMutation = useUpdateUserRole();

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingRole, setPendingRole] = useState<{ user: UserProfile; newRole: string } | null>(null);

    const handleToggleActive = async (user: UserProfile) => {
        try {
            await toggleActiveMutation.mutateAsync(user.id, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || `Đã ${user.isActive ? "khóa" : "kích hoạt"} người dùng`);
                },
                onError: (error: any) => {
                    handleError(error, "Không thể thay đổi trạng thái");
                },
            });
        } catch (error) { console.error("Toggle failed", error); }
    };

    const handleRoleChange = (user: UserProfile, newRole: string) => {
        setPendingRole({ user, newRole });
        setConfirmOpen(true);
    };

    const handleConfirmRoleChange = async () => {
        if (!pendingRole) return;
        try {
            await updateRoleMutation.mutateAsync({ id: pendingRole.user.id, data: { role: pendingRole.newRole } }, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Cập nhật vai trò thành công");
                    setConfirmOpen(false);
                    setPendingRole(null);
                },
                onError: (error: any) => {
                    handleError(error, "Không thể cập nhật vai trò");
                },
            });
        } catch (error) { console.error("Role change failed", error); }
    };

    const responseData = ((data as any)?.data || { users: [], total: 0 }) as { users: UserProfile[]; total: number; page: number; limit: number };
    const users = responseData.users || [];
    const total = responseData.total || 0;
    const page = query.page || 1;
    const limit = query.limit || 10;
    const totalPages = Math.ceil(total / limit);

    const columns = getColumns({ onToggleActive: handleToggleActive, onRoleChange: handleRoleChange });

    return (
        <div data-role="admin" className="flex flex-col gap-6 min-h-0">
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1 ml-0.5">
                    Người dùng
                </p>
                <h1 className="text-3xl font-black text-text-primary tracking-tighter leading-none">
                    Quản lý người dùng
                </h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-beige overflow-hidden">
                <UserFilter
                    onSearch={(val) => setQuery((prev) => ({ ...prev, search: val || undefined, page: 1 }))}
                    onFilterChange={(filters) => setQuery((prev) => ({ ...prev, ...filters, page: 1 }))}
                />
                <div className="p-0">
                    <DataTable columns={columns} data={users} loading={isLoading} />
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                onConfirm={handleConfirmRoleChange}
                title="Xác nhận thay đổi vai trò"
                description={`Bạn có chắc chắn muốn thay đổi vai trò của "${pendingRole?.user.username}" từ "${pendingRole?.user.role}" thành "${pendingRole?.newRole}"?`}
                buttonText="Xác nhận"
                loading={updateRoleMutation.isPending}
            />
        </div>
    );
}
