"use client"

import { Search } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CardState } from "@/constants/type"

interface CardFilterProps {
    state: string
    search: string
    onStateChange: (value: string) => void
    onSearchChange: (value: string) => void
}

const STATE_OPTIONS: { value: string; label: string }[] = [
    { value: "", label: "Tất cả" },
    { value: CardState.NEW, label: "Mới" },
    { value: CardState.LEARNING, label: "Đang học" },
    { value: CardState.RELEARNING, label: "Học lại" },
    { value: CardState.REVIEW, label: "Ôn tập" },
    { value: CardState.SUSPENDED, label: "Tạm ngưng" },
]

export function CardFilter({ state, search, onStateChange, onSearchChange }: CardFilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                <input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="h-10 w-[200px] rounded-xl border border-beige bg-white pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-terracotta focus:outline-none"
                />
            </div>
            <Select value={state} onValueChange={onStateChange}>
                <SelectTrigger className="w-[160px] h-10 border-beige bg-white rounded-xl">
                    <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                    {STATE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
