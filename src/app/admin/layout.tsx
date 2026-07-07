"use client"

import { PanelLeftClose, PanelLeft } from "lucide-react"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminSidebarRight } from "@/components/admin/admin-sidebar-right"
import { SidebarToggle } from "@/components/common/sidebar-toggle"



export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="h-dvh w-full min-h-0 bg-peach-light p-3 md:p-6 overflow-hidden">
                <div className="mx-auto flex w-full h-full min-h-0 flex-col md:flex-row gap-0 overflow-hidden rounded-none md:rounded-[32px] bg-cream">

                    {/* Left Sidebar */}
                    <div className="hidden md:flex h-full min-h-0 shrink-0 overflow-y-auto">
                        <AdminSidebar />
                    </div>

                    {/* Main Content Area */}
                    <main className="flex h-full min-h-0 flex-1 flex-col bg-cream p-4 md:p-8 overflow-hidden">
                        <div className="flex items-center gap-2 pb-4 shrink-0">
                            <SidebarToggle />
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto w-full space-y-4">
                            {children}
                        </div>
                    </main>

                    {/* Right Sidebar */}
                    <div className="hidden lg:flex h-full min-h-0 shrink-0 overflow-y-auto">
                        <AdminSidebarRight />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}