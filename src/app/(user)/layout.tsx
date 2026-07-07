"use client"

import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { UserSidebar } from "@/components/user/user-sidebar"
import { UserHeader } from "@/components/user/user-header"
import { ReactNode } from "react"

function UserLayoutInner({ children }: { children: ReactNode }) {
    const { state } = useSidebar()
    const collapsed = state === "collapsed"

    return (
        <div className="h-dvh w-full min-h-0 bg-peach-light p-3 md:p-6 overflow-hidden">
            <div className="mx-auto flex w-full h-full min-h-0 flex-col md:flex-row gap-0 overflow-hidden rounded-none md:rounded-[32px] bg-cream">
                {/* Left Sidebar */}
                <div className="hidden md:flex h-full min-h-0 shrink-0 overflow-y-auto">
                    <UserSidebar collapsed={collapsed} />
                </div>

                {/* Main Content */}
                <main className="flex h-full min-h-0 flex-1 flex-col bg-cream p-10 md:p-10  overflow-hidden">
                    <UserHeader />

                    <div className="flex-1 min-h-0 overflow-y-auto w-full mt-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default function UserLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <UserLayoutInner>
                {children}
            </UserLayoutInner>
        </SidebarProvider>
    )
}
