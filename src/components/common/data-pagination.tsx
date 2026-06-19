"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface DataPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function DataPagination({
    page,
    totalPages,
    onPageChange,
}: DataPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination className="w-auto">
            <PaginationContent className="gap-2">
                <PaginationItem className="mr-10">
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) onPageChange(page - 1);
                        }}
                        className={`h-9 w-9 p-0 flex items-center justify-center rounded-md border ${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-gray-100"
                            }`}
                    />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                        <PaginationItem key={p}>
                            <PaginationLink
                                href="#"
                                isActive={p === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(p);
                                }}
                                className={`h-9 w-9 flex items-center justify-center rounded-md border ${p === page
                                    ? "bg-terracotta text-white border-terracotta"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem className="ml-5">
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) onPageChange(page + 1);
                        }}
                        className={`h-9 w-9 p-0 flex items-center justify-center rounded-md border ${page >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-gray-100"
                            }`}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
