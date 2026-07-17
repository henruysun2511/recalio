"use client"

import { useState, useRef, useMemo, useCallback } from "react"
import { Loader2, X, Upload, Archive, Trash2, ImageIcon, PlusIcon, Volume2 } from "lucide-react"
import JSZip from "jszip"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSupportedLanguages } from "@/queries/useLanguageQuery"
import { useConfirmNotes, usePreviewNotes } from "@/queries/useNoteQuery"
import { useCreateDeck } from "@/queries/useDeckQuery"
import { handleError } from "@/utils/handleError"
import { Algorithm, LeechAction, NoteTemplateType } from "@/constants/type"
import { useNoteTemplates } from "@/queries/useNoteTemplateQuery"
import { useImageUpload } from "@/hooks/useImageUpload"
import cloudinaryService from "@/services/cloudinary.service"
import { CardPreview } from "./[id]/create-notes/card-preview"
import { ImageOcclusionCardView } from "./[id]/create-notes/image-occlusion-card-view"

interface RclNote {
    templateType: string
    languageId: string
    fields: Record<string, any>
    audioUrl: string | null
    imageUrl: string | null
    tags: string[]
    cards: { cardTemplateName: string; variantIndex: number | null }[]
    masks: { x: number; y: number; width: number; height: number; groupIndex: number; label: string | null }[]
}

interface RclTemplateMapping {
    templateType: string
    fieldNames: string[]
    cardTemplates: { name: string; frontHtml: string; backHtml: string; css?: string }[]
}

interface RclData {
    deck: { name: string; fullPath?: string; description?: string; coverImage?: string; tags?: string[] }
    setting: any
    templateMappings: RclTemplateMapping[]
    notes: RclNote[]
}

interface EditableNote {
    id: number
    templateType: string
    fields: Record<string, any>
    masks: { x: number; y: number; width: number; height: number; groupIndex: number; label: string | null }[]
    audioUrl: string | null
    imageUrl: string | null
}

interface SettingFields {
    algorithm: string
    newCardsPerDay: string
    reviewsPerDay: string
    learningSteps: string
    graduatingInterval: string
    easyInterval: string
    intervalModifier: string
    easyBonus: string
    hardInterval: string
    maximumInterval: string
    lapseSteps: string
    minimumInterval: string
    leechThreshold: string
    leechAction: string
    fsrsWeights: string
    requestRetention: string
}

const DEFAULT_SETTING: SettingFields = {
    algorithm: "FSRS",
    newCardsPerDay: "20",
    reviewsPerDay: "200",
    learningSteps: "1 10",
    graduatingInterval: "1",
    easyInterval: "4",
    intervalModifier: "1.0",
    easyBonus: "1.3",
    hardInterval: "1.2",
    maximumInterval: "36500",
    lapseSteps: "10",
    minimumInterval: "1",
    leechThreshold: "8",
    leechAction: "SUSPEND",
    fsrsWeights: "",
    requestRetention: "0.9",
}

function parseSetting(data: any): SettingFields {
    if (!data) return { ...DEFAULT_SETTING }
    return {
        algorithm: data.algorithm ?? DEFAULT_SETTING.algorithm,
        newCardsPerDay: String(data.newCardsPerDay ?? DEFAULT_SETTING.newCardsPerDay),
        reviewsPerDay: String(data.reviewsPerDay ?? DEFAULT_SETTING.reviewsPerDay),
        learningSteps: data.learningSteps ?? DEFAULT_SETTING.learningSteps,
        graduatingInterval: String(data.graduatingInterval ?? DEFAULT_SETTING.graduatingInterval),
        easyInterval: String(data.easyInterval ?? DEFAULT_SETTING.easyInterval),
        intervalModifier: String(data.intervalModifier ?? DEFAULT_SETTING.intervalModifier),
        easyBonus: String(data.easyBonus ?? DEFAULT_SETTING.easyBonus),
        hardInterval: String(data.hardInterval ?? DEFAULT_SETTING.hardInterval),
        maximumInterval: String(data.maximumInterval ?? DEFAULT_SETTING.maximumInterval),
        lapseSteps: data.lapseSteps ?? DEFAULT_SETTING.lapseSteps,
        minimumInterval: String(data.minimumInterval ?? DEFAULT_SETTING.minimumInterval),
        leechThreshold: String(data.leechThreshold ?? DEFAULT_SETTING.leechThreshold),
        leechAction: data.leechAction ?? DEFAULT_SETTING.leechAction,
        fsrsWeights: data.fsrsWeights ?? "",
        requestRetention: String(data.requestRetention ?? DEFAULT_SETTING.requestRetention),
    }
}

