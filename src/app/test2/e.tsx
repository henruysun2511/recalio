interface HolidayItemProps {
    title: string
    price: string
}

export function HolidayItem({
    title,
    price,
}: HolidayItemProps) {
    return (
        <div className="flex items-center justify-between rounded-[20px] bg-[#FAFAFA] p-4">
            <div>
                <h5 className="font-medium text-[#2E2E2E]">
                    {title}
                </h5>

                <p className="text-sm text-neutral-400">
                    {price}
                </p>
            </div>

            <button className="rounded-full bg-[#D97D56] px-4 py-2 text-sm text-white transition hover:bg-[#C96A42]">
                View
            </button>
        </div>
    )
}