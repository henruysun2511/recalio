interface HolidayItemProps {
    title: string
    price: string
}

export function HolidayItem({
    title,
    price,
}: HolidayItemProps) {
    return (
        <div className="flex items-center justify-between rounded-[20px] bg-near-white p-4">
            <div>
                <h5 className="font-medium text-text-primary">
                    {title}
                </h5>

                <p className="text-sm text-neutral-400">
                    {price}
                </p>
            </div>

            <button className="rounded-full bg-terracotta px-4 py-2 text-sm text-white transition hover:bg-terracotta-dark">
                View
            </button>
        </div>
    )
}