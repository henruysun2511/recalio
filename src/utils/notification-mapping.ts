import { Clock, Layers, Trophy, AlertTriangle, Ban, BellRing, type LucideIcon } from "lucide-react"
import { NotificationType, NotificationChannel } from "@/constants/type"

export const TYPE_ICONS: Record<string, LucideIcon> = {
    STUDY_REMINDER: Clock,
    CARDS_DUE: Layers,
    ACHIEVEMENT_EARNED: Trophy,
    DECK_REPORTED: AlertTriangle,
    DECK_BANNED: Ban,
    SYSTEM: BellRing,
}

export const TYPE_COLORS: Record<string, string> = {
    STUDY_REMINDER: "text-blue-500 bg-blue-50",
    CARDS_DUE: "text-amber-500 bg-amber-50",
    ACHIEVEMENT_EARNED: "text-green-500 bg-green-50",
    DECK_REPORTED: "text-red-500 bg-red-50",
    DECK_BANNED: "text-red-600 bg-red-100",
    SYSTEM: "text-purple-500 bg-purple-50",
}

export const NOTIFICATION_TYPE_OPTIONS = Object.entries(NotificationType).map(([key, value]) => ({
    value,
    label: key.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
}))

export const NOTIFICATION_CHANNEL_OPTIONS = Object.entries(NotificationChannel).map(([key, value]) => ({
    value,
    label: key === "WEB_PUSH" ? "Web Push" : key === "MOBILE_PUSH" ? "Mobile Push" : key,
}))
