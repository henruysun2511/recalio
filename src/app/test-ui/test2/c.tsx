interface ScheduleCardProps {
    title: string
    image: string
}

export function ScheduleCard({
    title,
    image,
}: ScheduleCardProps) {
    return (
        <div className="group">
            <div className="overflow-hidden rounded-[24px] bg-white">
                <img
                    src={image}
                    alt=""
                    className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                />
            </div>

            <h4 className="mt-3 font-medium text-text-primary">
                {title}
            </h4>

            <p className="text-sm text-neutral-400">
                08:50 Time
            </p>
        </div>
    )
}