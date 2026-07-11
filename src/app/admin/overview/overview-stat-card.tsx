import { type LucideIcon } from "lucide-react"

interface OverviewStatCardProps {
    icon: LucideIcon
    label: string
    value: string | number
    trend?: string
    trendUp?: boolean
    highlight?: boolean
    highlightLabel?: string
}

export function OverviewStatCard({ icon: Icon, label, value, trend, trendUp, highlight, highlightLabel }: OverviewStatCardProps) {
    return (
        <div className="rounded-2xl border border-beige bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-peach">
                    <Icon className="size-5 text-terracotta" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-text-muted">{label}</p>
                    <p className="text-2xl font-black text-text-primary tracking-tight">{value}</p>
                </div>
            </div>
            {(trend || highlight) && (
                <div className="mt-3 flex items-center gap-1.5 border-t border-beige/60 pt-3 text-xs">
                    {trend && (
                        <span className={trendUp ? "text-green-600 font-semibold" : "text-text-muted"}>
                            {trendUp ? "↑" : ""} {trend}
                        </span>
                    )}
                    {highlight && (
                        <span className="ml-auto font-semibold text-red-500">
                            🔴 {highlightLabel}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
