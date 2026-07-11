"use client"

import { Input } from "@/components/ui/input"
import { SearchIcon, XIcon } from "lucide-react"

interface TemplateFilterProps {
    searchValue: string
    onSearchChange: (value: string) => void
    onClear: () => void
}

export function TemplateFilter({ searchValue, onSearchChange, onClear }: TemplateFilterProps) {
    return (
        <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
                placeholder="Tìm kiếm template..."
                className="pl-9 h-10 border-gray-300 bg-white pr-9 rounded-xl"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchValue && (
                <button type="button" onClick={onClear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <XIcon className="size-4" />
                </button>
            )}
        </div>
    )
}
