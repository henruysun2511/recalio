"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { Loader2, Check, X, Volume2, Upload, FileSpreadsheet, AlertTriangle } from "lucide-react"
import Papa from "papaparse"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useSupportedLanguages } from "@/queries/useLanguageQuery"
import { useConfirmNotes, usePreviewNotes } from "@/queries/useNoteQuery"
import { CardPreview, CardTemplate } from "./card-preview"
import { handleError } from "@/utils/handleError"
import { PartOfSpeech, NoteTemplateType } from "@/constants/type"
import { useNoteTemplates, useCardTemplates } from "@/queries/useNoteTemplateQuery"
import { WordItem, ExtendedWord, EditField } from "./word-item"

const REQUIRED_COLUMNS = ["word", "meaning"] as const
const OPTIONAL_COLUMNS = ["ipa", "example", "partOfSpeech"] as const
const ALL_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS]

const COLUMN_ALIASES: Record<string, string> = {
    word: "word, từ, từ vựng, vocab, vocabulary, term, keyword",
    meaning: "meaning, nghĩa, definition, định nghĩa, dịch, translation, gloss",
    ipa: "ipa, pronunciation, phát âm, pronoun, phonetic",
    example: "example, ví dụ, example sentence, câu ví dụ, sentence, usage",
    partOfSpeech: "partOfSpeech, pos, loại từ, type, word type, speech part",
}

interface ColumnMapping {
    word: string
    meaning: string
    ipa?: string
    example?: string
    partOfSpeech?: string
}

interface CsvImportTabProps {
    deckId: string
}

