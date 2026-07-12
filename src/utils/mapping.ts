import { CardState, ReviewRating } from "@/constants/type"

export const STATE_BADGE: Record<string, { label: string; className: string }> = {
    [CardState.NEW]: { label: "Mới", className: "bg-blue-100 text-blue-700 border-blue-200" },
    [CardState.LEARNING]: { label: "Đang học", className: "bg-amber-100 text-amber-700 border-amber-200" },
    [CardState.RELEARNING]: { label: "Học lại", className: "bg-amber-100 text-amber-700 border-amber-200" },
    [CardState.REVIEW]: { label: "Ôn tập", className: "bg-green-100 text-green-700 border-green-200" },
    [CardState.SUSPENDED]: { label: "Tạm ngưng", className: "bg-gray-100 text-gray-500 border-gray-200" },
}

export const RATING_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    [ReviewRating.AGAIN]: { label: "Again", color: "text-red-600", bg: "bg-red-50" },
    [ReviewRating.HARD]: { label: "Hard", color: "text-orange-600", bg: "bg-orange-50" },
    [ReviewRating.GOOD]: { label: "Good", color: "text-green-600", bg: "bg-green-50" },
    [ReviewRating.EASY]: { label: "Easy", color: "text-blue-600", bg: "bg-blue-50" },
}

export const STATE_LABELS: Record<string, string> = {
    [CardState.NEW]: "Mới",
    [CardState.LEARNING]: "Đang học",
    [CardState.REVIEW]: "Ôn tập",
    [CardState.RELEARNING]: "Học lại",
    [CardState.SUSPENDED]: "Tạm dừng",
}
