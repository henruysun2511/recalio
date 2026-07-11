interface OverviewChartProps {
    title: string
    data: { label: string; value: number }[]
    height?: number
    formatValue?: (v: number) => string
}

export function OverviewChart({ title, data, height = 160, formatValue }: OverviewChartProps) {
    const max = Math.max(...data.map((d) => d.value), 1)

    return (
        <div className="rounded-2xl border border-beige bg-white p-5 shadow-sm flex-1">
            <p className="mb-4 text-sm font-semibold text-text-primary">{title}</p>
            <div className="flex items-end gap-1" style={{ height }}>
                {data.map((d) => (
                    <div
                        key={d.label}
                        className="flex flex-1 flex-col items-center justify-end h-full"
                    >
                        <div
                            className="w-full rounded-t-md bg-terracotta/70 transition-all hover:bg-terracotta"
                            style={{ height: `${(d.value / max) * 100}%` }}
                        />
                        <span className="mt-1.5 text-[10px] font-medium text-text-muted truncate w-full text-center">
                            {d.label}
                        </span>
                    </div>
                ))}
            </div>
            {formatValue && data.length > 0 && (
                <div className="mt-3 flex items-center justify-between text-[10px] text-text-muted">
                    <span>{formatValue(data[0].value)}</span>
                    <span>{formatValue(data[data.length - 1].value)}</span>
                </div>
            )}
        </div>
    )
}
