"use client"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DeckSortBy } from "@/constants/sort"
import { SearchIcon, XIcon } from "lucide-react"

interface DeckFilterProps {
    searchValue: string
    onSearchChange: (value: string) => void
    onSearch: (e: React.FormEvent) => void
    onClear: () => void
    sort: string
    onSortChange: (value: string) => void
}

export function DeckFilter({ searchValue, onSearchChange, onSearch, onClear, sort, onSortChange }: DeckFilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={onSearch} className="relative w-[280px]">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                    placeholder="Tìm kiếm bộ thẻ..."
                    className="pl-9 h-10 border-gray-300 bg-white pr-9 rounded-xl"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchValue && (
                    <button type="button" onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <XIcon className="size-4" />
                    </button>
                )}
            </form>

            <Select value={sort} onValueChange={onSortChange}>
                <SelectTrigger className="w-[150px] h-10 border-gray-300 bg-white shadow-sm rounded-xl">
                    <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={DeckSortBy.CREATED_AT}>Mới nhất</SelectItem>
                    <SelectItem value={DeckSortBy.NAME}>Tên A-Z</SelectItem>
                    <SelectItem value={DeckSortBy.DOWNLOAD_COUNT}>Phổ biến</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
