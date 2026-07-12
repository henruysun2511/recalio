"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { Loader2, Sparkles, Check, X, Volume2, Upload, Crosshair } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDetectImage } from "@/queries/useAIQuery"
import { useSupportedLanguages } from "@/queries/useLanguageQuery"
import { useConfirmNotes, usePreviewNotes } from "@/queries/useNoteQuery"
import { CardPreview, CardTemplate } from "./card-preview"
import { handleError } from "@/utils/handleError"
import { PartOfSpeech, NoteTemplateType } from "@/constants/type"
import { useNoteTemplates, useCardTemplates } from "@/queries/useNoteTemplateQuery"
import { WordItem, ExtendedWord, EditField } from "./word-item"
import type { AiNote } from "@/schemas/ai.schema"

interface AiGenerateFromImageTabProps {
    deckId: string
}

export function AiGenerateFromImageTab({ deckId }: AiGenerateFromImageTabProps) {
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [languageId, setLanguageId] = useState("")
    const [words, setWords] = useState<ExtendedWord[]>([])
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editField, setEditField] = useState<EditField>("word")
    const [editValue, setEditValue] = useState("")
    const [previewResult, setPreviewResult] = useState<any>(null)
    const [detectedObjects, setDetectedObjects] = useState<Array<{ label: string; confidence: number; bbox: [number, number, number, number] }>>([])
    const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null)
    const [imgRect, setImgRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const analyzeContainerRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { data: templatesRes } = useNoteTemplates()
    const allTemplates = ((templatesRes as any)?.data ?? []) as { id: string; name: string; type: string }[]
    const templates = useMemo(() => allTemplates.filter((t) => t.type !== NoteTemplateType.CLOZE && t.type !== NoteTemplateType.IMAGE_OCCLUSION), [allTemplates])
    const { data: langRes } = useSupportedLanguages()
    const languages = ((langRes as any)?.data ?? []) as { id: string; name: string; nativeName: string; flagEmoji: string }[]
    const detectMutation = useDetectImage()
    const confirmMutation = useConfirmNotes()
    const previewMutation = usePreviewNotes()

    const selectedWord = words.find((w) => w.id === selectedId) ?? null
    const { data: cardTemplatesRes } = useCardTemplates(selectedWord?.templateId ?? "")
    const cardTemplates = ((cardTemplatesRes as any)?.data ?? []) as CardTemplate[]

    const defaultTemplateId = templates[0]?.id ?? ""

    const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget
        setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight })
    }, [])

    useEffect(() => {
        if (!naturalSize || !analyzeContainerRef.current) return
        const cw = analyzeContainerRef.current.clientWidth
        const ch = analyzeContainerRef.current.clientHeight
        const s = Math.min(cw / naturalSize.w, ch / naturalSize.h)
        setImgRect({
            x: (cw - naturalSize.w * s) / 2,
            y: (ch - naturalSize.h * s) / 2,
            w: naturalSize.w * s,
            h: naturalSize.h * s,
        })
    }, [naturalSize])

    const resetAll = useCallback(() => {
        if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
        setFile(null)
        setPreviewUrl(null)
        setWords([])
        setSelectedId(null)
        setPreviewResult(null)
        setDetectedObjects([])
        setNaturalSize(null)
        setImgRect(null)
    }, [previewUrl])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        if (!f.type.startsWith("image/")) { toast.error("Vui lòng chọn file ảnh"); return }
        if (f.size > 10 * 1024 * 1024) { toast.error("Ảnh không được quá 10MB"); return }
        if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl)
        setFile(f)
        setPreviewUrl(URL.createObjectURL(f))
        setWords([])
        setSelectedId(null)
        setPreviewResult(null)
        setDetectedObjects([])
        setNaturalSize(null)
        setImgRect(null)
    }, [previewUrl])

    const handleGenerate = async () => {
        if (!file) { toast.error("Vui lòng chọn ảnh"); return }
        if (!languageId) { toast.error("Vui lòng chọn ngôn ngữ"); return }
        try {
            const res = await detectMutation.mutateAsync(file)
            const data = (res as any)?.data?.data ?? (res as any)?.data ?? res as any
            const items = (data?.notes ?? []) as AiNote[]
            if (!items.length) { toast.info("Không tìm thấy từ vựng nào trong ảnh"); return }
            setDetectedObjects(data?.objects ?? [])
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
                    resetAll()
                    toast.success("Lưu từ vựng thành công")
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
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 mb-2 block">
                        Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        hidden
                    />
                    {previewUrl && detectedObjects.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-0.5">Original</p>
                                <div className="relative rounded-2xl overflow-hidden border-2 border-beige bg-white group">
                                    <img src={previewUrl} alt="Original" className="w-full h-[400px] object-contain bg-black/5" />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors cursor-pointer"
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 text-text-primary text-sm font-bold shadow-lg transition-opacity">
                                            <Upload className="size-4" />
                                            Change image
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-0.5">Analyzed</p>
                                <div ref={analyzeContainerRef} className="relative rounded-2xl border-2 border-beige bg-white">
                                    <img ref={imgRef} src={previewUrl} alt="Analyzed" className="w-full h-[400px] object-contain bg-black/5 rounded-2xl" onLoad={handleImageLoad} />
                                    {naturalSize && imgRect && (
                                        <div className="absolute pointer-events-none" style={{ left: imgRect.x, top: imgRect.y, width: imgRect.w, height: imgRect.h }}>
                                            <svg className="w-full h-full" viewBox={`0 0 ${naturalSize.w} ${naturalSize.h}`}>
                                                {detectedObjects.map((obj, i) => {
                                                    const color = ["#E85D3A", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"][i % 5]
                                                    // Gemini luôn trả bbox theo thang chuẩn hoá 0-1000 (không phải pixel thật,
                                                    // dù prompt yêu cầu "pixel relative to actual image dimensions")
                                                    const [bx, by, bw, bh] = obj.bbox
                                                    const x = (bx / 1000) * naturalSize.w
                                                    const y = (by / 1000) * naturalSize.h
                                                    const w = (bw / 1000) * naturalSize.w
                                                    const h = (bh / 1000) * naturalSize.h
                                                    // scale badge theo naturalSize để không bị tí hin trên ảnh độ phân giải cao
                                                    const badgeScale = naturalSize.w / 400
                                                    const r = 12 * badgeScale
                                                    const fontSize = 13 * badgeScale
                                                    const cx = x + r
                                                    const cy = y + r
                                                    return (
                                                        <g key={i}>
                                                            <rect x={x} y={y} width={w} height={h} fill="none" stroke={color} strokeWidth={3 * badgeScale} rx={4 * badgeScale} />
                                                            <circle cx={cx} cy={cy} r={r} fill={color} stroke="white" strokeWidth={2 * badgeScale} />
                                                            <text x={cx} y={cy + fontSize * 0.35} textAnchor="middle" fill="white" fontSize={fontSize} fontWeight="bold">{i + 1}</text>
                                                        </g>
                                                    )
                                                })}
                                            </svg>
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 text-white text-[10px] font-bold">
                                        <Crosshair className="size-3" />
                                        {detectedObjects.length} object{detectedObjects.length > 1 ? "s" : ""} detected
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {detectedObjects.map((obj, i) => {
                                        const color = ["#E85D3A", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"][i % 5]
                                        return (
                                            <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-beige bg-white text-[11px] font-bold">
                                                <span className="size-3.5 rounded-full flex items-center justify-center text-white text-[9px] font-black" style={{ backgroundColor: color }}>{i + 1}</span>
                                                <span className="text-text-primary">{obj.label}</span>
                                                <span className="text-text-muted font-medium">({(obj.confidence * 100).toFixed(0)}%)</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : previewUrl ? (
                        <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border-2 border-beige bg-white group">
                            <img src={previewUrl} alt="Preview" className="w-full h-[400px] object-contain bg-black/5" />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors cursor-pointer"
                            >
                                <span className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 text-text-primary text-sm font-bold shadow-lg transition-opacity">
                                    <Upload className="size-4" />
                                    Change image
                                </span>
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full max-w-2xl h-48 rounded-2xl border-2 border-dashed border-beige bg-white/50 flex flex-col items-center justify-center gap-2 hover:border-terracotta/50 hover:bg-terracotta/5 transition-all cursor-pointer"
                        >
                            <Upload className="size-8 text-text-muted" />
                            <p className="text-sm font-bold text-text-muted">Click to upload image</p>
                            <p className="text-[10px] text-text-muted">Max 10MB</p>
                        </button>
                    )}
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={detectMutation.isPending || !file || !languageId}
                    className="rounded-xl gap-2"
                >
                    {detectMutation.isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Sparkles className="size-4" />
                    )}
                    {detectMutation.isPending ? "Đang phân tích ảnh..." : "Generate"}
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
