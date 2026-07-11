import { CardState } from "@/constants/type"

export const STATE_BADGE: Record<string, { label: string; className: string }> = {
    [CardState.NEW]: { label: "Mới", className: "bg-blue-100 text-blue-700 border-blue-200" },
    [CardState.LEARNING]: { label: "Đang học", className: "bg-amber-100 text-amber-700 border-amber-200" },
    [CardState.RELEARNING]: { label: "Học lại", className: "bg-amber-100 text-amber-700 border-amber-200" },
    [CardState.REVIEW]: { label: "Ôn tập", className: "bg-green-100 text-green-700 border-green-200" },
    [CardState.SUSPENDED]: { label: "Tạm ngưng", className: "bg-gray-100 text-gray-500 border-gray-200" },
}
