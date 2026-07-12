"use client"

import { useState, useMemo } from "react"
import { Loader2, Sparkles, Check, X, Volume2, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useExtractFromTopic } from "@/queries/useAIQuery"
import { useSupportedLanguages } from "@/queries/useLanguageQuery"
import { useConfirmNotes, usePreviewNotes } from "@/queries/useNoteQuery"
import { CardPreview, CardTemplate } from "./card-preview"
import { handleError } from "@/utils/handleError"
import { PartOfSpeech, NoteTemplateType } from "@/constants/type"
import { useNoteTemplates, useCardTemplates } from "@/queries/useNoteTemplateQuery"
import { WordItem, ExtendedWord, EditField } from "./word-item"

const TOPICS = [
    "Greetings & Introductions", "Family & Relationships", "Food & Cooking", "Travel & Transportation",
    "Weather & Seasons", "Shopping & Money", "Health & Medicine", "Education & School",
    "Work & Careers", "Sports & Fitness", "Hobbies & Entertainment", "Technology & Internet",
    "Nature & Environment", "Animals & Pets", "House & Furniture", "Clothing & Fashion",
    "Books & Reading", "Movies & TV Shows", "Music & Instruments", "Art & Creativity",
    "Politics & Government", "Law & Justice", "History & Culture", "Science & Research",
    "Business & Economics", "News & Media", "Social Media & Communication", "Friendship & Socializing",
    "Feelings & Emotions", "Personality & Character", "Daily Routine", "Time & Dates",
    "Numbers & Math", "Colors & Shapes", "Directions & Locations", "Hotel & Accommodation",
    "Restaurant & Dining", "Banking & Finance", "Post Office & Services", "Phone & Communication",
    "Computer & Software", "Driving & Cars", "Airport & Flying", "Hospital & Emergencies",
    "Beach & Ocean", "Mountains & Hiking", "City Life", "Countryside & Farming",
    "Celebrations & Holidays", "Religion & Beliefs",
]

interface AiGenerateFromTopicTabProps {
    deckId: string
}

export function AiGenerateFromTopicTab({ deckId }: AiGenerateFromTopicTabProps) {
    const [languageId, setLanguageId] = useState("")
    const [selectedTopic, setSelectedTopic] = useState("")
    const [customTopic, setCustomTopic] = useState("")
    const [words, setWords] = useState<ExtendedWord[]>([])
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editField, setEditField] = useState<EditField>("word")
    const [editValue, setEditValue] = useState("")
    const [previewResult, setPreviewResult] = useState<any>(null)

    const { data: templatesRes } = useNoteTemplates()
    const allTemplates = ((templatesRes as any)?.data ?? []) as { id: string; name: string; type: string }[]
    const templates = useMemo(() => allTemplates.filter((t) => t.type !== NoteTemplateType.CLOZE && t.type !== NoteTemplateType.IMAGE_OCCLUSION), [allTemplates])
    const { data: langRes } = useSupportedLanguages()
    const languages = ((langRes as any)?.data ?? []) as { id: string; name: string; nativeName: string; flagEmoji: string }[]
    const extractMutation = useExtractFromTopic()
    const confirmMutation = useConfirmNotes()
    const previewMutation = usePreviewNotes()

    const selectedWord = words.find((w) => w.id === selectedId) ?? null
    const { data: cardTemplatesRes } = useCardTemplates(selectedWord?.templateId ?? "")
    const cardTemplates = ((cardTemplatesRes as any)?.data ?? []) as CardTemplate[]

    const defaultTemplateId = templates[0]?.id ?? ""
    const topic = selectedTopic || customTopic.trim()

    const handleGenerate = async () => {
        if (!topic) { toast.error("Vui lòng chọn hoặc nhập chủ đề"); return }
        if (!languageId) { toast.error("Vui lòng chọn ngôn ngữ"); return }
        try {
            const res = await extractMutation.mutateAsync({ topic, languageId, count: 25 })
            const items = ((res as any)?.data?.data ?? []) as any[]
            if (!items.length) { toast.info("Không tìm thấy từ vựng nào"); return }
            setWords(items.map((item, i) => ({ ...item, id: i, templateId: defaultTemplateId, imageUrl: null })))
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
                    setSelectedTopic("")
                    setCustomTopic("")
                },
            })
        } catch (error) {
            handleError(error, "Lưu thất bại")
        }
    }

    const previewSummary = previewResult?.summary

    return (
        <div className="space-y-6">
            <div className="space-y-4">
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

                <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 mb-3 block">
                        Chọn chủ đề
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto p-1">
                        {TOPICS.map((t) => (
                            <button
                                key={t}
                                onClick={() => { setSelectedTopic(t); setCustomTopic("") }}
                                data-active={selectedTopic === t}
                                className="px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all data-[active=true]:bg-terracotta data-[active=true]:text-white data-[active=true]:border-terracotta border-beige text-text-muted hover:border-terracotta/50 hover:text-text-primary"
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-text-muted">Hoặc nhập chủ đề khác:</span>
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-muted" />
                        <Input
                            value={customTopic}
                            onChange={(e) => { setCustomTopic(e.target.value); if (e.target.value) setSelectedTopic("") }}
                            placeholder="Nhập chủ đề bạn muốn..."
                            className="h-11 rounded-xl border-beige bg-white pl-10"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={extractMutation.isPending || !topic || !languageId}
                    className="rounded-xl gap-2"
                >
                    {extractMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Sparkles className="size-4" />
                    )}
                    {extractMutation.isPending ? "Đang tạo..." : "Generate"}
                </Button>
            </div>

            {words.length > 0 && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                Danh sách từ vựng ({words.length})
                            </p>
                        </div>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                            {words.map((w) => (
                                <WordItem
                                    key={w.id}
                                    word={w}
                                    templates={templates}
                                    isSelected={w.id === selectedId}
                                    isEditing={w.id === editingId}
                                    editField={editField}
                                    editValue={editValue}
                                    onSelect={() => { if (w.id !== editingId) setSelectedId(w.id) }}
                                    onStartEdit={(field) => startEdit(w.id, field)}
                                    onSaveEdit={saveEdit}
                                    onCancelEdit={cancelEdit}
                                    onEditValueChange={setEditValue}
                                    onPartOfSpeechChange={(val) => handlePartOfSpeechChange(w.id, val)}
                                    onTemplateChange={(templateId) => setWords((prev) => prev.map((x) => x.id === w.id ? { ...x, templateId } : x))}
                                    onImageChange={(imageUrl) => setWords((prev) => prev.map((x) => x.id === w.id ? { ...x, imageUrl } : x))}
                                    onDelete={() => { setWords((prev) => prev.filter((x) => x.id !== w.id)); if (selectedId === w.id) setSelectedId(null) }}
                                />
                            ))}
                        </div>

                        {previewResult ? (
                            <div className="flex gap-3 pt-2">
                                <Button variant="outline" onClick={handleCancelPreview} className="rounded-xl border-beige">
                                    <X className="size-4 mr-1.5" />Hủy
                                </Button>
                                <Button onClick={handleSave} disabled={confirmMutation.isPending} className="rounded-xl gap-2">
                                    {confirmMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                                    {confirmMutation.isPending ? "Đang lưu..." : "Lưu"}
                                </Button>
                            </div>
                        ) : (
                            <Button onClick={handlePreview} disabled={previewMutation.isPending} className="rounded-xl gap-2" variant="outline">
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
