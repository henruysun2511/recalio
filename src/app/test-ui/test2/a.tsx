export function HeroBanner() {
    return (
        <div className="relative overflow-hidden rounded-[28px]">
            <img
                src="/images/autumn-banner.jpg"
                alt=""
                className="h-[260px] w-full object-cover"
            />

            <div className="absolute bottom-0 left-0 w-full rounded-t-[24px] bg-terracotta p-6 text-white">
                <h2 className="text-3xl font-semibold">
                    Autumn Day
                </h2>

                <p className="mt-1 text-white/90">
                    Hello Jack
                </p>
            </div>
        </div>
    )
}