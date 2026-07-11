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

export function NoteCard({ note, isOwner, onEdit, onDelete, onRelated }: NoteCardProps) {
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

            <div className="flex-1 space-y-3">
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
            </div>

            <div className="flex flex-col items-center gap-3 sm:w-44">
                {note.imageUrl ? (
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl border border-beige/60 shadow-sm">
                        <img
                            src={note.imageUrl}
                            alt={note.word ?? ""}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex w-full aspect-[4/3] items-center justify-center rounded-2xl bg-cream/60 border border-beige/40">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">No Image</span>
                    </div>
                )}

                {note.audioUrl ? (
                    <button
                        onClick={() => {
                            const audio = new Audio(note.audioUrl!)
                            audio.play().catch(() => { })
                        }}
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
                )}
            </div>
        </div>
    )
}
