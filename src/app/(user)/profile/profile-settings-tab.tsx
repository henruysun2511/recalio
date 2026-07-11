"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Trash2, AlertTriangle, ChevronRight,
    Loader2, Eye, EyeOff, Lock, Camera, Bell, Clock,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/common/user-avatar"
import { useMyProfile, useUpdateProfile, useDeleteAccount } from "@/queries/useUserQuery"
import { useChangePassword } from "@/queries/useAuthQuery"
import { useNotificationSettings, useUpdateNotificationSettings } from "@/queries/useNotificationQuery"
import { useDailyGoal, useUpdateDailyGoal } from "@/queries/useGamificationQuery"
import { useAuthStore } from "@/stores/useAuthStore"
import cloudinaryService from "@/services/cloudinary.service"
import { handleError } from "@/utils/handleError"
import type { UserProfile } from "@/schemas/user.schema"
import Cookies from "js-cookie"

const ACCESS_TOKEN_KEY = "accessToken"

const TIMEZONES = [
    "Asia/Ho_Chi_Minh", "Asia/Bangkok", "Asia/Singapore",
    "Asia/Tokyo", "Asia/Seoul", "Asia/Hong_Kong",
    "Australia/Sydney", "America/New_York", "America/Chicago",
    "America/Los_Angeles", "Europe/London", "Europe/Paris", "Europe/Berlin",
]

function PersonalInfoForm({ profile }: { profile: UserProfile }) {
    const [displayName, setDisplayName] = useState(profile.displayName)
    const [bio, setBio] = useState(profile.bio ?? "")
    const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "")
    const [timezone, setTimezone] = useState(profile.timezone ?? "Asia/Ho_Chi_Minh")
    const [uploadingImage, setUploadingImage] = useState(false)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const updateProfile = useUpdateProfile()

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            setUploadingImage(true)
            const res = await cloudinaryService.upload(file)
            const result = (res as { data?: { data?: { secure_url?: string; url?: string } } })?.data?.data
            const url = result?.secure_url ?? result?.url ?? null
            if (url) setAvatarUrl(url)
        } catch (error) {
            handleError(error, "Upload ảnh thất bại")
        } finally {
            setUploadingImage(false)
            if (imageInputRef.current) imageInputRef.current.value = ""
        }
    }

    const handleSave = () => {
        updateProfile.mutate({
            displayName,
            bio: bio || undefined,
            avatarUrl: avatarUrl || undefined,
            timezone,
        })
    }

    return (
        <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-text-primary mb-4">Thông tin cá nhân</h3>
            <div className="space-y-4 max-w-lg">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <UserAvatar avatarUrl={avatarUrl} fullName={displayName} username={profile.username} className="size-16 border-2 border-beige" />
                        <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-terracotta text-white shadow-sm hover:bg-terracotta-dark transition-colors disabled:opacity-50"
                        >
                            {uploadingImage ? <Loader2 className="size-3.5 animate-spin" /> : <Camera className="size-3.5" />}
                        </button>
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                    <div className="text-xs text-text-muted">
                        <p className="font-bold text-text-primary text-sm">@{profile.username}</p>
                        <p className="mt-0.5">{profile.email}</p>
                    </div>
                </div>
                <InputField label="Tên hiển thị" value={displayName} onChange={setDisplayName} />
                <InputField label="Bio" value={bio} onChange={setBio} multiline />
                <div>
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Múi giờ</label>
                    <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full h-10 rounded-xl border border-beige bg-white px-3 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                    >
                        {TIMEZONES.map((tz) => (
                            <option key={tz} value={tz}>{tz}</option>
                        ))}
                    </select>
                </div>
                <div className="pt-2">
                    <Button onClick={handleSave} disabled={updateProfile.isPending} className="rounded-xl">
                        {updateProfile.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                    {updateProfile.isSuccess && (
                        <span className="ml-3 text-xs font-bold text-green-600">Đã lưu</span>
                    )}
                </div>
            </div>
        </section>
    )
}

