"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

import { useAuthStore } from "@/stores/useAuthStore";
import { UserRole } from "@/constants/type";
import { ACCESS_TOKEN_KEY } from "@/constants/api";
import { BookOpen, Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const userId = searchParams.get("userId");
        const username = searchParams.get("username");
        const displayName = searchParams.get("displayName");
        const avatarUrl = searchParams.get("avatarUrl");
        const role = searchParams.get("role");

        if (!accessToken || !username || !userId) {
            router.replace("/login");
            return;
        }

        const user = {
            id: userId,
            username,
            email: "",
            displayName: displayName || username,
            avatarUrl: avatarUrl || null,
            isActive: true,
            createdAt: "",
            updatedAt: "",
            role: role as UserRole,
        };

        const authStore = useAuthStore.getState();

        authStore.setAuth(user, accessToken);

        if (refreshToken) {
            authStore.setRefreshToken(refreshToken);
        }

        Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
            expires: 7,
        });

        if (role === UserRole.ADMIN) {
            router.replace("/admin/overview");
        } else {
            router.replace("/overview");
        }
    }, [router, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center ">
            <div className="w-full max-w-md rounded-[36px] border border-beige bg-cream p-10 text-center">
                {/* Logo */}
                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-[28px] bg-terracotta">
                    <BookOpen className="size-10 text-white" />
                </div>

                {/* Loading */}
                <div className="mb-6 flex justify-center">
                    <Loader2 className="size-8 animate-spin text-terracotta" />
                </div>

                {/* Content */}
                <h1 className="mb-2 text-2xl font-bold text-text-primary">
                    Đang đăng nhập...
                </h1>

                <p className="mx-auto max-w-xs text-sm leading-relaxed text-text-muted">
                    Chúng tôi đang xác thực tài khoản Google của bạn và thiết lập phiên
                    học tập.
                </p>

                {/* Progress */}
                <div className="mt-8 h-2 overflow-hidden rounded-full bg-beige">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-terracotta" />
                </div>

                <p className="mt-4 text-xs text-text-muted">
                    Quá trình này chỉ mất vài giây
                </p>
            </div>
        </div>
    );
}