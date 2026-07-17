import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface JwtPayload {
    sub: string;
    role: string;
    username: string;
    iat?: number;
    exp?: number;
}

function safeDecodeToken(token: string): JwtPayload | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        return decoded;
    } catch {
        return null;
    }
}

function isUserRoute(pathname: string): boolean {
    return (
        pathname.startsWith("/overview") ||
        pathname.startsWith("/community") ||
        pathname.startsWith("/deck") ||
        pathname.startsWith("/document") ||
        pathname.startsWith("/suggestion") ||
        pathname.startsWith("/profile") ||
        pathname.startsWith("/study") ||
        pathname.startsWith("/search")
    )
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("accessToken")?.value;

    let role: string | null = null;
    if (accessToken) {
        const decoded = safeDecodeToken(accessToken);
        role = decoded?.role ?? null;
    }

    const isAuthenticated = !!role;

    // Auth pages — redirect to overview if already logged in
    if (pathname.startsWith("/auth/")) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/overview", request.url));
        }
        return NextResponse.next();
    }

    // Public routes — allow all
    if (pathname === "/" || pathname.startsWith("/test-ui")) {
        return NextResponse.next();
    }

    // Admin routes — require ADMIN role
    if (pathname.startsWith("/admin")) {
        if (!isAuthenticated) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
        if (role !== "ADMIN") {
            return NextResponse.redirect(new URL("/overview", request.url));
        }
        return NextResponse.next();
    }

    // User routes — require any authenticated role
    if (isUserRoute(pathname)) {
        if (!isAuthenticated) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon\\.svg|manifest\\.json|.*\\.png$).*)",
    ],
};
