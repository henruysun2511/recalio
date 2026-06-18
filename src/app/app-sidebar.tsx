"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Home,
    BookOpen,
    Layers,
    Sparkles,
    BarChart3,
    Trophy,
    Settings,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Study",
        url: "/study",
        icon: BookOpen,
    },
    {
        title: "Decks",
        url: "/decks",
        icon: Layers,
    },
    {
        title: "AI Generate",
        url: "/ai",
        icon: Sparkles,
    },
    {
        title: "Statistics",
        url: "/analytics",
        icon: BarChart3,
    },
    {
        title: "Achievements",
        url: "/achievements",
        icon: Trophy,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar
            collapsible="icon"
            className="border-r-0 bg-transparent"
        >
            <SidebarContent className="bg-transparent p-4">

                <div className="h-full rounded-[36px] bg-gradient-to-b from-orange-500 to-orange-400 shadow-xl">

                    {/* Logo */}
                    <div className="flex items-center justify-center py-8">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                            <BookOpen className="h-7 w-7 text-white" />
                        </div>
                    </div>

                    {/* Menu */}
                    <SidebarGroup>
                        <SidebarMenu className="gap-3 px-3">

                            {items.map((item) => {
                                const active = pathname === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            className={`
                        h-12 rounded-2xl transition-all
                        ${active
                                                    ? "bg-white text-orange-600 shadow-md hover:bg-white"
                                                    : "text-white hover:bg-white/15 hover:text-white"
                                                }
                      `}
                                        >
                                            <Link href={item.url}>
                                                <item.icon className="h-5 w-5" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}

                        </SidebarMenu>
                    </SidebarGroup>

                    {/* Footer */}
                    <SidebarFooter className="mt-auto p-3">

                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip="Settings"
                                    className="
                    h-12 rounded-2xl
                    text-white
                    hover:bg-white/15
                    hover:text-white
                  "
                                >
                                    <Link href="/settings">
                                        <Settings className="h-5 w-5" />
                                        <span>Settings</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>

                    </SidebarFooter>

                </div>

            </SidebarContent>
        </Sidebar>
    );
}