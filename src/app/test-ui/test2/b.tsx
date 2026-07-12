import { HeroBanner } from "./a";
import { ScheduleCard } from "./c";

export function CenterContent() {
    return (
        <>
            {/* SEARCH */}
            <div className="mb-6">
                <input
                    placeholder="Search..."
                    className="h-12 w-full rounded-full border-none bg-white px-5 outline-none"
                />
            </div>

            <HeroBanner />

            <div className="mt-8">
                <h3 className="mb-5 text-lg font-semibold text-text-primary">
                    Day Schedule
                </h3>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <ScheduleCard
                        title="Wedding"
                        image="/images/1.jpg"
                    />

                    <ScheduleCard
                        title="Birthday"
                        image="/images/2.jpg"
                    />

                    <ScheduleCard
                        title="Party"
                        image="/images/3.jpg"
                    />

                    <ScheduleCard
                        title="Holiday"
                        image="/images/4.jpg"
                    />
                </div>
            </div>
        </>
    )
}