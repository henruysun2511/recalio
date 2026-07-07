"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchIcon, XIcon, FilterIcon } from "lucide-react";
import { useState } from "react";

interface LanguageFilterProps {
    onSearch: (value: string) => void;
    onFilterChange: (filters: { isSupported?: boolean }) => void;
}

export function LanguageFilter({ onSearch, onFilterChange }: LanguageFilterProps) {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchValue);
    };

    const clearSearch = () => {
        setSearchValue("");
        onSearch("");
    };

    return (
        <div className="p-5 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
                <form onSubmit={handleSearch} className="relative w-[280px]">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm ngôn ngữ..."
                        className="pl-9 h-10 border-gray-300 bg-white pr-9"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    {searchValue && (
                        <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <XIcon className="size-4" />
                        </button>
                    )}
                </form>

                <Select onValueChange={(val) => onFilterChange({ isSupported: val === "all" ? undefined : val === "true" ? true : false })}>
                    <SelectTrigger className="w-[160px] h-10 border-gray-300 bg-white shadow-sm">
                        <FilterIcon className="size-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent data-role="admin">
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="true">Hỗ trợ</SelectItem>
                        <SelectItem value="false">Không hỗ trợ</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