function NotificationSettingsForm() {
    const { data: settingsData, isLoading } = useNotificationSettings()
    const updateSettings = useUpdateNotificationSettings()

    const settings = settingsData?.data

    const handleToggle = (key: "emailEnabled" | "pushEnabled" | "studyReminder", value: boolean) => {
        updateSettings.mutate({ [key]: value })
    }

    const handleReminderTime = (time: string) => {
        updateSettings.mutate({ reminderTime: time })
    }

    if (isLoading) {
        return (
            <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-text-primary mb-4">Thông báo</h3>
                <p className="text-sm text-text-muted">Đang tải...</p>
            </section>
        )
    }

    const toggles = [
        { key: "emailEnabled" as const, label: "Email" },
        { key: "pushEnabled" as const, label: "Push" },
        { key: "studyReminder" as const, label: "Nhắc học hàng ngày" },
    ]

    return (
        <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-black text-text-primary mb-4">
                <Bell className="size-5 text-terracotta" /> Thông báo
            </h3>
            <div className="space-y-3 max-w-lg">
                {toggles.map(({ key, label }) => (
                    <ToggleRow
                        key={key}
                        label={label}
                        enabled={settings?.[key] ?? false}
                        onChange={(v) => handleToggle(key, v)}
                    />
                ))}
                {settings?.studyReminder && (
                    <div className="flex items-center justify-between rounded-xl border border-beige px-4 py-3">
                        <span className="font-bold text-text-primary">Giờ nhắc</span>
                        <div className="flex items-center gap-2">
                            <Clock className="size-4 text-text-muted" />
                            <input
                                type="time"
                                value={settings.reminderTime ?? "20:00"}
                                onChange={(e) => handleReminderTime(e.target.value)}
                                className="h-9 rounded-lg border border-beige bg-white px-2 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                            />
                        </div>
                    </div>
                )}
                {updateSettings.isSuccess && (
                    <p className="text-xs font-bold text-green-600">Đã lưu</p>
                )}
                {updateSettings.isError && (
                    <p className="text-xs font-bold text-red-500">Lưu thất bại</p>
                )}
            </div>
        </section>
    )
}

function StudyGoalsFormInner({ goal }: { goal: { targetReviews: number; targetNewCards: number } }) {
    const [targetReviews, setTargetReviews] = useState(goal.targetReviews)
    const [targetNewCards, setTargetNewCards] = useState(goal.targetNewCards)
    const updateGoal = useUpdateDailyGoal()

    const handleSave = (key: "targetReviews" | "targetNewCards", value: number) => {
        updateGoal.mutate({ [key]: value })
    }

    return (
        <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-text-primary mb-4">Mục tiêu học tập</h3>
            <div className="space-y-4 max-w-lg">
                <SliderField
                    label="Số thẻ ôn/ngày"
                    value={targetReviews}
                    onChange={setTargetReviews}
                    onSave={(v) => handleSave("targetReviews", v)}
                    min={10} max={200}
                />
                <SliderField
                    label="Số thẻ mới/ngày"
                    value={targetNewCards}
                    onChange={setTargetNewCards}
                    onSave={(v) => handleSave("targetNewCards", v)}
                    min={5} max={100}
                />
                {updateGoal.isSuccess && (
                    <p className="text-xs font-bold text-green-600">Đã lưu</p>
                )}
                {updateGoal.isError && (
                    <p className="text-xs font-bold text-red-500">Lưu thất bại</p>
                )}
            </div>
        </section>
    )
}

function StudyGoalsForm() {
    const { data: goalData, isLoading } = useDailyGoal()
    const goal = goalData?.data

    if (isLoading) {
        return (
            <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-text-primary mb-4">Mục tiêu học tập</h3>
                <p className="text-sm text-text-muted">Đang tải...</p>
            </section>
        )
    }

    return <StudyGoalsFormInner key={goal?.targetReviews ?? 50} goal={goal ?? { targetReviews: 50, targetNewCards: 20 }} />
}

