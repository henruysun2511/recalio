"use client"

import { Volume2, MoreHorizontal, PencilIcon, TrashIcon, BookOpen } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Note } from "@/schemas/note.schema"

interface NoteCardProps {
    note: Note
    isOwner: boolean
    onEdit: (note: Note) => void
    onDelete: (note: Note) => void
    onRelated: (note: Note) => void
}

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
    CLOZE: { label: "Cloze", className: "bg-violet-100 text-violet-700 border-violet-200" },
    IMAGE_OCCLUSION: { label: "Occlusion", className: "bg-amber-100 text-amber-700 border-amber-200" },
}

function ClozeNoteCard({ note }: { note: Note }) {
    const text = (note.fields?.Text as string) ?? note.word ?? ""
    const extra = (note.fields?.Extra as string) ?? note.meaning ?? ""
    const parts = text.split(/(\{\{c\d+::(.*?)\}\})/g)
    const rendered = parts.map((part, i) => {
        const m = part.match(/\{\{c\d+::(.*?)\}\}/)
        if (m) {
            return (
                <span key={i} className="inline-block rounded-md bg-amber-100 border border-amber-300 px-2 py-0.5 text-amber-800 font-bold text-sm leading-relaxed mx-0.5">
                    {m[1]}
                </span>
            )
        }
        return part ? (
            <span key={i} className="text-text-primary font-medium">{part}</span>
        ) : null
    })
    return (
        <div className="space-y-3">
            <div className="text-[15px] leading-relaxed">{rendered}</div>
            {extra && (
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-400 mb-1">Extra</p>
                    <p className="text-sm font-medium text-blue-800 leading-relaxed">{extra}</p>
                </div>
            )}
        </div>
    )
}

function OcclusionNoteCard({ note }: { note: Note }) {
    const masks = note.occlusionMasks ?? []
    const groups = [...new Set(masks.map((m) => m.groupIndex))].length
    const labeledGroups = [...new Set(masks.filter((m) => m.label).map((m) => m.groupIndex))]

    return (
        <div className="space-y-2">
            {note.imageUrl ? (
                <div className="relative w-full max-w-[280px] aspect-[4/3] overflow-hidden rounded-xl border border-beige bg-cream/30 shadow-sm">
                    <img src={note.imageUrl} alt="" className="absolute inset-0 w-full h-full object-contain p-2" />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-lg bg-black/70 px-2.5 py-1 text-white shadow-md backdrop-blur-sm">
                        <span className="text-[10px] font-black uppercase tracking-wider">{groups}</span>
                        <span className="text-[10px] font-medium opacity-80">masks</span>
                    </div>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {masks.map((m, i) => (
                            <rect
                                key={i}
                                x={m.x} y={m.y}
                                width={m.width} height={m.height}
                                fill="rgba(245,158,11,0.25)"
                                stroke="rgba(245,158,11,0.6)"
                                strokeWidth={0.5}
                                rx={1}
                            />
                        ))}
                    </svg>
                </div>
            ) : (
                <div className="flex items-center justify-center aspect-video rounded-2xl bg-cream/60 border-2 border-dashed border-beige">
                    <span className="text-[12px] font-bold uppercase tracking-widest text-text-muted/60">No Image</span>
                </div>
            )}
            {labeledGroups.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {labeledGroups.map((g) => {
                        const label = masks.find((m) => m.groupIndex === g)?.label
                        return label ? (
                            <span key={g} className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                                <span className="size-1.5 rounded-full bg-amber-400" />
                                {label}
                            </span>
                        ) : null
                    })}
                </div>
            )}
        </div>
    )
}

export function NoteCard({ note, isOwner, onEdit, onDelete, onRelated }: NoteCardProps) {
    const type = note.templateType
    const isCloze = type === "CLOZE"
    const isOcclusion = type === "IMAGE_OCCLUSION"
    const badge = TYPE_BADGE[type ?? ""]

    return (
        <div className="group relative flex flex-col sm:flex-row gap-5 rounded-[24px] border border-beige bg-white p-5 shadow-sm transition-all hover:border-terracotta/30 hover:shadow-md">
            {isOwner && (
                <div className="absolute right-3 top-3 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex size-8 items-center justify-center rounded-xl border border-neutral-200 bg-white text-black shadow-sm transition-all hover:bg-neutral-50 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
                                <MoreHorizontal className="size-3.5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl">
                            <DropdownMenuItem onClick={() => onRelated(note)}>
                                <BookOpen className="size-3.5" />
                                Đồng nghĩa / Trái nghĩa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(note)}>
                                <PencilIcon className="size-3.5" />
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(note)}
                                className="text-red-600 focus:bg-red-50 focus:text-red-600"
                            >
                                <TrashIcon className="size-3.5" />
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            <div className="flex-1 min-w-0 space-y-3">
                {badge && (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] ${badge.className}`}>
                        {badge.label}
                    </span>
                )}

                {isCloze ? (
                    <ClozeNoteCard note={note} />
                ) : isOcclusion ? (
                    <OcclusionNoteCard note={note} />
                ) : (
                    <>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-xl font-black text-text-primary tracking-tight">{note.word}</h3>
                            {note.ipa && (
                                <span className="text-sm font-medium text-text-muted italic">{note.ipa}</span>
                            )}
                            {note.partOfSpeech && (
                                <span className="rounded-full bg-peach px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-terracotta border border-peach-dark/20">
                                    {note.partOfSpeech}
                                </span>
                            )}
                        </div>

                        <p className="text-sm font-semibold text-text-primary leading-relaxed">
                            {note.meaning}
                        </p>

                        {note.example && (
                            <div className="rounded-xl bg-cream/50 border border-beige/60 p-3.5">
                                <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Example</p>
                                <p className="text-sm font-medium text-text-primary/90 italic leading-relaxed">
                                    &ldquo;{note.example}&rdquo;
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="flex flex-col items-center gap-3 sm:w-44 shrink-0">
                {isOcclusion ? null : note.imageUrl ? (
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl border border-beige/60 shadow-sm">
                        <img src={note.imageUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                ) : (
                    <div className="flex w-full aspect-[4/3] items-center justify-center rounded-2xl bg-cream/60 border border-beige/40">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">No Image</span>
                    </div>
                )}

                {!(isCloze || isOcclusion) && (
                    note.audioUrl ? (
                        <button
                            onClick={() => { const a = new Audio(note.audioUrl!); a.play().catch(() => { }) }}
                            className="flex items-center gap-2 rounded-xl bg-terracotta/10 px-4 py-2 text-xs font-bold text-terracotta transition-all hover:bg-terracotta hover:text-white active:scale-95"
                        >
                            <Volume2 className="size-3.5" />
                            Play Audio
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 rounded-xl bg-beige/30 px-4 py-2 text-xs font-bold text-text-muted">
                            <Volume2 className="size-3.5" />
                            No Audio
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
