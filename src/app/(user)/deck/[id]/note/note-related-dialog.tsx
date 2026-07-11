"use client"

import { useRelatedNotes } from "@/queries/useAIQuery"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, BookOpen, Ban } from "lucide-react"
import { useEffect } from "react"
import { handleError } from "@/utils/handleError"
import type { AiNote } from "@/schemas/ai.schema"

interface NoteRelatedDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    word: string
    languageId: string
}

export function NoteRelatedDialog({ open, onOpenChange, word, languageId }: NoteRelatedDialogProps) {
    const { mutate, data, isPending, reset } = useRelatedNotes()

    useEffect(() => {
        if (open && word && languageId) {
            reset()
            mutate(
                { word, languageId },
                { onError: (error) => handleError(error) },
            )
        }
    }, [open, word, languageId])

    const result = (data as any)?.data?.data as { synonyms: AiNote[]; antonyms: AiNote[] } | undefined

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight">
                        Từ đồng nghĩa & trái nghĩa — &ldquo;{word}&rdquo;
                    </DialogTitle>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto space-y-6 py-4">
                    {isPending ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="size-8 animate-spin text-terracotta" />
                        </div>
                    ) : result ? (
                        <>
                            <Section title="Đồng nghĩa" icon={<BookOpen className="size-4" />} items={result.synonyms} />
                            <Section title="Trái nghĩa" icon={<Ban className="size-4" />} items={result.antonyms} />
                        </>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function Section({ title, icon, items }: { title: string; icon: React.ReactNode; items?: AiNote[] }) {
    if (!items?.length) return null

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-terracotta">
                {icon}
                {title}
                <span className="ml-1 text-text-muted font-normal">({items.length})</span>
            </div>
            <div className="space-y-2">
                {items.map((item, i) => (
                    <div key={i} className="rounded-xl border border-beige bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base font-bold text-text-primary">{item.word}</span>
                            {item.ipa && (
                                <span className="text-sm font-medium text-text-muted italic">{item.ipa}</span>
                            )}
                            {item.partOfSpeech && (
                                <span className="rounded-full bg-peach px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-terracotta">
                                    {item.partOfSpeech}
                                </span>
                            )}
                            <span className="ml-auto text-[10px] font-bold text-text-muted/60">
                                Độ khó: {item.difficulty}/5
                            </span>
                        </div>
                        {item.meaning && (
                            <p className="mt-1.5 text-sm font-semibold text-text-primary">{item.meaning}</p>
                        )}
                        {item.example && (
                            <p className="mt-1 text-xs text-text-muted italic">&ldquo;{item.example}&rdquo;</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
