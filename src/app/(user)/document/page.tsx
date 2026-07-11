"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload, Sparkles, Check, X, FileText, Trash2, Plus, NotebookPen, Brain, Pencil } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useProcessDocument } from "@/queries/useAIQuery"
import { useSupportedLanguages } from "@/queries/useLanguageQuery"
import { useDocumentNotes } from "@/queries/useNoteQuery"
import { useMyDecks, useCreateDeck } from "@/queries/useDeckQuery"
import { useNoteTemplates } from "@/queries/useNoteTemplateQuery"
import { handleError } from "@/utils/handleError"

interface EditableItem {
    id: number
    word: string
    meaning: string
    example: string
    chunk: string
    orderIndex: number
    tags: string[]
}

export default function DocumentPage() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [languageId, setLanguageId] = useState("")
    const [deckId, setDeckId] = useState("")
    const [items, setItems] = useState<EditableItem[]>([])
    const [showNewDeckInput, setShowNewDeckInput] = useState(false)
    const [newDeckName, setNewDeckName] = useState("")
    const newDeckInputRef = useRef<HTMLInputElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { data: langRes } = useSupportedLanguages()
    const languages = ((langRes as any)?.data ?? []) as { id: string; name: string; nativeName: string; flagEmoji: string }[]
    const { data: decksRes } = useMyDecks({ page: 1, limit: 100 })
    const decks = ((decksRes as any)?.data ?? []) as { id: string; name: string }[]
    const { data: templatesRes } = useNoteTemplates()
    const templates = ((templatesRes as any)?.data ?? []) as { id: string; name: string }[]
    const processMutation = useProcessDocument()
    const documentMutation = useDocumentNotes()
    const createDeckMutation = useCreateDeck()

    const defaultTemplateId = templates[0]?.id ?? ""

    const handleCreateDeck = async () => {
        const name = newDeckName.trim()
        if (!name) { toast.error("Vui lòng nhập tên bộ thẻ"); return }
        try {
            const res = await createDeckMutation.mutateAsync({ name })
            const newDeck = (res as any)?.data?.data ?? (res as any)?.data
            if (newDeck?.id) {
                setDeckId(newDeck.id)
                setShowNewDeckInput(false)
                setNewDeckName("")
                toast.success(`Đã tạo bộ thẻ "${name}"`)
            }
        } catch (error) {
            handleError(error, "Tạo bộ thẻ thất bại")
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        if (f.type !== "application/pdf") { toast.error("Vui lòng chọn file PDF"); return }
        if (f.size > 10 * 1024 * 1024) { toast.error("PDF không được quá 10MB"); return }
        setFile(f)
        setItems([])
    }

    const handleProcess = async () => {
        if (!file) { toast.error("Vui lòng chọn file PDF"); return }
        if (!languageId) { toast.error("Vui lòng chọn ngôn ngữ"); return }
        try {
            const res = await processMutation.mutateAsync(file)
            const data = (res as any)?.data?.data ?? (res as any)?.data ?? []
            const list = Array.isArray(data) ? data : (data?.notes ?? [])
            if (!list.length) { toast.info("Không thể trích xuất nội dung từ PDF"); return }
            setItems(list.map((item: any, i: number) => ({
                id: i,
                word: item.word ?? "",
                meaning: item.meaning ?? "",
                example: item.example ?? "",
                chunk: item.chunk ?? item.meaning ?? "",
                orderIndex: i,
                tags: item.tags ?? [],
            })))
            toast.success(`Trích xuất ${list.length} mục`)
        } catch (error) {
            handleError(error, "Xử lý PDF thất bại")
        }
    }

    const updateItem = (id: number, field: keyof EditableItem, value: any) => {
        setItems((prev) => prev.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
        ))
    }

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id).map((item, i) => ({ ...item, id: i, orderIndex: i })))
    }

    const handleSave = async () => {
        if (!deckId) { toast.error("Vui lòng chọn bộ thẻ"); return }
        if (!languageId) { toast.error("Vui lòng chọn ngôn ngữ"); return }
        if (!defaultTemplateId) { toast.error("Không tìm thấy template nào"); return }
        if (!items.length) { toast.error("Không có mục nào để lưu"); return }
        try {
            const payload = {
                deckId,
                languageId,
                templateId: defaultTemplateId,
                fileName: file?.name,
                items: items.map((item) => ({
                    word: item.word,
                    meaning: item.meaning || undefined,
                    example: item.example || undefined,
                    chunk: item.chunk || undefined,
                    orderIndex: item.orderIndex,
                })),
            }
            await documentMutation.mutateAsync(payload as any, {
                onSuccess: () => {
                    toast.success(`Đã lưu ${items.length} mục vào bộ thẻ`)
                    router.push(`/deck/${deckId}`)
                },
            })
        } catch (error) {
            handleError(error, "Lưu thất bại")
        }
    }

    return (
        <div className="w-full -mx-10 md:-mx-10 space-y-8">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-[32px] bg-[#F6EBDD] px-12 md:px-16 py-16 md:py-20">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">

                    {/* Left */}
                    <div className="max-w-3xl">
                        <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-[#2E2E2E]">
                            Chuyển đổi tài liệu PDF
                            <br />
                            thành{" "}
                            <span className="text-[#D97D56]">
                                ghi chú thông minh
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
                            Chỉ cần tải lên một tệp PDF, hệ thống sẽ tự động trích xuất văn bản,
                            phân tích bằng AI và chuyển thành các ghi chú có cấu trúc để bạn
                            chỉnh sửa hoặc tạo Flashcards ngay lập tức.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#2E2E2E]">
                                <FileText className="size-4 text-[#D97D56]" />
                                PDF tối đa 2 trang
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#2E2E2E]">
                                <Brain className="size-4 text-[#D97D56]" />
                                AI phân tích nội dung
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#2E2E2E]">
                                <NotebookPen className="size-4 text-[#D97D56]" />
                                Sinh ghi chú tự động
                            </span>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#2E2E2E]">
                                <Pencil className="size-4 text-[#D97D56]" />
                                Chỉnh sửa trước khi lưu
                            </span>

                        </div>
                    </div>

                    {/* Right */}
                    <div className="w-full max-w-md rounded-[32px] border border-beige bg-white p-8 shadow-sm">

                        <h3 className="text-lg font-bold text-[#2E2E2E]">
                            Quy trình xử lý
                        </h3>

                        <div className="mt-8 space-y-5">

                            <div className="flex items-start gap-4">

                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#F6EBDD] text-[#D97D56]">
                                    <FileText className="size-5" />
                                </div>

                                <div>
                                    <p className="font-semibold text-[#2E2E2E]">
                                        1. Tải lên PDF
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                                        Chọn tài liệu PDF tối đa 2 trang để hệ thống xử lý.
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-start gap-4">

                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#F6EBDD] text-[#D97D56]">
                                    <Brain className="size-5" />
                                </div>

                                <div>
                                    <p className="font-semibold text-[#2E2E2E]">
                                        2. AI phân tích
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                                        Văn bản được trích xuất và AI nhận diện ý chính, khái niệm,
                                        định nghĩa và cấu trúc nội dung.
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-start gap-4">

                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#F6EBDD] text-[#D97D56]">
                                    <NotebookPen className="size-5" />
                                </div>

                                <div>
                                    <p className="font-semibold text-[#2E2E2E]">
                                        3. Sinh ghi chú
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                                        AI tạo ghi chú có cấu trúc, sẵn sàng chỉnh sửa hoặc chuyển
                                        thành Flashcards.
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* Form section */}
            <div className="px-10 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">
                            Ngôn ngữ
                        </label>
                        <Select value={languageId} onValueChange={setLanguageId}>
                            <SelectTrigger className="w-full h-12 rounded-xl border-beige bg-white">
                                <SelectValue placeholder="Chọn ngôn ngữ..." />
                            </SelectTrigger>
                            <SelectContent>
                                {languages.map((l) => (
                                    <SelectItem key={l.id} value={l.id}>
                                        {l.flagEmoji} {l.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">
                            Bộ thẻ đích
                        </label>
                        <div className="flex gap-2">
                            {showNewDeckInput ? (
                                <div className="flex flex-1 items-center gap-2 rounded-xl border-2 border-terracotta bg-white px-3">
                                    <input
                                        ref={newDeckInputRef}
                                        value={newDeckName}
                                        onChange={(e) => setNewDeckName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleCreateDeck(); if (e.key === "Escape") { setShowNewDeckInput(false); setNewDeckName("") } }}
                                        placeholder="Nhập tên bộ thẻ mới..."
                                        className="h-12 flex-1 bg-transparent text-sm font-medium text-text-primary placeholder:text-text-muted/50 focus:outline-none"
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCreateDeck}
                                        disabled={createDeckMutation.isPending}
                                        className="flex size-8 items-center justify-center rounded-lg bg-terracotta text-white hover:bg-terracotta/90 transition-colors"
                                    >
                                        {createDeckMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowNewDeckInput(false); setNewDeckName("") }}
                                        className="flex size-8 items-center justify-center rounded-lg border border-beige hover:bg-red-50 transition-colors"
                                    >
                                        <X className="size-4 text-text-muted" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Select value={deckId} onValueChange={setDeckId}>
                                        <SelectTrigger className="flex-1 h-12 rounded-xl border-beige bg-white">
                                            <SelectValue placeholder="Chọn bộ thẻ..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {decks.map((d) => (
                                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewDeckInput(true)}
                                        className="flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-beige bg-white/50 text-text-muted hover:border-terracotta/50 hover:text-terracotta hover:bg-terracotta/5 transition-all"
                                    >
                                        <Plus className="size-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">
                            &nbsp;
                        </label>
                        <Button
                            onClick={handleProcess}
                            disabled={processMutation.isPending || !file || !languageId}
                            className="w-full rounded-xl gap-2 h-12 text-base"
                        >
                            {processMutation.isPending ? (
                                <Loader2 className="size-5 animate-spin" />
                            ) : (
                                <Sparkles className="size-5" />
                            )}
                            {processMutation.isPending ? "Đang xử lý..." : "Xử lý tài liệu"}
                        </Button>
                    </div>
                </div>

                <div className="w-full mt-5 space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">
                        File PDF
                    </label>
                    <input
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        hidden
                    />
                    {file ? (
                        <div className="flex items-center gap-4 rounded-2xl border-2 border-beige bg-white p-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-terracotta/10">
                                <FileText className="size-6 text-terracotta" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-text-primary">{file.name}</p>
                                <p className="text-xs font-medium text-text-muted">
                                    {(file.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setFile(null); setItems([]) }}
                                className="flex size-8 items-center justify-center rounded-lg border border-beige hover:bg-red-50 transition-colors"
                            >
                                <X className="size-4 text-text-muted" />
                            </button>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1.5 rounded-xl border border-beige bg-white px-3 py-2 text-xs font-semibold text-text-primary hover:bg-cream transition-colors"
                            >
                                <Upload className="size-3.5" />
                                Đổi file
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-36 rounded-2xl border-2 border-dashed border-beige bg-white/50 flex flex-col items-center justify-center gap-2 hover:border-terracotta/50 hover:bg-terracotta/5 transition-all cursor-pointer"
                        >
                            <Upload className="size-8 text-text-muted" />
                            <p className="text-sm font-bold text-text-muted">Chọn file PDF</p>
                            <p className="text-[10px] text-text-muted">Tối đa 10MB, 2 trang</p>
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            {items.length > 0 && (
                <div className="px-10 md:px-10 space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-text-primary">
                            Kết quả trích xuất ({items.length} mục)
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-beige bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div>
                                            <label className="text-[10px] font-bold text-text-muted">Tiêu đề</label>
                                            <input
                                                value={item.word}
                                                onChange={(e) => updateItem(item.id, "word", e.target.value)}
                                                className="w-full rounded-lg border border-beige bg-cream/50 px-3 py-1.5 text-sm font-bold text-text-primary focus:border-terracotta focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-text-muted">Giải thích</label>
                                            <textarea
                                                value={item.meaning}
                                                onChange={(e) => updateItem(item.id, "meaning", e.target.value)}
                                                rows={2}
                                                className="w-full resize-none rounded-lg border border-beige bg-cream/50 px-3 py-1.5 text-sm text-text-primary focus:border-terracotta focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-text-muted">Ví dụ</label>
                                            <input
                                                value={item.example}
                                                onChange={(e) => updateItem(item.id, "example", e.target.value)}
                                                className="w-full rounded-lg border border-beige bg-cream/50 px-3 py-1.5 text-sm text-text-primary focus:border-terracotta focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id)}
                                        className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-beige hover:bg-red-50 hover:border-red-200 transition-colors"
                                    >
                                        <Trash2 className="size-3.5 text-text-muted hover:text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={handleSave}
                            disabled={documentMutation.isPending || !deckId}
                            className="flex-1 rounded-xl gap-2 h-11"
                        >
                            {documentMutation.isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Check className="size-4" />
                            )}
                            {documentMutation.isPending ? "Đang lưu..." : `Lưu ${items.length} mục vào bộ thẻ`}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => { setItems([]) }}
                            className="rounded-xl gap-2 h-11 border-beige"
                        >
                            <X className="size-4" />
                            Hủy
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
