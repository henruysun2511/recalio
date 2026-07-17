"use client"

import { useState, useMemo } from "react"
import { ImageOcclusionCardView } from "@/app/(user)/deck/[id]/create-notes/image-occlusion-card-view"

export function buildFieldMap(card: any): Record<string, string> {
    const audioUrl = card?.note?.audioUrl ?? ""
    const imageUrl = card?.note?.imageUrl ?? ""
    return {
        Word: card?.note?.word ?? "",
        Meaning: card?.note?.meaning ?? "",
        IPA: card?.note?.ipa ?? "",
        PartOfSpeech: card?.note?.partOfSpeech ?? "",
        Example: card?.note?.example ?? "",
        Front: card?.note?.word ?? "",
        Back: card?.note?.meaning ?? "",
        Text: card?.note?.word ?? "",
        Extra: card?.note?.example ?? "",
        Image: imageUrl ? `<img src="${imageUrl}" class="card-image" />` : "",
        Audio: audioUrl ? `<button onclick="new Audio('${audioUrl}').play()" class="card-audio-btn">🔊 Nghe</button>` : "",
    }
}

export function hasTypeMarker(html: string): boolean {
    return /{{type:([^}]+)}}/i.test(html)
}

export function processBackHtml(html: string, fieldMap: Record<string, string>): string {
    let result = html
    for (const [key, val] of Object.entries(fieldMap)) {
        result = result.replaceAll(`{{${key}}}`, val)
    }
    result = result.replace(/{{type:([^}]+)}}/gi, (_, field) => {
        const expected = fieldMap[field.trim()] || ""
        return `<span class="font-bold text-terracotta">${expected}</span>`
    })
    result = result.replace(/{{cloze:([^}]+)}}/gi, (_, field) => {
        const value = fieldMap[field.trim()] || ""
        return `<span class="font-bold text-terracotta">${value}</span>`
    })
    result = result.replace(/<hr id="answer"\s*\/?>/gi, '<hr class="my-3 border-beige" />')
    return result
}

interface CardPreviewProps {
    card: any
    compact?: boolean
}

export function CardPreview({ card, compact }: CardPreviewProps) {
    const [showBack, setShowBack] = useState(false)
    const isOcclusion = !!card?.occlusion
    const fieldMap = useMemo(() => buildFieldMap(card), [card])
    const backHtml = useMemo(() => processBackHtml(card?.backHtml ?? "", fieldMap), [card, fieldMap])

    const handleFlip = () => { setShowBack((v) => !v) }

    if (isOcclusion) {
        return (
            <div onClick={handleFlip} className="cursor-pointer rounded-xl border border-beige bg-white p-3 shadow-sm hover:shadow-md overflow-hidden">
                <ImageOcclusionCardView
                    imageUrl={card.occlusion.imageUrl}
                    masks={card.occlusion.masks}
                    variantIndex={card.variantIndex}
                    showBack={showBack}
                    compact={compact}
                />
                {card.css && <style>{card.css}</style>}
            </div>
        )
    }

    return (
        <div
            onClick={handleFlip}
            className={`relative cursor-pointer rounded-xl border border-beige bg-white shadow-sm transition-all hover:shadow-md [perspective:1000px] ${compact ? "min-h-[120px]" : "min-h-[160px]"}`}
        >
            <div className={`relative w-full ${compact ? "min-h-[100px]" : "min-h-[140px]"} transition-transform duration-500 [transform-style:preserve-3d] ${showBack ? "[transform:rotateY(180deg)]" : ""}`}>
                <div className="absolute inset-0 flex items-center justify-center p-3 [backface-visibility:hidden]">
                    <div
                        className={`w-full text-center [&_img]:max-h-24 [&_img]:rounded-lg [&_img]:object-cover ${compact ? "text-xs" : "text-sm"}`}
                        dangerouslySetInnerHTML={{ __html: card?.frontHtml ?? "" }}
                    />
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div
                        className={`w-full text-center [&_img]:max-h-24 [&_img]:rounded-lg [&_img]:object-cover ${compact ? "text-xs" : "text-sm"}`}
                        dangerouslySetInnerHTML={{ __html: backHtml }}
                    />
                </div>
            </div>
            {card.css && <style>{card.css}</style>}
        </div>
    )
}