export function ProfileSettingsTab() {
    const router = useRouter()
    const { data: res, isLoading: profileLoading } = useMyProfile()
    const profile = res?.data
    const changePassword = useChangePassword()
    const deleteAccount = useDeleteAccount()

    const [pwOpen, setPwOpen] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPw, setShowPw] = useState(false)

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState("")

    const handleChangePassword = () => {
        if (newPassword !== confirmPassword) return
        changePassword.mutate(
            { currentPassword, newPassword, confirmPassword },
            {
                onSuccess: () => {
                    setPwOpen(false)
                    setCurrentPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                },
            },
        )
    }

    const handleDeleteAccount = () => {
        deleteAccount.mutate(undefined, {
            onSuccess: () => {
                const { logout } = useAuthStore.getState()
                logout()
                Cookies.remove(ACCESS_TOKEN_KEY)
                router.replace("/auth/login")
            },
        })
    }

    if (profileLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-terracotta" /></div>
    }

    if (!profile) {
        return <p className="text-sm text-text-muted text-center py-20">Không thể tải thông tin người dùng</p>
    }

    return (
        <div className="space-y-8">
            <PersonalInfoForm key={profile.id} profile={profile} />

            <NotificationSettingsForm />

            <StudyGoalsForm />

            {/* Security */}
            <section className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-text-primary mb-4">Bảo mật</h3>
                <div className="space-y-3 max-w-lg">
                    <button
                        onClick={() => setPwOpen(true)}
                        className="w-full flex items-center justify-between rounded-xl border border-beige px-4 py-3 hover:bg-cream transition-colors"
                    >
                        <span className="font-bold text-text-primary">Đổi mật khẩu</span>
                        <ChevronRight className="size-4 text-text-muted" />
                    </button>
                    {profile.email && (
                        <div className="flex items-center justify-between rounded-xl border border-beige px-4 py-3">
                            <span className="font-bold text-text-primary">Email</span>
                            <span className="text-sm font-medium text-text-muted">{profile.email}</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Danger zone */}
            <section className="rounded-[24px] border border-red-200 bg-red-50/50 p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-black text-red-600 mb-4">
                    <AlertTriangle className="size-5" /> Vùng nguy hiểm
                </h3>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setDeleteOpen(true)}
                        className="flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="size-4" /> Xóa tài khoản
                    </button>
                </div>
            </section>

            {/* ── Change Password Dialog ── */}
            <Dialog open={pwOpen} onOpenChange={setPwOpen}>
                <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()} onCloseAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-terracotta/10 mb-2">
                            <Lock className="size-6 text-terracotta" />
                        </div>
                        <DialogTitle>Đổi mật khẩu</DialogTitle>
                        <DialogDescription>Nhập mật khẩu hiện tại và mật khẩu mới của bạn</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="relative">
                            <label className="text-xs font-bold text-text-muted mb-1.5 block">Mật khẩu hiện tại</label>
                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full h-10 pr-10 px-3 rounded-xl border border-beige bg-white text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                                >
                                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-muted mb-1.5 block">Mật khẩu mới</label>
                            <input
                                type={showPw ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-beige bg-white text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-muted mb-1.5 block">Xác nhận mật khẩu mới</label>
                            <input
                                type={showPw ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl border border-beige bg-white text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                            />
                            {confirmPassword && newPassword !== confirmPassword && (
                                <p className="text-xs text-red-500 mt-1">Mật khẩu xác nhận không khớp</p>
                            )}
                        </div>
                        {changePassword.isError && (
                            <p className="text-xs text-red-500">{(changePassword.error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Đổi mật khẩu thất bại"}</p>
                        )}
                        {changePassword.isSuccess && (
                            <p className="text-xs text-green-600">Đổi mật khẩu thành công</p>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Huỷ</Button>
                        </DialogClose>
                        <Button
                            onClick={handleChangePassword}
                            disabled={!currentPassword || !newPassword || newPassword !== confirmPassword || changePassword.isPending}
                        >
                            {changePassword.isPending ? "Đang xử lý..." : "Lưu mật khẩu"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ── Delete Account Confirmation Dialog ── */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-md" onOpenAutoFocus={(e) => e.preventDefault()} onCloseAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-red-100 mb-2">
                            <AlertTriangle className="size-6 text-red-600" />
                        </div>
                        <DialogTitle>Xóa tài khoản</DialogTitle>
                        <DialogDescription>
                            Hành động này không thể hoàn tác. Toàn bộ dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2">
                        <label className="text-xs font-bold text-text-muted mb-1.5 block">
                            Nhập <span className="text-red-500">DELETE</span> để xác nhận
                        </label>
                        <input
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            placeholder="DELETE"
                            className="w-full h-10 px-3 rounded-xl border border-beige bg-white text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400"
                        />
                        {deleteAccount.isError && (
                            <p className="text-xs text-red-500">{(deleteAccount.error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Xóa tài khoản thất bại"}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="ghost">Huỷ</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirm !== "DELETE" || deleteAccount.isPending}
                        >
                            {deleteAccount.isPending ? "Đang xóa..." : "Xóa tài khoản"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

/* ── Shared sub-components ── */

function InputField({ label, value, onChange, multiline, hint }: {
    label: string; value: string; onChange: (v: string) => void; multiline?: boolean; hint?: string
}) {
    return (
        <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">{label}</label>
            <div className="flex items-center gap-2">
                {multiline ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-beige bg-white px-3 py-2 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta resize-none"
                    />
                ) : (
                    <input
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="flex-1 h-10 rounded-xl border border-beige bg-white px-3 text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                    />
                )}
                {hint && <span className="text-xs font-bold text-text-muted shrink-0">{hint}</span>}
            </div>
        </div>
    )
}

function ToggleRow({ label, enabled, onChange }: { label: string; enabled: boolean; onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between rounded-xl border border-beige px-4 py-3">
            <span className="font-bold text-text-primary">{label}</span>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative w-10 h-6 rounded-full transition-colors ${enabled ? "bg-terracotta" : "bg-gray-200"}`}
            >
                <div className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-0.5"}`} />
            </button>
        </div>
    )
}

function SliderField({ label, value, onChange, onSave, min, max }: { label: string; value: number; onChange: (v: number) => void; onSave?: (v: number) => void; min: number; max: number }) {
    const pct = ((value - min) / (max - min)) * 100
    return (
        <div>
            <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">{label}</label>
                <span className="text-sm font-bold text-text-primary">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                onMouseUp={(e) => onSave?.(Number((e.target as HTMLInputElement).value))}
                onKeyUp={(e) => onSave?.(Number((e.currentTarget as HTMLInputElement).value))}
                className="w-full h-2 rounded-full appearance-none bg-gray-100 cursor-pointer accent-terracotta"
                style={{
                    background: `linear-gradient(to right, #d97d56 0%, #d97d56 ${pct}%, #f0f0f0 ${pct}%, #f0f0f0 100%)`,
                }}
            />
        </div>
    )
}