function buildSettingPayload(s: SettingFields): Record<string, any> {
    return {
        algorithm: s.algorithm,
        newCardsPerDay: Number(s.newCardsPerDay),
        reviewsPerDay: Number(s.reviewsPerDay),
        learningSteps: s.learningSteps,
        graduatingInterval: Number(s.graduatingInterval),
        easyInterval: Number(s.easyInterval),
        intervalModifier: Number(s.intervalModifier),
        easyBonus: Number(s.easyBonus),
        hardInterval: Number(s.hardInterval),
        maximumInterval: Number(s.maximumInterval),
        lapseSteps: s.lapseSteps,
        minimumInterval: Number(s.minimumInterval),
        leechThreshold: Number(s.leechThreshold),
        leechAction: s.leechAction,
        fsrsWeights: s.fsrsWeights || null,
        requestRetention: Number(s.requestRetention),
    }
}

interface RclImportDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RclImportDialog({ open, onOpenChange }: RclImportDialogProps) {
    const [step, setStep] = useState<"upload" | "edit">("upload")
    const [loading, setLoading] = useState(false)
    const [templateMappings, setTemplateMappings] = useState<RclTemplateMapping[]>([])
    const [notes, setNotes] = useState<EditableNote[]>([])
    const [deckName, setDeckName] = useState("")
    const [deckDescription, setDeckDescription] = useState("")
    const [deckCoverImage, setDeckCoverImage] = useState("")
    const [deckTags, setDeckTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const [isPublic, setIsPublic] = useState(false)
    const [languageId, setLanguageId] = useState("")
    const [setting, setSetting] = useState<SettingFields>({ ...DEFAULT_SETTING })
    const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)
    const [previewResult, setPreviewResult] = useState<any>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { data: templatesRes } = useNoteTemplates()
    const allTemplates = ((templatesRes as any)?.data ?? []) as { id: string; name: string; type: string }[]
    const { data: langRes } = useSupportedLanguages()
    const languages = ((langRes as any)?.data ?? []) as { id: string; name: string; nativeName: string; flagEmoji: string }[]
    const createDeckMutation = useCreateDeck()
    const confirmNotesMutation = useConfirmNotes()
    const previewMutation = usePreviewNotes()
    const { handleUpload: handleCoverUpload, isUploading: isCoverUploading, deleteMediaMutation } = useImageUpload()
    const [noteUploading, setNoteUploading] = useState<number | null>(null)

    const reset = useCallback(() => {
        setStep("upload")
        setTemplateMappings([])
        setNotes([])
        setDeckName("")
        setDeckDescription("")
        setDeckCoverImage("")
        setDeckTags([])
        setTagInput("")
        setIsPublic(false)
        setLanguageId("")
        setSetting({ ...DEFAULT_SETTING })
        setSelectedNoteId(null)
        setLoading(false)
    }, [])

    const findTemplateByType = useCallback((type: string): string => {
        const t = allTemplates.find((t) => t.type === type)
        return t?.id ?? ""
    }, [allTemplates])

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        if (!f.name.endsWith(".rcl")) { toast.error("Vui lòng chọn file .rcl"); return }

