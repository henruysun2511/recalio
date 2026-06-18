"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (useAuthStore.persist.hasHydrated()) {
            setReady(true);
            return;
        }
        const unsub = useAuthStore.persist.onFinishHydration(() => {
            setReady(true);
        });
        return unsub;
    }, []);

    if (!ready) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-peach-light gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-terracotta" />
                <p className="text-sm font-bold text-text-muted tracking-wide animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}
