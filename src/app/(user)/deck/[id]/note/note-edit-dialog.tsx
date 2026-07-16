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
import { Upload, X, Loader2, Mic, Square, Play, Trash2, Volume2 } from "lucide-react"
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
        audioUrl?: string | null
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

    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [audioName, setAudioName] = useState<string | null>(null)
    const [uploadingAudio, setUploadingAudio] = useState(false)
    const [recording, setRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const audioInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (note) {
            setWord(note.word ?? "")
            setMeaning(note.meaning ?? "")
            setIpa(note.ipa ?? "")
            setPartOfSpeech(note.partOfSpeech ?? "")
            setExample(note.example ?? "")
            setImageUrl(note.imageUrl ?? null)
            setAudioUrl(note.audioUrl ?? null)
            setAudioName(note.audioUrl ? "Audio đã tải lên" : null)
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

    const uploadAudioFile = async (file: File) => {
        try {
            setUploadingAudio(true)
            const res = await cloudinaryService.upload(file)
            const result = (res as any)?.data?.data ?? (res as any)?.data
            setAudioUrl(result?.secure_url ?? result?.url ?? null)
            setAudioName(file.name)
            toast.success("Upload audio thành công")
        } catch (e) {
            handleError(e, "Upload audio thất bại")
        } finally {
            setUploadingAudio(false)
        }
    }

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) uploadAudioFile(file)
        e.target.value = ""
    }

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4" })
            mediaRecorderRef.current = mediaRecorder
            chunksRef.current = []
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }
            mediaRecorder.onstop = async () => {
                stream.getTracks().forEach((t) => t.stop())
                const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType })
                const file = new File([blob], `recording-${Date.now()}.${mediaRecorder.mimeType.includes("webm") ? "webm" : "mp4"}`, { type: mediaRecorder.mimeType })
                await uploadAudioFile(file)
            }
            mediaRecorder.start()
            setRecording(true)
            toast.info("Đang ghi âm...")
        } catch (e) {
            handleError(e, "Không thể truy cập microphone")
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop()
            setRecording(false)
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
            audioUrl: audioUrl || null,
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

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">Âm thanh</label>
                        {(audioUrl && audioName) && (
                            <div className="flex items-center gap-2 mb-2 bg-cream/50 rounded-xl px-3 py-2 border border-beige">
                                <button
                                    type="button"
                                    onClick={() => { const a = new Audio(audioUrl); a.play().catch(() => { }) }}
                                    className="size-8 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta hover:bg-terracotta hover:text-white transition-colors shrink-0"
                                    title="Play"
                                >
                                    <Play className="size-4 fill-current" />
                                </button>
                                <span className="text-sm font-medium text-text-primary truncate flex-1">{audioName}</span>
                                <button
                                    type="button"
                                    onClick={() => { setAudioUrl(null); setAudioName(null) }}
                                    className="size-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0"
                                    title="Remove"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        )}
                        <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" />
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => audioInputRef.current?.click()}
                                disabled={uploadingAudio}
                                className="h-10 rounded-xl border-beige bg-white text-xs font-bold hover:bg-cream gap-2"
                            >
                                {uploadingAudio ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                                Tải file lên
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={recording ? stopRecording : startRecording}
                                disabled={uploadingAudio}
                                className={`h-10 rounded-xl border-beige text-xs font-bold gap-2 ${recording ? "bg-red-50 text-red-600 border-red-300 animate-pulse" : "bg-white hover:bg-cream"}`}
                            >
                                {recording ? <><Square className="size-4" /> Dừng</> : <><Mic className="size-4" /> Ghi âm</>}
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