        setLoading(true)
        try {
            const buf = await f.arrayBuffer()
            const zip = await JSZip.loadAsync(buf)

            const manifestEntry = zip.file("manifest.json")
            const deckEntry = zip.file("deck.json")
            if (!manifestEntry || !deckEntry) {
                toast.error("File .rcl không hợp lệ: thiếu manifest.json hoặc deck.json")
                setLoading(false)
                return
            }

            const manifestStr = await manifestEntry.async("string")
            const manifest = JSON.parse(manifestStr)
            if (manifest.version !== 1) {
                toast.error(`Phiên bản .rcl không được hỗ trợ: ${manifest.version}`)
                setLoading(false)
                return
            }

            const deckStr = await deckEntry.async("string")
            const data: RclData = JSON.parse(deckStr)

            if (!data.notes?.length) {
                toast.error("File .rcl không có note nào")
                setLoading(false)
                return
            }

            setTemplateMappings(data.templateMappings || [])
            setDeckName(data.deck?.name || f.name.replace(/\.rcl$/i, ""))
            setDeckDescription(data.deck?.description || "")
            setDeckCoverImage(data.deck?.coverImage || "")
            setDeckTags(data.deck?.tags || [])
            setIsPublic(false)
            setSetting(parseSetting(data.setting))

            const editable = data.notes.map((n, i) => ({
                id: i,
                templateType: n.templateType,
                fields: { ...(n.fields || {}) },
                masks: [...(n.masks || [])],
                audioUrl: n.audioUrl,
                imageUrl: n.imageUrl,
            }))
            setNotes(editable)
            setSelectedNoteId(null)
            setPreviewResult(null)
            setStep("edit")
            toast.success(`Đọc được ${data.notes.length} notes từ "${data.deck?.name || "deck"}"`)
        } catch (err) {
            handleError(err, "Không thể đọc file .rcl")
        } finally {
            setLoading(false)
        }
    }

    const handleNoteFieldChange = (noteId: number, field: string, value: any) => {
        setNotes((prev) => prev.map((n) =>
            n.id === noteId ? { ...n, fields: { ...n.fields, [field]: value } } : n
        ))
    }

    const handleNoteTemplateChange = (noteId: number, templateType: string) => {
        setNotes((prev) => prev.map((n) =>
            n.id === noteId ? { ...n, templateType } : n
        ))
    }

    const handleDeleteNote = (noteId: number) => {
        setNotes((prev) => prev.filter((n) => n.id !== noteId))
        if (selectedNoteId === noteId) setSelectedNoteId(null)
    }

    const addTag = () => {
        const trimmed = tagInput.trim()
        if (trimmed && !deckTags.includes(trimmed)) {
            setDeckTags((prev) => [...prev, trimmed])
        }
        setTagInput("")
    }

    const removeTag = (tag: string) => {
        setDeckTags((prev) => prev.filter((t) => t !== tag))
    }

    const getNoteDisplayFields = (note: EditableNote): { label: string; key: string; value: string }[] => {
        const type = note.templateType
        if (type === NoteTemplateType.CLOZE) {
            return [
                { label: "Text", key: "Text", value: note.fields.Text ?? "" },
                { label: "Extra", key: "Extra", value: note.fields.Extra ?? "" },
            ]
        }
        if (type === NoteTemplateType.IMAGE_OCCLUSION) {
            return Object.entries(note.fields).map(([k, v]) => ({ label: k, key: k, value: String(v ?? "") }))
        }
        return [
            { label: "Word", key: "Word", value: note.fields.Word ?? note.fields.word ?? "" },
            { label: "Meaning", key: "Meaning", value: note.fields.Meaning ?? note.fields.meaning ?? "" },
            { label: "IPA", key: "IPA", value: note.fields.IPA ?? note.fields.ipa ?? "" },
            { label: "Part of Speech", key: "PartOfSpeech", value: note.fields.PartOfSpeech ?? note.fields.partOfSpeech ?? "" },
            { label: "Example", key: "Example", value: note.fields.Example ?? note.fields.example ?? "" },
        ]
    }

    const convertNoteToConfirmPayload = (note: EditableNote, templateId: string, langId: string) => {
        const type = note.templateType
        const base: any = { languageId: langId, templateId }
        if (type === NoteTemplateType.CLOZE) {
            base.fields = note.fields
        } else if (type === NoteTemplateType.IMAGE_OCCLUSION) {
            base.imageUrl = note.imageUrl || undefined
            base.fields = note.fields
            base.masks = note.masks.length > 0 ? note.masks : undefined
        } else {
            base.word = note.fields.Word ?? note.fields.word ?? ""
            base.meaning = note.fields.Meaning ?? note.fields.meaning ?? ""
            base.ipa = note.fields.IPA ?? note.fields.ipa ?? undefined
            base.partOfSpeech = note.fields.PartOfSpeech ?? note.fields.partOfSpeech ?? undefined
            base.example = note.fields.Example ?? note.fields.example ?? undefined
            base.imageUrl = note.imageUrl || undefined
            base.audioUrl = note.audioUrl || undefined
            base.fields = note.fields
        }
        return base
    }

    const handlePreview = async () => {
        if (!languageId) { toast.error("Vui lòng chọn ngôn ngữ"); return }
        const basicNotes = notes.filter((n) =>
            n.templateType !== NoteTemplateType.CLOZE && n.templateType !== NoteTemplateType.IMAGE_OCCLUSION
        )
        if (basicNotes.length === 0) { toast.error("Không có note BASIC nào để preview"); return }
        try {
            const res = await previewMutation.mutateAsync({
                words: basicNotes.map((n) => ({
                    word: n.fields.Word ?? n.fields.word ?? "",
                    detectedLanguage: languageId,
                })),
            })
            setPreviewResult((res as any)?.data?.data ?? res)
            toast.success("Preview thành công")
        } catch (error) {
            handleError(error, "Preview thất bại")
        }
    }

    const handleSubmit = async () => {
        if (!deckName.trim()) { toast.error("Vui lòng nhập tên bộ thẻ"); return }
        if (!languageId) { toast.error("Vui lòng chọn ngôn ngữ"); return }
        if (notes.length === 0) { toast.error("Không có note nào để import"); return }

        setLoading(true)
        try {
            const createRes: any = await createDeckMutation.mutateAsync({
                name: deckName.trim(),
                description: deckDescription.trim() || undefined,
                coverImage: deckCoverImage || undefined,
                tags: deckTags.length > 0 ? deckTags : undefined,
                isPublic,
                setting: buildSettingPayload(setting),
            } as any)
            const newDeckId = (createRes as any)?.data?.id ?? (createRes as any)?.data?.data?.id
            if (!newDeckId) throw new Error("Không thể lấy ID deck mới")

            const words: any[] = []
            for (const n of notes) {
                const tplId = findTemplateByType(n.templateType)
                if (!tplId) { toast.error(`Template type "${n.templateType}" không tồn tại trong hệ thống`); continue }
                words.push(convertNoteToConfirmPayload(n, tplId, languageId))
            }
            if (words.length === 0) throw new Error("Không có note hợp lệ")

            await confirmNotesMutation.mutateAsync({ deckId: newDeckId, words } as any)
            toast.success(`Import thành công: ${words.length} notes vào "${deckName}"`)
            onOpenChange(false)
            reset()
        } catch (error) {
            handleError(error, "Import thất bại")
        } finally {
            setLoading(false)
        }
    }

    const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null
    const selectedCardTemplates = useMemo(() => {
        if (!selectedNote) return null
        const mapping = templateMappings.find((m) => m.templateType === selectedNote.templateType)
        if (!mapping) return null
        return mapping.cardTemplates.map((ct, i) => ({
            id: `${mapping.templateType}-${i}`,
            name: ct.name,
            frontHtml: ct.frontHtml,
            backHtml: ct.backHtml,
            css: ct.css,
        }))
    }, [selectedNote, templateMappings])

    const selectedCardPreviewData = useMemo(() => {
        if (!selectedNote) return null
        const f = selectedNote.fields
        return {
            word: f.Word ?? f.word ?? f.Text ?? "",
            ipa: f.IPA ?? f.ipa ?? undefined,
            partOfSpeech: f.PartOfSpeech ?? f.partOfSpeech ?? undefined,
            meaning: f.Meaning ?? f.meaning ?? f.Extra ?? undefined,
            example: f.Example ?? f.example ?? undefined,
            audioUrl: selectedNote.audioUrl,
            imageUrl: selectedNote.imageUrl,
            fields: Object.fromEntries(Object.entries(f).map(([k, v]) => [k, String(v ?? "")])),
        }
    }, [selectedNote])

    const templateTypes = useMemo(() => [...new Set(allTemplates.map((t) => t.type))], [allTemplates])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-peach flex items-center justify-center">
                            <Archive className="size-5 text-terracotta" />
                        </div>
                        <div>
                            <DialogTitle>Import file .rcl</DialogTitle>
                            <DialogDescription>Import bộ thẻ từ file Recalio (.rcl)</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {step === "upload" ? (
                    <div className="py-8">
                        <input type="file" accept=".rcl" ref={fileInputRef} onChange={handleFileSelect} hidden />
                        {loading ? (
                            <div className="flex items-center justify-center gap-3 h-48">
                                <Loader2 className="size-6 animate-spin text-terracotta" />
                                <p className="text-sm font-bold text-text-muted">Đang đọc file...</p>
                            </div>
                        ) : (
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-48 rounded-2xl border-2 border-dashed border-beige bg-white/50 flex flex-col items-center justify-center gap-3 hover:border-terracotta/50 hover:bg-terracotta/5 transition-all cursor-pointer">
                                <Archive className="size-10 text-text-muted" />
                                <p className="text-sm font-bold text-text-muted">Click to upload .rcl file</p>
                                <p className="text-[10px] text-text-muted">.rcl — Recalio deck export format</p>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Language */}
                        <div className="w-56">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 mb-2 block">Language</label>
                            <Select value={languageId} onValueChange={setLanguageId}>
                                <SelectTrigger className="h-12 rounded-xl border-beige bg-white">
                                    <SelectValue placeholder="Choose language..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {languages.map((l) => (
                                        <SelectItem key={l.id} value={l.id}>{l.flagEmoji} {l.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Deck Info */}
                        <div className="rounded-2xl border border-beige bg-white/50 p-5 space-y-4">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Thông tin bộ thẻ</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="sm:col-span-2">
                                    <label className="text-[10px] font-bold text-text-muted block mb-1">Tên bộ thẻ *</label>
                                    <Input value={deckName} onChange={(e) => setDeckName(e.target.value)} className="h-10 rounded-xl border-beige" placeholder="Tên bộ thẻ..." />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-[10px] font-bold text-text-muted block mb-1">Mô tả</label>
                                    <Textarea value={deckDescription} onChange={(e) => setDeckDescription(e.target.value)} className="min-h-[60px] rounded-xl border-beige" placeholder="Mô tả bộ thẻ..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-text-muted block mb-1">Cover Image</label>
                                    <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const r = await handleCoverUpload(f, "decks"); if (r) setDeckCoverImage(r.url); } }} hidden id="cover-upload" />
                                    {deckCoverImage ? (
                                        <div className="relative h-32 w-full rounded-xl overflow-hidden border border-beige">
                                            <img src={deckCoverImage} alt="" className="size-full object-cover" />
                                            <button type="button" onClick={() => setDeckCoverImage("")} className="absolute top-2 right-2 size-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"><X className="size-3.5" /></button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <label htmlFor="cover-upload" className="flex-1 flex items-center justify-center h-10 rounded-xl border-2 border-dashed border-beige bg-cream/30 cursor-pointer hover:border-terracotta/40 text-xs font-bold text-text-muted gap-2">
                                                {isCoverUploading ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}
                                                {isCoverUploading ? "Đang tải..." : "Upload ảnh"}
                                            </label>
                                            <Input value={deckCoverImage} onChange={(e) => setDeckCoverImage(e.target.value)} className="h-10 rounded-xl border-beige text-xs flex-1" placeholder="Hoặc nhập URL..." />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-text-muted block mb-1">Tags</label>
                                    <div className="flex items-center gap-2">
                                        <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }} className="h-10 rounded-xl border-beige" placeholder="Thêm tag..." />
                                        <Button type="button" size="icon" variant="outline" onClick={addTag} className="size-10 shrink-0 rounded-xl border-beige"><PlusIcon className="size-4" /></Button>
                                    </div>
                                    {deckTags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {deckTags.map((tag) => (
                                                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-peach/60 px-3 py-1 text-xs font-medium text-terracotta">
                                                    {tag}
                                                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-terracotta-dark"><X className="size-3" /></button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <div>
                                    <label className="text-sm font-bold text-text-primary block">Công khai</label>
                                    <p className="text-xs text-text-muted">Cho phép người khác xem và clone</p>
                                </div>
                                <Switch checked={isPublic} onCheckedChange={setIsPublic} className="data-[state=checked]:bg-terracotta" />
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="rounded-2xl border border-beige bg-white/50 p-5 space-y-4">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Cài đặt học tập</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Algorithm</label>
                                    <Select value={setting.algorithm} onValueChange={(v) => setSetting((s) => ({ ...s, algorithm: v }))}>
                                        <SelectTrigger className="h-8 rounded-lg border-beige bg-white text-xs"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.values(Algorithm).map((a) => (<SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">New cards/day</label>
                                    <Input value={setting.newCardsPerDay} onChange={(e) => setSetting((s) => ({ ...s, newCardsPerDay: e.target.value }))} type="number" className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Reviews/day</label>
                                    <Input value={setting.reviewsPerDay} onChange={(e) => setSetting((s) => ({ ...s, reviewsPerDay: e.target.value }))} type="number" className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Learning steps</label>
                                    <Input value={setting.learningSteps} onChange={(e) => setSetting((s) => ({ ...s, learningSteps: e.target.value }))} className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Graduating interval</label>
                                    <Input value={setting.graduatingInterval} onChange={(e) => setSetting((s) => ({ ...s, graduatingInterval: e.target.value }))} type="number" className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Easy interval</label>
                                    <Input value={setting.easyInterval} onChange={(e) => setSetting((s) => ({ ...s, easyInterval: e.target.value }))} type="number" className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Interval modifier</label>
                                    <Input value={setting.intervalModifier} onChange={(e) => setSetting((s) => ({ ...s, intervalModifier: e.target.value }))} type="number" step="0.1" className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Easy bonus</label>
                                    <Input value={setting.easyBonus} onChange={(e) => setSetting((s) => ({ ...s, easyBonus: e.target.value }))} type="number" step="0.1" className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Hard interval</label>
                                    <Input value={setting.hardInterval} onChange={(e) => setSetting((s) => ({ ...s, hardInterval: e.target.value }))} type="number" step="0.1" className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Max interval</label>
                                    <Input value={setting.maximumInterval} onChange={(e) => setSetting((s) => ({ ...s, maximumInterval: e.target.value }))} type="number" className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Lapse steps</label>
                                    <Input value={setting.lapseSteps} onChange={(e) => setSetting((s) => ({ ...s, lapseSteps: e.target.value }))} className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Min interval</label>
                                    <Input value={setting.minimumInterval} onChange={(e) => setSetting((s) => ({ ...s, minimumInterval: e.target.value }))} type="number" className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Leech threshold</label>
                                    <Input value={setting.leechThreshold} onChange={(e) => setSetting((s) => ({ ...s, leechThreshold: e.target.value }))} type="number" className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Leech action</label>
                                    <Select value={setting.leechAction} onValueChange={(v) => setSetting((s) => ({ ...s, leechAction: v }))}>
                                        <SelectTrigger className="h-8 rounded-lg border-beige bg-white text-xs"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.values(LeechAction).map((a) => (<SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">Request retention</label>
                                    <Input value={setting.requestRetention} onChange={(e) => setSetting((s) => ({ ...s, requestRetention: e.target.value }))} type="number" step="0.01" className="h-8 rounded-lg border-beige text-xs" />
                                </div>
                                <div className="col-span-2 sm:col-span-3 lg:col-span-4">
                                    <label className="text-[9px] font-bold text-text-muted block mb-0.5">FSRS weights</label>
                                    <Input value={setting.fsrsWeights} onChange={(e) => setSetting((s) => ({ ...s, fsrsWeights: e.target.value }))} className="h-8 rounded-lg border-beige text-xs" placeholder="Comma-separated weights (optional)" />
                                </div>
                            </div>
                        </div>

                        {/* Template Mappings */}
                        {templateMappings.length > 0 && (
                            <div className="rounded-2xl border border-beige bg-white/50 p-5 space-y-3">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Template Mappings ({templateMappings.length})</p>
                                <div className="space-y-2">
                                    {templateMappings.map((m) => (
                                        <details key={m.templateType} className="rounded-xl border border-beige bg-white p-3">
                                            <summary className="text-xs font-bold text-text-primary cursor-pointer">{m.templateType} — {m.fieldNames.join(", ")}</summary>
                                            <div className="mt-2 space-y-2 text-[10px]">
                                                <p className="text-text-muted font-medium">Card templates ({m.cardTemplates.length}):</p>
                                                {m.cardTemplates.map((ct, i) => (
                                                    <div key={i} className="rounded-lg bg-cream/50 p-2 space-y-1">
                                                        <p className="font-bold text-text-primary">{ct.name}</p>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <span className="text-text-muted">Front:</span>
                                                                <pre className="bg-white rounded border border-beige p-1.5 mt-0.5 text-[9px] overflow-x-auto">{ct.frontHtml}</pre>
                                                            </div>
                                                            <div>
                                                                <span className="text-text-muted">Back:</span>
                                                                <pre className="bg-white rounded border border-beige p-1.5 mt-0.5 text-[9px] overflow-x-auto">{ct.backHtml}</pre>
                                                            </div>
                                                        </div>
                                                        {ct.css && <pre className="bg-white rounded border border-beige p-1.5 text-[9px] overflow-x-auto">{ct.css}</pre>}
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notes + Preview */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="space-y-3 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Notes ({notes.length})</p>
                                    {previewResult?.summary && (
                                        <p className="text-[10px] text-text-muted">
                                            Audio: {previewResult.summary.cacheHit} hit, {previewResult.summary.cacheMiss} miss, {previewResult.summary.unsupportedLanguage} unsupported
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                    {notes.map((note) => {
                                        const displayFields = getNoteDisplayFields(note)
                                        return (
                                            <div key={note.id} data-selected={selectedNoteId === note.id} onClick={() => setSelectedNoteId(note.id)} className="rounded-xl border border-beige bg-white p-4 space-y-3 cursor-pointer transition-all hover:border-terracotta/30 data-[selected=true]:border-terracotta data-[selected=true]:ring-1 data-[selected=true]:ring-terracotta/20">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-bold text-text-muted bg-cream px-2 py-1 rounded-md">#{note.id + 1}</span>
                                                        <div onClick={(e) => e.stopPropagation()}>
                                                            <Select value={note.templateType} onValueChange={(v) => handleNoteTemplateChange(note.id, v)}>
                                                                <SelectTrigger className="h-7 rounded-lg border-beige bg-white text-[10px] font-bold w-36">
                                                                    <SelectValue placeholder="Template" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {templateTypes.map((t) => (
                                                                        <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id) }} className="size-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                                                    {displayFields.map((f) => (
                                                        <div key={f.key} className={f.key === "Example" || f.key === "Text" || f.key === "Extra" ? "sm:col-span-2" : ""}>
                                                            <label className="text-[10px] font-bold text-text-muted block mb-0.5">{f.label}</label>
                                                            {f.key === "Example" || f.key === "Text" || f.key === "Extra" ? (
                                                                <Textarea value={f.value} onChange={(e) => handleNoteFieldChange(note.id, f.key, e.target.value)} className="min-h-[50px] rounded-lg border-beige text-xs" />
                                                            ) : (
                                                                <Input value={f.value} onChange={(e) => handleNoteFieldChange(note.id, f.key, e.target.value)} className="h-8 rounded-lg border-beige text-xs" />
                                                            )}
                                                        </div>
                                                    ))}
                                                    <div className="col-span-full flex items-center gap-2">
                                                        <input type="file" accept="image/*" hidden id={`note-img-${note.id}`} onChange={async (e) => {
                                                            const f = e.target.files?.[0]; if (!f) return;
                                                            setNoteUploading(note.id);
                                                            try { const res = await cloudinaryService.upload(f); const r = (res as any)?.data?.data ?? (res as any)?.data; const url = r?.secure_url ?? r?.url; if (url) { setNotes((prev) => prev.map((n) => n.id === note.id ? { ...n, imageUrl: url } : n)); toast.success("Upload ảnh thành công"); } } catch (err) { handleError(err, "Upload ảnh thất bại"); } finally { setNoteUploading(null); }
                                                        }} />
                                                        <label htmlFor={`note-img-${note.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-beige text-[10px] font-bold text-text-muted cursor-pointer hover:border-terracotta/40 hover:text-terracotta transition-colors">
                                                            {noteUploading === note.id ? <Loader2 className="size-3.5 animate-spin" /> : <ImageIcon className="size-3.5" />}
                                                            {noteUploading === note.id ? "..." : "Image"}
                                                        </label>
                                                        {note.imageUrl ? (
                                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-beige shrink-0">
                                                                <img src={note.imageUrl} alt="" className="size-full object-cover" />
                                                                <button type="button" onClick={() => setNotes((prev) => prev.map((n) => n.id === note.id ? { ...n, imageUrl: null } : n))} className="absolute top-0 right-0 size-4 flex items-center justify-center rounded-bl-lg bg-black/50 text-white hover:bg-black/70"><X className="size-2.5" /></button>
                                                            </div>
                                                        ) : null}
                                                        {note.templateType === NoteTemplateType.IMAGE_OCCLUSION && note.masks.length > 0 && (
                                                            <span className="text-[10px] text-text-muted">{note.masks.length} masks</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Card Preview */}
                            <div className="space-y-3">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Card Preview</p>
                                {selectedNote && selectedCardPreviewData ? (
                                    selectedNote.templateType === NoteTemplateType.IMAGE_OCCLUSION ? (
                                        <div className="space-y-4">
                                            {selectedNote.masks.length > 0 ? (
                                                selectedNote.masks
                                                    .filter((m, i, arr) => arr.findIndex((x) => x.groupIndex === m.groupIndex) === i)
                                                    .map((m) => (
                                                        <div key={m.groupIndex}>
                                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Card {m.groupIndex + 1}</p>
                                                            <ImageOcclusionCardView imageUrl={selectedNote.imageUrl} masks={selectedNote.masks} variantIndex={m.groupIndex} showBack={false} compact />
                                                            <div className="mt-2">
                                                                <ImageOcclusionCardView imageUrl={selectedNote.imageUrl} masks={selectedNote.masks} variantIndex={m.groupIndex} showBack compact />
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="flex items-center justify-center h-48 rounded-2xl border-2 border-dashed border-beige bg-white/50">
                                                    <p className="text-sm font-medium text-text-muted">No occlusion masks</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : selectedCardTemplates && selectedCardTemplates.length > 0 ? (
                                        <CardPreview data={selectedCardPreviewData} templates={selectedCardTemplates} />
                                    ) : (
                                        <CardPreview data={selectedCardPreviewData} />
                                    )
                                ) : (
                                    <div className="flex items-center justify-center h-48 rounded-2xl border-2 border-dashed border-beige bg-white/50">
                                        <p className="text-sm font-medium text-text-muted">Click a note to preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-2">
                    {step === "edit" && (
                        <>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handlePreview} disabled={previewMutation.isPending} className="rounded-xl border-beige">
                                    {previewMutation.isPending ? <Loader2 className="size-4 animate-spin mr-1.5" /> : <Volume2 className="size-4 mr-1.5" />}
                                    Preview Audio
                                </Button>
                                <Button onClick={handleSubmit} disabled={loading || !deckName.trim() || !languageId} className="rounded-xl gap-2">
                                    {loading ? <Loader2 className="size-4 animate-spin" /> : <Archive className="size-4" />}
                                    {loading ? "Đang import..." : `Import ${notes.length} notes`}
                                </Button>
                            </div>
                            <Button variant="ghost" onClick={() => { onOpenChange(false); reset() }} className="rounded-xl">Hủy</Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
