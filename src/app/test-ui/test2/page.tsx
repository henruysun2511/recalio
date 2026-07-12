export const colors = {
    terracotta: "#D97D56",
    terracottaDark: "#C96A42",

    cream: "#FCF6EA",
    white: "#FFFFFF",

    beige: "#F6EBDD",

    text: "#2E2E2E",
    textMuted: "#8D8D8D",

    green: "#DCE9D8",
    peach: "#F4D6C8",
    yellow: "#F8E4B5",
}

// app/dashboard/page.tsx

import {
    Bell,
    Home,
    Calendar,
    User,
    Menu,
    Heart,
    ClipboardList,
} from "lucide-react"
import { ProfileSidebar } from "./d"
import { CenterContent } from "./b"

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-peach-light p-6">
            <div className="mx-auto flex max-w-7xl overflow-hidden rounded-[32px] bg-cream">

                {/* LEFT SIDEBAR */}
                <aside className="w-[90px] bg-terracotta py-8">
                    <div className="flex h-full flex-col items-center justify-between">
                        <div className="space-y-8">
                            <Menu className="h-5 w-5 text-white" />

                            <div className="space-y-6">
                                <Home className="mx-auto h-5 w-5 text-white" />
                                <Calendar className="mx-auto h-5 w-5 text-white" />
                                <ClipboardList className="mx-auto h-5 w-5 text-white" />
                                <User className="mx-auto h-5 w-5 text-white" />
                                <Heart className="mx-auto h-5 w-5 text-white" />
                            </div>
                        </div>

                        <Bell className="h-5 w-5 text-white" />
                    </div>
                </aside>

                {/* CENTER */}
                <main className="flex-1 bg-cream p-8">
                    <CenterContent />
                </main>

                {/* RIGHT */}
                <aside className="w-[320px] bg-white p-6">
                    <ProfileSidebar />
                </aside>
            </div>
        </div>
    )
}

function HeroBanner() {
    return (
        <div className="relative overflow-hidden rounded-[28px]">
            <img
                src="/images/autumn-banner.jpg"
                alt=""
                className="h-[260px] w-full object-cover"
            />

            <div className="absolute bottom-0 left-0 w-full rounded-t-[24px] bg-terracotta p-6 text-white">
                <h2 className="text-3xl font-semibold">
                    Autumn Day
                </h2>

                <p className="mt-1 text-white/90">
                    Hello Jack
                </p>
            </div>
        </div>
    )
}