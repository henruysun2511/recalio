import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    role: string;
    username: string;
    iat?: number;
    exp?: number;
}

const ROLE_DASHBOARD: Record<string, string> = {
    ADMIN: "/admin/overview",
    TEACHER: "/teacher/dashboard",
    STUDENT: "/student/dashboard",
};

const ROLE_ROUTES: Record<string, string> = {
    "/admin": "ADMIN",
    "/teacher": "TEACHER",
    "/student": "STUDENT",
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken")?.value;

    let roleName: string | null = null;
    if (accessToken) {
        try {
            const decoded = jwtDecode<JwtPayload>(accessToken);
            roleName = decoded.role;
        } catch {
            // invalid token
        }
    }

    const isAuthenticated = !!roleName;

    // Auth pages — redirect to dashboard if already logged in
    if (pathname.startsWith("/auth/") || pathname === "/auth") {
        if (isAuthenticated) {
            const dashboard = ROLE_DASHBOARD[roleName!] ?? "/admin/overview";
            return NextResponse.redirect(new URL(dashboard, request.url));
        }
        return NextResponse.next();
    }

    // Protected role pages
    for (const [prefix, requiredRole] of Object.entries(ROLE_ROUTES)) {
        if (pathname.startsWith(prefix) || pathname === prefix) {
            if (!isAuthenticated) {
                const loginUrl = new URL("/auth/login", request.url);
                loginUrl.searchParams.set("redirect", pathname);
                return NextResponse.redirect(loginUrl);
            }
            if (roleName !== requiredRole) {
                const dashboard = ROLE_DASHBOARD[roleName!] ?? "/admin/overview";
                return NextResponse.redirect(new URL(dashboard, request.url));
            }
            return NextResponse.next();
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*", "/auth/:path*"],
};
