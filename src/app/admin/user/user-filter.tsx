"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchIcon, XIcon, FilterIcon, ShieldIcon, ActivityIcon } from "lucide-react";
import { useState } from "react";
import { UserRole } from "@/constants/type";

interface UserFilterProps {
    onSearch: (value: string) => void;
    onFilterChange: (filters: { role?: string; isActive?: boolean }) => void;
}

export function UserFilter({ onSearch, onFilterChange }: UserFilterProps) {
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
                        placeholder="Tìm kiếm người dùng..."
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

                <Select onValueChange={(val) => onFilterChange({ role: val === "all" ? undefined : val })}>
                    <SelectTrigger className="w-[160px] h-10 border-gray-300 bg-white shadow-sm">
                        <ShieldIcon className="size-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Vai trò" />
                    </SelectTrigger>
                    <SelectContent data-role="admin">
                        <SelectItem value="all">Tất cả</SelectItem>
                        {Object.values(UserRole).map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select onValueChange={(val) => onFilterChange({ isActive: val === "all" ? undefined : val === "true" ? true : false })}>
                    <SelectTrigger className="w-[160px] h-10 border-gray-300 bg-white shadow-sm">
                        <ActivityIcon className="size-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent data-role="admin">
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="true">Hoạt động</SelectItem>
                        <SelectItem value="false">Đã khóa</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
