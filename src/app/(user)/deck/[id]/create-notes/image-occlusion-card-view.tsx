"use client"

import { useMemo } from "react"

interface Mask {
    x: number
    y: number
    width: number
    height: number
    groupIndex: number
    label?: string | null
}

interface ImageOcclusionCardViewProps {
    imageUrl: string
    masks: Mask[]
    variantIndex: number
    showBack: boolean
    compact?: boolean
}

export function ImageOcclusionCardView({ imageUrl, masks, variantIndex, showBack, compact }: ImageOcclusionCardViewProps) {
    const imgRef = useMemo(() => ({ current: null as HTMLDivElement | null }), [])

    return (
        <div className={`w-full ${compact ? "max-w-[240px]" : "max-w-md"} mx-auto ${compact ? "space-y-2" : "space-y-4"}`}>
            <div className="relative w-full overflow-hidden rounded-xl bg-cream/40 border border-beige shadow-sm"
                style={{ aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={imageUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain p-1"
                    draggable={false}
                />
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {masks.map((m, i) => {
                        const isTarget = m.groupIndex === variantIndex
                        if (showBack && isTarget) return null

                        const fill = isTarget
                            ? "rgba(0,0,0,0.82)"
                            : showBack
                                ? "none"
                                : "rgba(0,0,0,0.35)"
                        const stroke = isTarget
                            ? "none"
                            : showBack
                                ? "rgba(34,197,94,0.5)"
                                : "rgba(255,255,255,0.4)"
                        const strokeWidth = isTarget ? 0 : showBack ? 2 : 1

                        return (
                            <rect
                                key={i}
                                x={m.x} y={m.y}
                                width={m.width} height={m.height}
                                fill={fill}
                                stroke={stroke}
                                strokeWidth={strokeWidth}
                                strokeDasharray={showBack && !isTarget ? "3 3" : "none"}
                                rx={1.5}
                                className="transition-all duration-300"
                            />
                        )
                    })}
                </svg>
            </div>
            {showBack && (() => {
                const revealed = masks.filter((m) => m.groupIndex === variantIndex)
                const label = revealed[0]?.label
                if (!label) return null
                return (
                    <div className="rounded-xl bg-emerald-50 border-2 border-emerald-200 px-4 py-3 text-center shadow-sm">
                        <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-400 block mb-1">Đáp án</span>
                        <span className="text-lg font-black text-emerald-700">{label}</span>
                    </div>
                )
            })()}
        </div>
    )
}
