export function StatCard1({
    value,
    label,
}: {
    value: string;
    label: string;
}) {
    return (
        <div className="rounded-[24px] bg-white/15 p-4 backdrop-blur-sm">
            <h3 className="text-2xl font-bold">
                {value}
            </h3>

            <p className="text-sm text-white/80">
                {label}
            </p>
        </div>
    );
}