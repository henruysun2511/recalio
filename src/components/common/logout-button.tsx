"use client";

import { useLogout } from "@/queries/useAuthQuery";
import { handleError } from "@/utils/handleError";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface LogoutButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    showConfirm?: boolean;
    confirmTitle?: string;
    confirmDescription?: string;
    collapsed?: boolean;
}

export function LogoutButton({
    showConfirm = true,
    confirmTitle = "Đăng xuất",
    confirmDescription = "Bạn có chắc chắn muốn đăng xuất?",
    collapsed = false,
    className,
    children,
    ...props
}: LogoutButtonProps) {
    const logoutMutation = useLogout();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync(undefined, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Đăng xuất thành công");
                },
                onError: (error: any) => {
                    handleError(error, "Đăng xuất thất bại");
                },
            });
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleClick = () => {
        if (showConfirm) {
            setConfirmOpen(true);
        } else {
            handleLogout();
        }
    };

    const button = (
        <button
            onClick={handleClick}
            disabled={logoutMutation.isPending}
            className={cn(
                "flex h-12 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition-all w-full",
                collapsed && "justify-center px-0",
                "text-white/80 hover:bg-white hover:text-black",
                className
            )}
            {...(props as any)}
        >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && (children || <span>Đăng xuất</span>)}
        </button>
    );

    return (
        <>
            {collapsed ? (
                <Tooltip>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="right" align="center">
                        Đăng xuất
                    </TooltipContent>
                </Tooltip>
            ) : button}

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                onConfirm={handleLogout}
                loading={logoutMutation.isPending}
                title={confirmTitle}
                description={confirmDescription}
                buttonText="Xác nhận đăng xuất"
            />
        </>
    );
}
