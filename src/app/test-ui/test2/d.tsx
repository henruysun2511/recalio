import { HolidayItem } from "./e"

export function ProfileSidebar() {
    const holidays = [
        {
            title: "Thanksgiving",
            price: "$174.99",
        },
        {
            title: "Halloween",
            price: "$326.00",
        },
        {
            title: "Holiday",
            price: "$51.00",
        },
    ]

    return (
        <div>
            {/* PROFILE */}
            <div className="flex items-center gap-4">
                <img
                    src="/avatar.png"
                    alt=""
                    className="h-14 w-14 rounded-2xl object-cover"
                />

                <div>
                    <h3 className="font-semibold text-text-primary">
                        Jack
                    </h3>

                    <p className="text-sm text-neutral-400">
                        Party organizer
                    </p>
                </div>
            </div>

            {/* HOLIDAY */}
            <section className="mt-10">
                <h4 className="mb-4 text-xl font-semibold">
                    October Holidays
                </h4>

                <div className="space-y-3">
                    {holidays.map((item) => (
                        <HolidayItem
                            key={item.title}
                            {...item}
                        />
                    ))}
                </div>
            </section>

            {/* PLANNING */}
            <section className="mt-10">
                <h4 className="mb-4 text-xl font-semibold">
                    Party Planning
                </h4>

                <div className="grid grid-cols-2 gap-3">
                    <img
                        src="/plan1.jpg"
                        className="rounded-[20px]"
                    />

                    <img
                        src="/plan2.jpg"
                        className="rounded-[20px]"
                    />

                    <img
                        src="/plan3.jpg"
                        className="rounded-[20px]"
                    />

                    <img
                        src="/plan4.jpg"
                        className="rounded-[20px]"
                    />
                </div>
            </section>
        </div>
    )
}