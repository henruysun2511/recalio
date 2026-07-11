"use client"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SearchIcon, XIcon, PlusIcon } from "lucide-react"
import { SortOrder } from "@/constants/sort"

interface NoteFilterProps {
    searchValue: string
    onSearchChange: (value: string) => void
    onSearch: (e: React.FormEvent) => void
    onClear: () => void
    sort: string
    onSortChange: (value: string) => void
    sortOrder: string
    onSortOrderChange: (value: string) => void
    showAddButton?: boolean
    onAdd?: () => void
}

export function NoteFilter({ searchValue, onSearchChange, onSearch, onClear, sort, onSortChange, sortOrder, onSortOrderChange, showAddButton, onAdd }: NoteFilterProps) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={onSearch} className="relative w-[280px]">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                    placeholder="Tìm kiếm từ vựng..."
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
                <SelectTrigger className="w-[140px] h-10 border-gray-300 bg-white shadow-sm rounded-xl">
                    <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="createdAt">Ngày tạo</SelectItem>
                    <SelectItem value="updatedAt">Cập nhật</SelectItem>
                    <SelectItem value="word">Từ vựng</SelectItem>
                </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={onSortOrderChange}>
                <SelectTrigger className="w-[130px] h-10 border-gray-300 bg-white shadow-sm rounded-xl">
                    <SelectValue placeholder="Thứ tự" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={SortOrder.DESC}>Mới nhất</SelectItem>
                    <SelectItem value={SortOrder.ASC}>Cũ nhất</SelectItem>
                </SelectContent>
            </Select>

            {showAddButton && onAdd && (
                <button
                    onClick={onAdd}
                    className="flex items-center gap-2 rounded-xl bg-terracotta px-4 py-2 text-sm font-bold text-white transition-all hover:bg-terracotta-dark active:scale-95"
                >
                    <PlusIcon className="size-4" />
                    Thêm note
                </button>
            )}
        </div>
    )
}
