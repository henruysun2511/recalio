"use client"

import { Medal, BookOpen, BarChart3, Settings, Users, UserPlus, Loader2, UserX, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/common/empty-state"
import { useMyProfile } from "@/queries/useUserQuery"
import { ProfileView } from "./profile-view"
import { ProfileStatsTab } from "./profile-stats-tab"
import { ProfileDecksTab } from "./profile-decks-tab"
import { ProfileAchievementsTab } from "./profile-achievements-tab"
import { ProfileSettingsTab } from "./profile-settings-tab"
import { ProfileFollowersTab } from "./profile-followers-tab"
import { ProfileFollowingTab } from "./profile-following-tab"
import { ProfilePostsTab } from "./profile-posts-tab"

export default function ProfilePage() {
    const { data: res, isLoading } = useMyProfile()
    const u = res?.data

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="size-8 animate-spin text-terracotta" />
            </div>
        )
    }

    if (!u) {
        return <EmptyState icon={<UserX className="size-10 text-terracotta" />} title="Không thể tải thông tin người dùng" description="Vui lòng thử lại sau." />
    }

    return (
        <ProfileView
            user={u}
            isOwn={true}
            tabs={
                <Tabs defaultValue="stats" className="w-full space-y-6">
                    <div className="scrollbar-none overflow-x-auto pb-1">
                        <TabsList className="inline-flex h-auto rounded-2xl border border-beige bg-white p-1.5 shadow-sm">
                            <TabsTrigger value="stats" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                                <BarChart3 className="size-4 mr-2" /> Thống kê
                            </TabsTrigger>
                            <TabsTrigger value="decks" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                                <BookOpen className="size-4 mr-2" /> Bộ thẻ
                            </TabsTrigger>
                            <TabsTrigger value="achievements" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                                <Medal className="size-4 mr-2" /> Thành tích
                            </TabsTrigger>
                            <TabsTrigger value="posts" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                                <FileText className="size-4 mr-2" /> Bài đăng
                            </TabsTrigger>
                            <TabsTrigger value="followers" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                                <Users className="size-4 mr-2" /> Người theo dõi
                            </TabsTrigger>
                            <TabsTrigger value="following" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                                <UserPlus className="size-4 mr-2" /> Đang theo dõi
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                                <Settings className="size-4 mr-2" /> Cài đặt
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="stats"><ProfileStatsTab /></TabsContent>
                    <TabsContent value="decks"><ProfileDecksTab /></TabsContent>
                    <TabsContent value="achievements"><ProfileAchievementsTab /></TabsContent>
                    <TabsContent value="posts"><ProfilePostsTab userId={u.id} currentUserId={u.id} /></TabsContent>
                    <TabsContent value="followers"><ProfileFollowersTab userId={u.id} /></TabsContent>
                    <TabsContent value="following"><ProfileFollowingTab userId={u.id} /></TabsContent>
                    <TabsContent value="settings"><ProfileSettingsTab /></TabsContent>
                </Tabs>
            }
        />
    )
}
