"use client"

import { useState, useMemo } from "react"
import { Loader2, Sparkles, Check, X, Volume2 } from "lucide-react"
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
import { useExtractFromText } from "@/queries/useAIQuery"
import { useSupportedLanguages } from "@/queries/useLanguageQuery"
import { useConfirmNotes, usePreviewNotes } from "@/queries/useNoteQuery"
import { CardPreview, CardTemplate } from "./card-preview"
import { handleError } from "@/utils/handleError"
import { PartOfSpeech, NoteTemplateType } from "@/constants/type"
import { useNoteTemplates, useCardTemplates } from "@/queries/useNoteTemplateQuery"
import { WordItem, ExtendedWord, EditField } from "./word-item"
import type { AiNote } from "@/schemas/ai.schema"

interface AiGenerateFromTextTabProps {
    deckId: string
}

export function AiGenerateFromTextTab({ deckId }: AiGenerateFromTextTabProps) {
    const [text, setText] = useState("")
    const [languageId, setLanguageId] = useState("")
    const [words, setWords] = useState<ExtendedWord[]>([])
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editField, setEditField] = useState<EditField>("word")
    const [editValue, setEditValue] = useState("")
    const [previewResult, setPreviewResult] = useState<any>(null)

    const { data: templatesRes } = useNoteTemplates()
    const allTemplates = ((templatesRes as any)?.data ?? []) as { id: string; name: string; type: string }[]
    const templates = useMemo(() => allTemplates.filter((t) => t.type !== NoteTemplateType.CLOZE), [allTemplates])
    const { data: langRes } = useSupportedLanguages()
    const languages = ((langRes as any)?.data ?? []) as { id: string; name: string; nativeName: string; flagEmoji: string }[]
    const extractMutation = useExtractFromText()
    const confirmMutation = useConfirmNotes()
    const previewMutation = usePreviewNotes()

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
            setPreviewResult(null)
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

    const handlePartOfSpeechChange = (id: number, value: PartOfSpeech) => {
        setWords((prev) => prev.map((w) =>
            w.id === id ? { ...w, partOfSpeech: value } : w
        ))
    }

    const handlePreview = async () => {
        try {
            const res = await previewMutation.mutateAsync({
                words: words.map((w) => ({ word: w.word, detectedLanguage: languageId })),
            })
            setPreviewResult((res as any)?.data?.data ?? res)
            toast.success("Preview thành công")
        } catch (error) {
            handleError(error, "Preview thất bại")
        }
    }

    const handleCancelPreview = () => setPreviewResult(null)

    const handleSave = async () => {
        const invalid = words.filter((w) => !w.templateId)
        if (invalid.length) { toast.error(`Có ${invalid.length} từ chưa chọn template`); return }
        try {
            const payload = {
                deckId,
                words: words.map((w) => ({
                    languageId,
                    templateId: w.templateId,
                    word: w.word,
                    meaning: w.meaning,
                    ipa: w.ipa || undefined,
                    partOfSpeech: w.partOfSpeech || undefined,
                    example: w.example || undefined,
                    imageUrl: w.imageUrl || undefined,
                })),
            }
            await confirmMutation.mutateAsync(payload as any, {
                onSuccess: () => {
                    toast.success("Lưu từ vựng thành công")
                    setWords([])
                    setPreviewResult(null)
                    setText("")
                },
            })
        } catch (error) {
            handleError(error, "Lưu thất bại")
        }
    }

    const previewSummary = previewResult?.summary

    return (
        <div className="space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                    <div className="w-56">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 mb-2 block">
                            Language
                        </label>
                        <Select value={languageId} onValueChange={setLanguageId}>
                            <SelectTrigger className="h-12 rounded-xl border-beige bg-white">
                                <SelectValue placeholder="Choose language..." />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map((l) => (
                                    <SelectItem key={l.id} value={l.id}>{l.flagEmoji} {l.name} ({l.id})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">
                        Text
                    </label>
                    <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your text here..."
                        className="min-h-[120px] rounded-xl border-beige bg-white"
                    />
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={extractMutation.isPending || !text.trim() || !languageId}
                    className="rounded-xl gap-2"
                >
                    {extractMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Sparkles className="size-4" />
                    )}
                    {extractMutation.isPending ? "Đang phân tích..." : "Generate"}
                </Button>
            </div>

            {/* Word List */}
            {words.length > 0 && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                Danh sách từ vựng ({words.length})
                            </p>
                        </div>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
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

                        {/* Preview / Save Actions */}
                        {previewResult ? (
                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" onClick={handleCancelPreview} className="rounded-xl border-beige">
                                    <X className="size-4 mr-1.5" />
                                    Hủy
                                </Button>
                                <Button onClick={handleSave} disabled={confirmMutation.isPending} className="rounded-xl gap-2">
                                    {confirmMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                                    {confirmMutation.isPending ? "Đang lưu..." : "Lưu"}
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={handlePreview}
                                disabled={previewMutation.isPending}
                                className="rounded-xl gap-2"
                                variant="outline"
                            >
                                {previewMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Volume2 className="size-4" />}
                                {previewMutation.isPending ? "Đang preview..." : "Preview"}
                            </Button>
                        )}

                        {previewSummary && (
                            <p className="text-xs text-text-muted">
                                Audio: {previewSummary.cacheHit} cache hit, {previewSummary.cacheMiss} sẽ tạo, {previewSummary.unsupportedLanguage} không hỗ trợ
                            </p>
                        )}
                    </div>

                    {/* Right: CardPreview */}
                    <div className="space-y-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Card Preview</p>
                        {selectedWord ? (
                            <CardPreview data={selectedWord} templates={cardTemplates} />
                        ) : (
                            <div className="flex items-center justify-center h-64 rounded-2xl border-2 border-dashed border-beige bg-white/50">
                                <p className="text-sm font-medium text-text-muted">Click a word to preview</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

