"use client"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SortOrder } from "@/constants/sort"
import { SearchIcon, XIcon } from "lucide-react"

interface PostFilterProps {
    searchValue: string
    onSearchChange: (value: string) => void
    onSearch: (e: React.FormEvent) => void
    onClear: () => void
    sortOrder: string
    onSortOrderChange: (value: string) => void
}

export function PostFilter({ searchValue, onSearchChange, onSearch, onClear, sortOrder, onSortOrderChange }: PostFilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={onSearch} className="relative w-[280px]">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                    placeholder="Tìm kiếm bài viết..."
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

            <Select value={sortOrder} onValueChange={onSortOrderChange}>
                <SelectTrigger className="w-[150px] h-10 border-gray-300 bg-white shadow-sm rounded-xl">
                    <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={SortOrder.DESC}>Mới nhất</SelectItem>
                    <SelectItem value={SortOrder.ASC}>Cũ nhất</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
