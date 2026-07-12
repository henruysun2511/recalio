"use client"

import { useState, useMemo } from "react"
import { Loader2, Sparkles, Volume2, Eye } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Title } from "@/components/common/title"
import { useExtractFromText } from "@/queries/useAIQuery"
import { useSupportedLanguages } from "@/queries/useLanguageQuery"
import { useNoteTemplates, useCardTemplates } from "@/queries/useNoteTemplateQuery"
import { CardPreview, CardTemplate } from "@/app/(user)/deck/[id]/create-notes/card-preview"
import { WordItem, ExtendedWord, EditField } from "@/app/(user)/deck/[id]/create-notes/word-item"
import { handleError } from "@/utils/handleError"
import { NoteTemplateType } from "@/constants/type"
import type { AiNote } from "@/schemas/ai.schema"

export function AiTextSection() {
    const [text, setText] = useState("")
    const [languageId, setLanguageId] = useState("")
    const [words, setWords] = useState<ExtendedWord[]>([])
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editField, setEditField] = useState<EditField>("word")
    const [editValue, setEditValue] = useState("")

    const { data: templatesRes } = useNoteTemplates()
    const allTemplates = ((templatesRes as any)?.data ?? []) as { id: string; name: string; type: string }[]
    const templates = useMemo(() => allTemplates.filter((t) => t.type !== NoteTemplateType.CLOZE), [allTemplates])
    const { data: langRes } = useSupportedLanguages()
    const languages = ((langRes as any)?.data ?? []) as { id: string; name: string; nativeName: string; flagEmoji: string }[]
    const extractMutation = useExtractFromText()

    const selectedWord = words.find((w) => w.id === selectedId) ?? null
    const { data: cardTemplatesRes } = useCardTemplates(selectedWord?.templateId ?? "")
    const cardTemplates = ((cardTemplatesRes as any)?.data ?? []) as CardTemplate[]

    const defaultTemplateId = templates[0]?.id ?? ""

    const handleGenerate = async () => {
        if (!text.trim()) { toast.error("Vui lòng nhập văn bản"); return }
        if (!languageId) { toast.error("Vui lòng chọn ngôn ngữ"); return }
        try {
            const res = await extractMutation.mutateAsync({ text: text.trim(), languageId })
            const items = ((res as any)?.data?.data ?? []) as AiNote[]
            if (!items.length) { toast.info("Không tìm thấy từ vựng nào"); return }
            setWords(items.map((item, i) => ({ ...item, id: i, templateId: defaultTemplateId, imageUrl: null as string | null })))
            setSelectedId(null)
            toast.success(`Tìm thấy ${items.length} từ vựng`)
        } catch (error) {
            handleError(error)
        }
    }

    const startEdit = (id: number, field: EditField) => {
        const w = words.find((w) => w.id === id)
        if (!w) return
        setEditingId(id)
        setEditField(field)
        setEditValue((w as any)[field] ?? "")
    }

    const saveEdit = () => {
        setWords((prev) => prev.map((w) =>
            w.id === editingId ? { ...w, [editField]: editValue as any } : w
        ))
        setEditingId(null)
    }

    const cancelEdit = () => setEditingId(null)

    const handlePartOfSpeechChange = (id: number, value: any) => {
        setWords((prev) => prev.map((w) =>
            w.id === id ? { ...w, partOfSpeech: value } : w
        ))
    }

    return (
        <section id="ai-text" className="relative overflow-hidden py-24">
            <div className="absolute inset-0 bg-gradient-to-b from-peach-light/20 via-white to-peach-light/10" />
            <div className="relative mx-auto max-w-7xl px-8">
                <div className="text-center mb-14">
                    <span className="inline-flex rounded-full bg-peach px-4 py-2 text-sm font-semibold text-terracotta">
                        <Sparkles className="size-4 mr-1.5" /> Try It Now
                    </span>
                    <Title title="AI Text to Vocabulary" className="mt-5 text-5xl" />
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
                        Dán văn bản tiếng Anh vào đây, AI sẽ tự động trích xuất và tạo danh sách từ vựng kèm phiên âm, nghĩa và ví dụ.
                    </p>
                </div>

                <div className="rounded-[40px] border border-beige bg-white p-8 md:p-12 shadow-sm">
                    {/* Input Section */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="space-y-5">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 mb-2 block">
                                    Ngôn ngữ
                                </label>
                                <Select value={languageId} onValueChange={setLanguageId}>
                                    <SelectTrigger className="h-12 rounded-xl border-beige bg-cream">
                                        <SelectValue placeholder="Chọn ngôn ngữ..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map((l) => (
                                            <SelectItem key={l.id} value={l.id}>{l.flagEmoji} {l.name} ({l.nativeName})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 mb-2 block">
                                    Văn bản
                                </label>
                                <Textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Paste your English text here..."
                                    className="min-h-[160px] rounded-xl border-beige bg-cream resize-none"
                                />
                            </div>

                            <Button
                                onClick={handleGenerate}
                                disabled={extractMutation.isPending || !text.trim() || !languageId}
                                className="rounded-xl gap-2 h-12 w-full"
                                size="lg"
                            >
                                {extractMutation.isPending ? (
                                    <Loader2 className="size-5 animate-spin" />
                                ) : (
                                    <Sparkles className="size-5" />
                                )}
                                {extractMutation.isPending ? "Đang phân tích..." : "Generate Vocabulary"}
                            </Button>
                        </div>

                        {/* Results Section */}
                        <div>
                            {words.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                            Danh sách từ vựng ({words.length})
                                        </p>
                                        {selectedWord && (
                                            <p className="text-xs text-text-muted flex items-center gap-1">
                                                <Eye className="size-3.5" /> Click word để xem preview
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                                        {words.map((w) => {
                                            const isSelected = w.id === selectedId
                                            const isEditing = w.id === editingId
                                            return (
                                                <WordItem
                                                    key={w.id}
                                                    word={w}
                                                    templates={templates}
                                                    isSelected={isSelected}
                                                    isEditing={isEditing}
                                                    editField={editField}
                                                    editValue={editValue}
                                                    onSelect={() => { if (!isEditing) setSelectedId(w.id) }}
                                                    onStartEdit={(field) => startEdit(w.id, field)}
                                                    onSaveEdit={saveEdit}
                                                    onCancelEdit={cancelEdit}
                                                    onEditValueChange={setEditValue}
                                                    onPartOfSpeechChange={(val) => handlePartOfSpeechChange(w.id, val)}
                                                    onTemplateChange={(templateId) => setWords((prev) => prev.map((x) => x.id === w.id ? { ...x, templateId } : x))}
                                                    onImageChange={(imageUrl) => setWords((prev) => prev.map((x) => x.id === w.id ? { ...x, imageUrl } : x))}
                                                    onDelete={() => { setWords((prev) => prev.filter((x) => x.id !== w.id)); if (selectedId === w.id) setSelectedId(null) }}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px] rounded-2xl border-2 border-dashed border-beige bg-cream/50 p-8 text-center">
                                    <Sparkles className="size-10 text-terracotta/40 mb-4" />
                                    <p className="text-sm font-semibold text-text-muted mb-1">Chưa có từ vựng nào</p>
                                    <p className="text-xs text-text-muted/60">Nhập văn bản bên trái và nhấn Generate để bắt đầu</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card Preview Section */}
                    {selectedWord && (
                        <div className="mt-8 pt-8 border-t border-beige">
                            <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">
                                Card Preview
                            </p>
                            <CardPreview data={selectedWord} templates={cardTemplates} />
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