export function CsvImportTab({ deckId }: CsvImportTabProps) {
    const [csvData, setCsvData] = useState<Record<string, string>[]>([])
    const [headers, setHeaders] = useState<string[]>([])
    const [mapping, setMapping] = useState<ColumnMapping>({ word: "", meaning: "" })
    const [languageId, setLanguageId] = useState("")
    const [words, setWords] = useState<ExtendedWord[]>([])
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editField, setEditField] = useState<EditField>("word")
    const [editValue, setEditValue] = useState("")
    const [previewResult, setPreviewResult] = useState<any>(null)
    const [parsed, setParsed] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { data: templatesRes } = useNoteTemplates()
    const allTemplates = ((templatesRes as any)?.data ?? []) as { id: string; name: string; type: string }[]
    const templates = useMemo(() => allTemplates.filter((t) => t.type !== NoteTemplateType.CLOZE), [allTemplates])
    const { data: langRes } = useSupportedLanguages()
    const languages = ((langRes as any)?.data ?? []) as { id: string; name: string; nativeName: string; flagEmoji: string }[]
    const confirmMutation = useConfirmNotes()
    const previewMutation = usePreviewNotes()

    const selectedWord = words.find((w) => w.id === selectedId) ?? null
    const { data: cardTemplatesRes } = useCardTemplates(selectedWord?.templateId ?? "")
    const cardTemplates = ((cardTemplatesRes as any)?.data ?? []) as CardTemplate[]

    const defaultTemplateId = templates[0]?.id ?? ""

    const findBestMatch = (header: string, field: string): boolean => {
        const aliases = COLUMN_ALIASES[field].toLowerCase().split(", ")
        return aliases.some((a) => header.toLowerCase().trim() === a.trim())
    }

    const autoDetectMapping = useCallback((cols: string[]): ColumnMapping => {
        const m: ColumnMapping = { word: "", meaning: "" }
        for (const col of cols) {
            const trimmed = col.trim()
            if (!m.word && findBestMatch(trimmed, "word")) m.word = col
            else if (!m.meaning && findBestMatch(trimmed, "meaning")) m.meaning = col
            else if (!m.ipa && findBestMatch(trimmed, "ipa")) m.ipa = col
            else if (!m.example && findBestMatch(trimmed, "example")) m.example = col
            else if (!m.partOfSpeech && findBestMatch(trimmed, "partOfSpeech")) m.partOfSpeech = col
        }
        if (!m.word && cols[0]) m.word = cols[0]
        if (!m.meaning && cols[1]) m.meaning = cols[1]
        return m
    }, [])

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        if (!f.name.endsWith(".csv")) { toast.error("Vui lòng chọn file CSV"); return }

        Papa.parse(f, {
            header: true,
            skipEmptyLines: true,
            encoding: "UTF-8",
            complete: (results) => {
                const rows = results.data as Record<string, string>[]
                const cols = results.meta.fields ?? []
                if (!rows.length || !cols.length) {
                    toast.error("File CSV trống hoặc không đúng định dạng")
                    return
                }
                setCsvData(rows)
                setHeaders(cols)
                setMapping(autoDetectMapping(cols))
                setParsed(true)
                setWords([])
                setSelectedId(null)
                setPreviewResult(null)
                toast.success(`Đọc được ${rows.length} dòng, ${cols.length} cột`)
            },
            error: () => {
                toast.error("Không thể đọc file CSV")
            },
        })
    }

    const validMapping = mapping.word && mapping.meaning

    const handleGenerate = () => {
        if (!validMapping) { toast.error("Vui lòng chọn cột Word và Meaning"); return }
        if (!languageId) { toast.error("Vui lòng chọn ngôn ngữ"); return }
        const parsed = csvData.map((row, i) => {
            const pos = row[mapping.partOfSpeech ?? ""]?.trim().toUpperCase() as PartOfSpeech
            return {
                id: i,
                word: row[mapping.word]?.trim() ?? "",
                meaning: row[mapping.meaning]?.trim() ?? "",
                ipa: mapping.ipa ? (row[mapping.ipa]?.trim() ?? "") : "",
                example: mapping.example ? (row[mapping.example]?.trim() ?? "") : "",
                partOfSpeech: Object.values(PartOfSpeech).includes(pos) ? pos : PartOfSpeech.OTHER,
                difficulty: 1,
                templateId: defaultTemplateId,
                imageUrl: null as string | null,
            }
        }).filter((w) => w.word && w.meaning)
        if (!parsed.length) { toast.error("Không có dữ liệu hợp lệ sau khi parse"); return }
        setWords(parsed)
        setSelectedId(null)
        setPreviewResult(null)
        toast.success(`Import ${parsed.length} từ vựng từ CSV`)
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
                    setCsvData([])
                    setParsed(false)
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

                <div className="rounded-2xl border border-beige bg-white/50 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                        <FileSpreadsheet className="size-4 text-terracotta" />
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-text-muted">Hướng dẫn</p>
                    </div>
                    <ul className="text-xs text-text-muted space-y-1.5 ml-1">
                        <li><span className="font-bold text-text-primary">Cột bắt buộc:</span> <code className="bg-cream px-1.5 py-0.5 rounded text-[10px] font-mono">word</code>, <code className="bg-cream px-1.5 py-0.5 rounded text-[10px] font-mono">meaning</code></li>
                        <li><span className="font-bold text-text-primary">Cột tuỳ chọn:</span> <code className="bg-cream px-1.5 py-0.5 rounded text-[10px] font-mono">ipa</code>, <code className="bg-cream px-1.5 py-0.5 rounded text-[10px] font-mono">example</code>, <code className="bg-cream px-1.5 py-0.5 rounded text-[10px] font-mono">partOfSpeech</code></li>
                        <li>Dòng đầu tiên phải là tiêu đề cột (header). Hệ thống tự động nhận diện cột theo tên.</li>
                        <li>Encoding: UTF-8. Dung lượng tối đa: 5MB.</li>
                    </ul>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[10px] border-collapse">
                            <thead>
                                <tr className="bg-cream">
                                    <th className="px-3 py-2 text-left font-bold text-text-primary border border-beige">word</th>
                                    <th className="px-3 py-2 text-left font-bold text-text-primary border border-beige">meaning</th>
                                    <th className="px-3 py-2 text-left font-bold text-text-primary border border-beige">ipa</th>
                                    <th className="px-3 py-2 text-left font-bold text-text-primary border border-beige">example</th>
                                    <th className="px-3 py-2 text-left font-bold text-text-primary border border-beige">partOfSpeech</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-3 py-2 text-text-muted border border-beige">hello</td>
                                    <td className="px-3 py-2 text-text-muted border border-beige">xin chào</td>
                                    <td className="px-3 py-2 text-text-muted border border-beige">/həˈloʊ/</td>
                                    <td className="px-3 py-2 text-text-muted border border-beige">Hello, how are you?</td>
                                    <td className="px-3 py-2 text-text-muted border border-beige">INTERJECTION</td>
                                </tr>
                                <tr>
                                    <td className="px-3 py-2 text-text-muted border border-beige">book</td>
                                    <td className="px-3 py-2 text-text-muted border border-beige">quyển sách</td>
                                    <td className="px-3 py-2 text-text-muted border border-beige">/bʊk/</td>
                                    <td className="px-3 py-2 text-text-muted border border-beige">I read a book.</td>
                                    <td className="px-3 py-2 text-text-muted border border-beige">NOUN</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 mb-2 block">
                        File CSV
                    </label>
                    <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileSelect} hidden />
                    {parsed ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 rounded-xl border border-beige bg-white px-4 py-3 text-sm font-medium text-text-primary truncate">
                                    {csvData.length} dòng × {headers.length} cột
                                </div>
                                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="rounded-xl border-beige shrink-0 gap-2">
                                    <Upload className="size-4" />
                                    Change file
                                </Button>
                            </div>

                            {/* Column Mapping */}
                            <div className="rounded-2xl border border-beige bg-white/50 p-4 space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Gán cột</p>
                                <div className="flex flex-wrap gap-3">
                                    <MappingSelector
                                        label="Word *"
                                        headers={headers}
                                        value={mapping.word}
                                        onChange={(v) => setMapping((m) => ({ ...m, word: v }))}
                                    />
                                    <MappingSelector
                                        label="Meaning *"
                                        headers={headers}
                                        value={mapping.meaning}
                                        onChange={(v) => setMapping((m) => ({ ...m, meaning: v }))}
                                    />
                                    <MappingSelector
                                        label="IPA"
                                        headers={headers}
                                        value={mapping.ipa ?? ""}
                                        onChange={(v) => setMapping((m) => ({ ...m, ipa: v || undefined }))}
                                    />
                                    <MappingSelector
                                        label="Example"
                                        headers={headers}
                                        value={mapping.example ?? ""}
                                        onChange={(v) => setMapping((m) => ({ ...m, example: v || undefined }))}
                                    />
                                    <MappingSelector
                                        label="Part of Speech"
                                        headers={headers}
                                        value={mapping.partOfSpeech ?? ""}
                                        onChange={(v) => setMapping((m) => ({ ...m, partOfSpeech: v || undefined }))}
                                    />
                                </div>
                                {!validMapping && (
                                    <div className="flex items-center gap-1.5 text-amber-600 text-[10px] font-bold">
                                        <AlertTriangle className="size-3" />
                                        Cần chọn cột Word và Meaning
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={!validMapping || !languageId}
                                    className="rounded-xl gap-2"
                                >
                                    <FileSpreadsheet className="size-4" />
                                    Import {csvData.length} từ
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => { setParsed(false); setCsvData([]); setWords([]) }}
                                    className="rounded-xl border-beige gap-2"
                                >
                                    <X className="size-4" />
                                    Hủy
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full max-w-2xl h-40 rounded-2xl border-2 border-dashed border-beige bg-white/50 flex flex-col items-center justify-center gap-2 hover:border-terracotta/50 hover:bg-terracotta/5 transition-all cursor-pointer"
                        >
                            <Upload className="size-8 text-text-muted" />
                            <p className="text-sm font-bold text-text-muted">Click to upload CSV</p>
                            <p className="text-[10px] text-text-muted">.csv — Max 5MB</p>
                        </button>
                    )}
                </div>
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

function MappingSelector({
    label,
    headers,
    value,
    onChange,
}: {
    label: string
    headers: string[]
    value: string
    onChange: (v: string) => void
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-text-muted">{label}</label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-9 rounded-lg border-beige bg-white text-xs min-w-[150px]">
                    <SelectValue placeholder="Chọn cột..." />
                </SelectTrigger>
                <SelectContent>
                    {headers.map((h) => (
                        <SelectItem key={h} value={h} className="text-xs">{h}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
