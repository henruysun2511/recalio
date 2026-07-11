"use client"

import { useState, useEffect, useRef } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PARTS_OF_SPEECH, PartOfSpeech } from "@/constants/type"
import { Upload, X, Loader2 } from "lucide-react"
import cloudinaryService from "@/services/cloudinary.service"
import { handleError } from "@/utils/handleError"
import { toast } from "sonner"
import type { Note } from "@/schemas/note.schema"

interface NoteEditDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    note: Note | null
    onSave: (data: {
        word: string
        meaning: string
        ipa?: string
        partOfSpeech?: string
        example?: string
        imageUrl?: string | null
    }) => void
    loading?: boolean
}

export function NoteEditDialog({ open, onOpenChange, note, onSave, loading }: NoteEditDialogProps) {
    const [word, setWord] = useState("")
    const [meaning, setMeaning] = useState("")
    const [ipa, setIpa] = useState("")
    const [partOfSpeech, setPartOfSpeech] = useState("")
    const [example, setExample] = useState("")
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    const imageInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (note) {
            setWord(note.word ?? "")
            setMeaning(note.meaning ?? "")
            setIpa(note.ipa ?? "")
            setPartOfSpeech(note.partOfSpeech ?? "")
            setExample(note.example ?? "")
            setImageUrl(note.imageUrl ?? null)
        }
    }, [note])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            setUploadingImage(true)
            const res = await cloudinaryService.upload(file)
            const result = (res as any)?.data?.data ?? (res as any)?.data
            setImageUrl(result?.secure_url ?? result?.url ?? null)
            toast.success("Upload ảnh thành công")
        } catch (error) {
            handleError(error, "Upload ảnh thất bại")
        } finally {
            setUploadingImage(false)
            if (imageInputRef.current) imageInputRef.current.value = ""
        }
    }

    const handleSave = () => {
        if (!word.trim()) return
        onSave({
            word: word.trim(),
            meaning: meaning.trim(),
            ipa: ipa || undefined,
            partOfSpeech: partOfSpeech || undefined,
            example: example || undefined,
            imageUrl: imageUrl || null,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight">Chỉnh sửa từ vựng</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Từ vựng</label>
                        <Input value={word} onChange={(e) => setWord(e.target.value)} placeholder="Nhập từ..." className="h-11 rounded-xl border-beige bg-white" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Nghĩa</label>
                        <Input value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Nhập nghĩa..." className="h-11 rounded-xl border-beige bg-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">IPA</label>
                            <Input value={ipa} onChange={(e) => setIpa(e.target.value)} placeholder="/ˈeksəmpəl/" className="h-11 rounded-xl border-beige bg-white" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Từ loại</label>
                            <Select value={partOfSpeech} onValueChange={setPartOfSpeech}>
                                <SelectTrigger className="h-11 rounded-xl border-beige bg-white">
                                    <SelectValue placeholder="Chọn..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {PARTS_OF_SPEECH.map((pos) => (
                                        <SelectItem key={pos} value={pos}>
                                            {pos}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Ví dụ</label>
                        <Textarea value={example} onChange={(e) => setExample(e.target.value)} placeholder="Nhập câu ví dụ..." className="min-h-[80px] rounded-xl border-beige bg-white" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Hình ảnh</label>
                        <div className="flex items-center gap-3">
                            {imageUrl ? (
                                <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-beige/60">
                                    <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl(null)}
                                        className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex w-24 h-16 items-center justify-center rounded-xl bg-cream/60 border border-beige/40">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">No Image</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} className="hidden" />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={uploadingImage}
                                onClick={() => imageInputRef.current?.click()}
                                className="rounded-xl border-beige"
                            >
                                {uploadingImage ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                                {uploadingImage ? "Đang tải..." : "Tải ảnh lên"}
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Hủy</Button>
                    <Button onClick={handleSave} disabled={loading || !word.trim()}>
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
