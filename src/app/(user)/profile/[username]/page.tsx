"use client"

import { useParams } from "next/navigation"
import { BookOpen, BarChart3, Medal, Loader2, UserX, UserMinus, Plus, Users, UserPlus, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/common/empty-state"
import { usePublicProfile } from "@/queries/useUserQuery"
import { useFollowStatus, useFollowUser, useUnfollowUser } from "@/queries/useFollowQuery"
import { ProfileView } from "../profile-view"
import { ProfilePostsTab } from "../profile-posts-tab"
import { ProfileStatsTab } from "../profile-stats-tab"
import { ProfileDecksTab } from "../profile-decks-tab"
import { ProfileAchievementsTab } from "../profile-achievements-tab"
import { ProfileFollowersTab } from "../profile-followers-tab"
import { ProfileFollowingTab } from "../profile-following-tab"


export default function PublicProfilePage() {
    const { username } = useParams<{ username: string }>()
    const { data: res, isLoading } = usePublicProfile(username)
    const u = res?.data
    const { data: statusRes } = useFollowStatus(u?.id ?? "")
    const followUser = useFollowUser()
    const unfollowUser = useUnfollowUser()
    const isFollowing = statusRes?.data?.isFollowing ?? false

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="size-8 animate-spin text-terracotta" />
            </div>
        )
    }

    if (!u) {
        return <EmptyState icon={<UserX className="size-10 text-terracotta" />} title="Người dùng không tồn tại" description="Liên kết có thể sai hoặc tài khoản đã bị xóa." />
    }

    const heroAction = isFollowing ? (
        <button
            onClick={() => unfollowUser.mutate(u.id)}
            disabled={unfollowUser.isPending}
            className="flex items-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50"
        >
            {unfollowUser.isPending ? <Loader2 className="size-4 animate-spin" /> : <UserMinus className="size-4" />}
            Bỏ follow
        </button>
    ) : (
        <button
            onClick={() => followUser.mutate(u.id)}
            disabled={followUser.isPending}
            className="flex items-center gap-2 rounded-xl bg-terracotta px-5 py-2.5 text-sm font-bold text-white hover:bg-terracotta-dark transition-colors shadow-sm disabled:opacity-50"
        >
            {followUser.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Follow
        </button>
    )

    return (
        <ProfileView
            user={u}
            isOwn={false}
            heroAction={heroAction}
            tabs={
                <Tabs defaultValue="stats" className="w-full space-y-6">
                    <div className="scrollbar-none overflow-x-auto pb-1">
                        <TabsList className="inline-flex h-auto rounded-2xl border border-beige bg-white p-1.5 shadow-sm">
                            <TabsTrigger value="stats" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                                <BarChart3 className="size-4 mr-2" /> Thống kê
                            </TabsTrigger>
                            <TabsTrigger value="decks" className="rounded-xl px-4 py-2.5 text-sm font-bold text-text-muted data-[state=active]:bg-cream data-[state=active]:text-terracotta">
                                <BookOpen className="size-4 mr-2" /> Bộ thẻ public
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
                        </TabsList>
                    </div>
                    <TabsContent value="stats"><ProfileStatsTab userId={u.id} /></TabsContent>
                    <TabsContent value="decks"><ProfileDecksTab userId={u.id} /></TabsContent>
                    <TabsContent value="achievements"><ProfileAchievementsTab userId={u.id} /></TabsContent>
                    <TabsContent value="posts"><ProfilePostsTab userId={u.id} /></TabsContent>
                    <TabsContent value="followers"><ProfileFollowersTab userId={u.id} /></TabsContent>
                    <TabsContent value="following"><ProfileFollowingTab userId={u.id} /></TabsContent>
                </Tabs>
            }
        />
    )
}