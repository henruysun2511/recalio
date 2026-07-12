import { Flame, BarChart3 } from "lucide-react"
import { Title } from "@/components/common/title"

export function GamificationSection() {
    return (
        <section className="bg-terracotta py-20 text-white">
            <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <Title title="Stay Motivated" className="text-4xl mb-6 text-white" />
                    <p className="text-white/80 mb-8">Trải nghiệm học tập được trò chơi hóa giúp bạn duy trì thói quen học mỗi ngày.</p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl">
                            <Flame className="text-yellow-400" /> 45 Day Streak
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl">
                            <BarChart3 className="text-green-400" /> Level 18 - Top 10%
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-beige">
                    <div className="flex items-center gap-2 mb-3">
                        <Flame className="size-4 text-orange-500" />
                        <span className="text-sm font-bold text-text-primary">Hoạt động 12 tháng qua</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="w-5" />
                                    {["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"].map((m) => (
                                        <th key={m} className="text-[9px] font-bold text-text-muted text-left px-0.5 pb-1">{m}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((dayLabel, di) => (
                                    <tr key={dayLabel}>
                                        <td className="text-[9px] font-bold text-text-muted pr-1.5">{dayLabel}</td>
                                        {Array.from({ length: 52 }, (_, wi) => {
                                            const seed = (di * 52 + wi) * 1103
                                            const r = ((seed * 9301 + 49297) % 233280) / 233280
                                            let bg = "bg-gray-100"
                                            if (r > 0.85) bg = "bg-orange-500"
                                            else if (r > 0.65) bg = "bg-orange-400"
                                            else if (r > 0.4) bg = "bg-orange-300"
                                            return (
                                                <td key={wi} className="p-[1px]">
                                                    <div className={`h-3 w-full rounded-sm ${bg}`} />
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center gap-1.5 mt-3 text-[10px] text-text-muted">
                        <span>Ít</span>
                        <div className="h-2.5 w-2.5 rounded-sm bg-gray-100" />
                        <div className="h-2.5 w-2.5 rounded-sm bg-orange-300" />
                        <div className="h-2.5 w-2.5 rounded-sm bg-orange-400" />
                        <div className="h-2.5 w-2.5 rounded-sm bg-orange-500" />
                        <span>Nhiều</span>
                        <span className="ml-auto font-medium text-text-primary">247 ngày học</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
