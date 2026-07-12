import type { ReactNode } from "react"

interface StatCardProps {
    icon: ReactNode
    value: string
    label: string
}

export function StatCard({ icon, value, label }: StatCardProps) {
    return (
        <div className="rounded-[28px] bg-white p-6">
            <div className="mb-4 text-terracotta">
                {icon}
            </div>
            <h3 className="text-3xl font-bold text-text-primary">
                {value}
            </h3>
            <p className="text-neutral-500">
                {label}
            </p>
        </div>
    )
}

export function DeckStatCard({ icon, label, value }: StatCardProps) {
    return (
        <div className="rounded-xl bg-cream/70 p-3.5 border border-beige/40 hover:bg-cream transition-colors">
            <div className="mb-1.5 text-terracotta">{icon}</div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{label}</p>
            <p className="mt-0.5 text-lg font-black text-text-primary">{value}</p>
        </div>
    )
}
