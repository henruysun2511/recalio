"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";

interface DeckFilterProps {
    onSearch: (value: string) => void;
}

export function DeckFilter({ onSearch }: DeckFilterProps) {
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
                        placeholder="Tìm kiếm deck..."
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
            </div>
        </div>
    );
}
