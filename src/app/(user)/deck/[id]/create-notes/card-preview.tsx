"use client"

import { Volume2, ImageIcon } from "lucide-react"

export interface CardPreviewData {
    word: string
    ipa?: string
    partOfSpeech?: string
    meaning?: string
    example?: string
    audioUrl?: string | null
    imageUrl?: string | null
    fields?: Record<string, string>
}

export interface CardTemplate {
    id: string
    name: string
    frontHtml: string
    backHtml: string
    css?: string
}

interface CardPreviewProps {
    data: CardPreviewData
    templates?: CardTemplate[]
}

function buildFieldMap(data: CardPreviewData): Record<string, string> {
    return {
        Word: data.word,
        Meaning: data.meaning || "",
        IPA: data.ipa || "",
        PartOfSpeech: data.partOfSpeech || "",
        Example: data.example || "",
        Front: data.word,
        Back: data.meaning || "",
        Text: data.fields?.Text ?? data.word,
        Extra: data.fields?.Extra ?? data.example ?? "",
        Image: data.imageUrl ? `<img src="${data.imageUrl}" class="card-image" />` : "",
        Audio: data.audioUrl ? `<button onclick="new Audio('${data.audioUrl}').play()" class="card-audio-btn">🔊 Nghe</button>` : "",
        Label: data.fields?.Label ?? data.word,
        ...data.fields,
    }
}

function substitute(html: string, fieldMap: Record<string, string>, side: "front" | "back"): string {
    let result = html
    for (const [key, val] of Object.entries(fieldMap)) {
        result = result.replaceAll(`{{${key}}}`, val)
    }
    result = result.replace(/{{cloze:([^}]+)}}/g, (_, field) => {
        const value = fieldMap[field.trim()] || ""
        const processed = value.replace(/\{\{c\d+::(.*?)\}\}/g, (_m: string, content: string) =>
            side === "back"
                ? `<span class="cloze-reveal font-bold text-terracotta">${content}</span>`
                : `<span class="cloze">[...]</span>`
        )
        return processed || value
    })
    result = result.replace(/{{type:([^}]+)}}/g, () => `<input type="text" placeholder="..." disabled />`)
    result = result.replace(/<hr id="answer"\s*\/?>/g, '<hr class="my-3 border-beige" />')
    return result
}

export function CardPreview({ data, templates }: CardPreviewProps) {
    const { word, ipa, partOfSpeech, meaning, example, audioUrl, imageUrl } = data

    if (templates && templates.length > 0) {
        return (
            <div className="space-y-4">
                <style>{`
                    .card-audio-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        padding: 6px 14px;
                        border-radius: 10px;
                        background: rgba(201, 106, 66, 0.1);
                        color: #c96a42;
                        font-weight: 700;
                        font-size: 13px;
                        border: none;
                        cursor: pointer;
                        transition: all 0.15s;
                    }
                    .card-audio-btn:hover {
                        background: #c96a42;
                        color: white;
                    }
                    .card-image {
                        max-height: 180px;
                        border-radius: 12px;
                        object-fit: cover;
                        margin: 8px auto;
                        display: block;
                    }
                `}</style>
                {templates.map((ct) => {
                    const fieldMap = buildFieldMap(data)
                    return (
                        <div key={ct.id} className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-0.5">
                                {ct.name}
                            </p>
                            <div className="rounded-2xl border-2 border-dashed border-beige bg-white overflow-hidden">
                                <div className="p-4 border-b border-beige/50">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Front</span>
                                    <div className="mt-2 min-h-[60px]" dangerouslySetInnerHTML={{ __html: substitute(ct.frontHtml, fieldMap, "front") }}
                                    />
                                </div>
                                <div className="p-4">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-text-muted">Back</span>
                                    <div className="mt-2 min-h-[60px]" dangerouslySetInnerHTML={{ __html: substitute(ct.backHtml, fieldMap, "back") }} />
                                </div>
                            </div>
                            {ct.css && <style>{ct.css}</style>}
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-0.5">
                    Card Front
                </p>
                <div className="rounded-2xl border-2 border-dashed border-beige bg-white p-6 min-h-[180px] flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-black text-text-primary tracking-tight">{word}</h3>
                    {ipa && <p className="text-sm font-medium text-text-muted italic mt-1">{ipa}</p>}
                    {partOfSpeech && (
                        <span className="mt-2 inline-block rounded-full bg-peach px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-terracotta border border-peach-dark/20">
                            {partOfSpeech}
                        </span>
                    )}
                    {(audioUrl || imageUrl) && (
                        <div className="flex items-center gap-3 mt-3 text-text-muted">
                            {audioUrl && <Volume2 className="size-4" />}
                            {imageUrl ?
                                <img src={imageUrl} alt="" className="size-8 rounded object-cover" /> :
                                <ImageIcon className="size-4" />
                            }
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-0.5">
                    Card Back
                </p>
                <div className="rounded-2xl border-2 border-dashed border-beige bg-white p-6 min-h-[180px] flex flex-col items-center justify-center text-center">
                    <p className="text-lg font-bold text-text-primary leading-relaxed">{meaning}</p>
                    {example && (
                        <p className="mt-3 text-sm text-text-muted italic leading-relaxed max-w-sm">
                            &ldquo;{example}&rdquo;
                        </p>
                    )}
                    {(audioUrl || imageUrl) && (
                        <div className="flex items-center gap-3 mt-3 text-text-muted">
                            {audioUrl && <Volume2 className="size-4" />}
                            {imageUrl ?
                                <img src={imageUrl} alt="" className="size-8 rounded object-cover" /> :
                                <ImageIcon className="size-4" />
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
