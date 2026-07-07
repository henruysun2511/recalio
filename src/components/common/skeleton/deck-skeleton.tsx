export function DeckSkeleton() {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-[28px] border border-beige bg-white overflow-hidden animate-pulse">
                    {/* Cover */}
                    <div className="h-40 w-full bg-gray-100" />

                    {/* Content */}
                    <div className="p-5 space-y-4">
                        {/* Badge row */}
                        <div className="flex gap-2">
                            <div className="h-5 w-16 rounded-full bg-gray-100" />
                            <div className="h-5 w-12 rounded-full bg-gray-100" />
                        </div>

                        {/* Title */}
                        <div className="h-5 w-3/4 rounded bg-gray-100" />

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="h-3 w-full rounded bg-gray-100" />
                            <div className="h-3 w-2/3 rounded bg-gray-100" />
                        </div>

                        {/* Tags */}
                        <div className="flex gap-1.5">
                            <div className="h-5 w-14 rounded-lg bg-gray-100" />
                            <div className="h-5 w-16 rounded-lg bg-gray-100" />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-beige/60 pt-3.5">
                            <div className="h-4 w-16 rounded bg-gray-100" />
                            <div className="h-4 w-10 rounded bg-gray-100" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
