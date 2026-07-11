export function PostCardSkeleton() {
    return (
        <div className="rounded-3xl border border-beige bg-white p-6 md:p-8 animate-pulse space-y-4">
            <div className="flex gap-4">
                <div className="size-12 rounded-2xl bg-beige/60" />
                <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-beige/60 rounded w-1/4" />
                    <div className="h-3 bg-beige/40 rounded w-1/6" />
                </div>
            </div>
            <div className="h-6 bg-beige/60 rounded w-3/4 animate-pulse mt-4" />
            <div className="space-y-2 mt-3">
                <div className="h-4 bg-beige/40 rounded" />
                <div className="h-4 bg-beige/40 rounded w-5/6" />
            </div>
        </div>
    )
}