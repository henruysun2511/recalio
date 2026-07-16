"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Upload, Mic, X, Plus, Wand2, Loader2, Square, ExternalLink, Play, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useNoteTemplates } from "@/queries/useNoteTemplateQuery"
import { useCardTemplates } from "@/queries/useNoteTemplateQuery"
import { useSupportedLanguages } from "@/queries/useLanguageQuery"
import { useConfirmNotes } from "@/queries/useNoteQuery"
import { useExtractFromText } from "@/queries/useAIQuery"
import cloudinaryService from "@/services/cloudinary.service"
import { handleError } from "@/utils/handleError"
import { CardPreview, CardTemplate } from "./card-preview"


import { PARTS_OF_SPEECH, NoteTemplateType } from "@/constants/type"
import { ImageOcclusionEditor } from "./image-occlusion-editor"
import { ImageOcclusionCardView } from "./image-occlusion-card-view"
import { ClozeEditor } from "./cloze-editor"

interface ManualTabProps {
    deckId: string
}

export function ManualTab({ deckId }: ManualTabProps) {
    const router = useRouter()
    const { data: templatesRes } = useNoteTemplates()
    const allTemplates = ((templatesRes as any)?.data ?? []) as { id: string; name: string; type: string }[]
    const templates = allTemplates
    const { data: langRes } = useSupportedLanguages()
    const languages = ((langRes as any)?.data ?? []) as { id: string; name: string; nativeName: string; flagEmoji: string }[]
    const confirmMutation = useConfirmNotes()
    const autoFillMutation = useExtractFromText()

    const [languageId, setLanguageId] = useState("")
    const [templateId, setTemplateId] = useState(templates[0]?.id ?? "")
    const { data: cardTemplatesRes } = useCardTemplates(templateId)
    const cardTemplates = ((cardTemplatesRes as any)?.data ?? []) as { id: string; name: string; frontHtml: string; backHtml: string; css?: string }[]

    const selectedTemplate = useMemo(() => allTemplates.find((t) => t.id === templateId), [allTemplates, templateId])
    const selectedType = selectedTemplate?.type as NoteTemplateType | undefined

    // BASIC fields
    const [word, setWord] = useState("")
    const [ipa, setIpa] = useState("")
    const [partOfSpeech, setPartOfSpeech] = useState("")
    const [meaning, setMeaning] = useState("")
    const [example, setExample] = useState("")

    // Cloze fields
    const [clozeText, setClozeText] = useState("")
    const [clozeExtra, setClozeExtra] = useState("")

    // Occlusion fields
    const [occlusionImageUrl, setOcclusionImageUrl] = useState<string | null>(null)
    const [occlusionMasks, setOcclusionMasks] = useState<{ x: number; y: number; width: number; height: number; groupIndex: number; label?: string | null }[]>([])

    // Shared fields
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [audioName, setAudioName] = useState<string | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [imageName, setImageName] = useState<string | null>(null)
    const [uploadingAudio, setUploadingAudio] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [recording, setRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const audioInputRef = useRef<HTMLInputElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)

    const isBasic = selectedType === NoteTemplateType.BASIC || selectedType === NoteTemplateType.BASIC_REVERSED || selectedType === NoteTemplateType.BASIC_AUDIO
    const isCloze = selectedType === NoteTemplateType.CLOZE
    const isOcclusion = selectedType === NoteTemplateType.IMAGE_OCCLUSION

    useEffect(() => {
        if (isOcclusion && imageUrl && !occlusionImageUrl) {
            setOcclusionImageUrl(imageUrl)
        }
        if (!isOcclusion && occlusionImageUrl && !imageUrl) {
            setImageUrl(occlusionImageUrl)
        }
    }, [templateId])

    const addTag = () => {
        const t = tagInput.trim().toLowerCase()
        if (t && !tags.includes(t)) {
            setTags([...tags, t])
            setTagInput("")
        }
    }

    const uploadFile = async (file: File, type: "audio" | "image") => {
        const setUploading = type === "audio" ? setUploadingAudio : setUploadingImage
        const setUrl = type === "audio" ? setAudioUrl : setImageUrl
        const setName = type === "audio" ? setAudioName : setImageName
        try {
            setUploading(true)
            const res = await cloudinaryService.upload(file)
            const result = (res as any)?.data?.data ?? (res as any)?.data
            setUrl(result?.secure_url ?? result?.url ?? null)
            setName(file.name)
            toast.success(`Upload ${type} thành công`)
        } catch (e) {
            handleError(e, `Upload ${type} thất bại`)
        } finally {
            setUploading(false)
        }
    }

    const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) uploadFile(file, "audio")
        e.target.value = ""
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) uploadFile(file, "image")
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
                await uploadFile(file, "audio")
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

    const handleImageSearch = () => {
        const url = window.prompt("Nhập URL hình ảnh:")
        if (url) {
            setImageUrl(url)
            setImageName(url.split("/").pop() || "image")
            toast.success("Đã thêm hình ảnh từ URL")
        }
    }

    const handleAutoFill = async () => {
        if (!word.trim() || !languageId) {
            toast.error("Nhập từ và chọn ngôn ngữ trước khi auto-fill")
            return
        }
        try {
            const res = await autoFillMutation.mutateAsync({ text: word, languageId })
            const notes = ((res as any)?.data?.data ?? []) as any[]
            if (notes.length > 0) {
                const n = notes[0]
                if (n.ipa) setIpa(n.ipa)
                if (n.meaning) setMeaning(n.meaning)
                if (n.example) setExample(n.example)
                if (n.partOfSpeech) setPartOfSpeech(n.partOfSpeech)
                toast.success("Auto-fill thành công")
            } else {
                toast.error("Không tìm thấy dữ liệu cho từ này")
            }
        } catch (e) {
            handleError(e, "Auto-fill thất bại")
        }
    }

    const handleSave = async (addAnother: boolean) => {
        if (!templateId) {
            toast.error("Vui lòng chọn template")
            return
        }
        if (!languageId) {
            toast.error("Vui lòng chọn ngôn ngữ")
            return
        }

        if (isBasic) {
            if (!word.trim() || !meaning.trim()) {
                toast.error("Vui lòng nhập từ và nghĩa")
                return
            }
        }

        if (isCloze && !clozeText.trim()) {
            toast.error("Vui lòng nhập nội dung Cloze")
            return
        }

        if (isOcclusion && !occlusionImageUrl) {
            toast.error("Vui lòng tải ảnh nền")
            return
        }

        try {
            const wordPayload: any = { languageId, templateId, tags: tags.length ? tags : undefined }

            if (isBasic) {
                wordPayload.word = word.trim()
                wordPayload.meaning = meaning.trim()
                wordPayload.ipa = ipa.trim() || undefined
                wordPayload.partOfSpeech = partOfSpeech || undefined
                wordPayload.example = example.trim() || undefined
                wordPayload.audioUrl = audioUrl || undefined
                wordPayload.imageUrl = imageUrl || undefined
            }

            if (isCloze) {
                wordPayload.fields = { Text: clozeText, Extra: clozeExtra }
                wordPayload.audioUrl = audioUrl || undefined
                wordPayload.imageUrl = imageUrl || undefined
            }

            if (isOcclusion) {
                wordPayload.imageUrl = occlusionImageUrl
                wordPayload.masks = occlusionMasks
            }

            await confirmMutation.mutateAsync({
                deckId,
                words: [wordPayload],
            } as any, {
                onSuccess: () => {
                    toast.success("Thêm từ vựng thành công")
                    if (addAnother) {
                        if (isBasic) {
                            setWord(""); setIpa(""); setPartOfSpeech(""); setMeaning(""); setExample("")
                        }
                        if (isCloze) {
                            setClozeText(""); setClozeExtra("")
                        }
                        if (isOcclusion) {
                            setOcclusionImageUrl(null); setOcclusionMasks([])
                        }
                        setTags([]); setTagInput(""); setAudioUrl(null); setAudioName(null); setImageUrl(null); setImageName(null)
                    } else {
                        router.push(`/deck/${deckId}`)
                    }
                },
                onError: (error: any) => {
                    handleError(error, "Không thể thêm từ vựng")
                },
            })
        } catch (error) { console.error("Save failed", error) }
    }

    const previewData = isCloze
        ? { word: "", ipa: "", partOfSpeech: "", meaning: "", example: "", audioUrl, imageUrl, fields: { Text: clozeText || "Paris là {{c1::thủ đô}} của Pháp", Extra: clozeExtra } }
        : isOcclusion
            ? { word: "Image Occlusion", ipa: "", partOfSpeech: "", meaning: `${occlusionMasks.length} masks`, example: "", audioUrl: null, imageUrl: occlusionImageUrl }
            : { word: word || "word", ipa: ipa || "/ˈwɜːrd/", partOfSpeech: partOfSpeech || "noun", meaning: meaning || "meaning", example: example || "Example sentence.", audioUrl, imageUrl }

    return (
        <div className="space-y-5">
            {/* Template + Language Selectors */}
            <div className="flex flex-wrap gap-4">
                <div className="w-56">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 mb-2 block">Template</Label>
                    <Select value={templateId} onValueChange={setTemplateId}>
                        <SelectTrigger className="h-12 rounded-xl border-beige bg-white">
                            <SelectValue placeholder="Chọn template..." />
                        </SelectTrigger>
                        <SelectContent>
                            {templates.map((t) => (
                                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-56">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 mb-2 block">Language</Label>
                    <Select value={languageId} onValueChange={setLanguageId}>
                        <SelectTrigger className="h-12 rounded-xl border-beige bg-white">
                            <SelectValue placeholder="Chọn ngôn ngữ..." />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((l) => (
                                <SelectItem key={l.id} value={l.id}>{l.flagEmoji} {l.name} ({l.id})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* LEFT: Form */}
                <div className="space-y-5">
                    {isBasic && (
                        <>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">
                                    Word <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input value={word} onChange={(e) => setWord(e.target.value)} placeholder="Enter word..." className="h-12 rounded-xl border-beige bg-white pr-12" />
                                    <button onClick={handleAutoFill} disabled={autoFillMutation.isPending}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 size-9 rounded-lg hover:bg-terracotta/10 flex items-center justify-center text-text-muted hover:text-terracotta transition-colors disabled:opacity-50"
                                        title="Auto-fill from AI">
                                        {autoFillMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">IPA</Label>
                                <Input value={ipa} onChange={(e) => setIpa(e.target.value)} placeholder="/əˈbændən/" className="h-12 rounded-xl border-beige bg-white" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Part of Speech</Label>
                                <Select value={partOfSpeech} onValueChange={setPartOfSpeech}>
                                    <SelectTrigger className="h-12 rounded-xl border-beige bg-white">
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PARTS_OF_SPEECH.map((pos) => (
                                            <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">
                                    Meaning <span className="text-red-500">*</span>
                                </Label>
                                <Input value={meaning} onChange={(e) => setMeaning(e.target.value)} placeholder="Enter meaning..." className="h-12 rounded-xl border-beige bg-white" />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Example</Label>
                                <Textarea value={example} onChange={(e) => setExample(e.target.value)} placeholder="Enter example sentence..." className="min-h-[80px] rounded-xl border-beige bg-white" />
                            </div>

                            <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
                                <Wand2 className="size-5 text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-blue-800">Auto-fill available</p>
                                    <p className="text-xs text-blue-600 mt-0.5">Bấm chọn <Search className="size-3 inline" /> icon bên cạnh Word để AI tự động điền IPA, nghĩa và ví dụ giúp bạn tiết kiệm thời gian.</p>
                                </div>
                            </div>
                        </>
                    )}

                    {isCloze && (
                        <ClozeEditor
                            text={clozeText}
                            extra={clozeExtra}
                            onChange={({ Text, Extra }) => { setClozeText(Text); setClozeExtra(Extra) }}
                        />
                    )}

                    {isOcclusion && (
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1 block">Ảnh nền + Vùng che</Label>
                            <ImageOcclusionEditor
                                imageUrl={occlusionImageUrl}
                                masks={occlusionMasks}
                                onChange={({ imageUrl, masks }) => { setOcclusionImageUrl(imageUrl); setOcclusionMasks(masks) }}
                            />
                        </div>
                    )}

                    {/* Audio (show for BASIC and CLOZE) */}
                    {(isBasic || isCloze) && (
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Audio</Label>
                            {(audioUrl && audioName) && (
                                <div className="flex items-center gap-2 mb-2 bg-cream/50 rounded-xl px-3 py-2 border border-beige">
                                    <button onClick={() => { const a = new Audio(audioUrl); a.play().catch(() => { }) }} className="size-8 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta hover:bg-terracotta hover:text-white transition-colors shrink-0" title="Play">
                                        <Play className="size-4 fill-current" />
                                    </button>
                                    <span className="text-sm font-medium text-text-primary truncate flex-1">{audioName}</span>
                                    <button onClick={() => { setAudioUrl(null); setAudioName(null) }} className="size-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0" title="Remove">
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            )}
                            <input ref={audioInputRef} type="file" accept="audio/*" onChange={handleAudioUpload} hidden />
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => audioInputRef.current?.click()} disabled={uploadingAudio} className="h-10 rounded-xl border-beige bg-white text-sm font-bold hover:bg-cream gap-2">
                                    {uploadingAudio ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                                    Upload
                                </Button>
                                <Button variant="outline" onClick={recording ? stopRecording : startRecording} disabled={uploadingAudio}
                                    className={`h-10 rounded-xl border-beige text-sm font-bold gap-2 ${recording ? "bg-red-50 text-red-600 border-red-300 animate-pulse" : "bg-white hover:bg-cream"}`}>
                                    {recording ? <><Square className="size-4" />Stop</> : <><Mic className="size-4" />Record</>}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Image (show for BASIC and CLOZE) */}
                    {(isBasic || isCloze) && (
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Image</Label>
                            {(imageUrl && imageName) && (
                                <div className="flex items-center gap-2 mb-2 bg-cream/50 rounded-xl px-3 py-2 border border-beige">
                                    <div className="size-8 rounded-lg overflow-hidden bg-beige/50 shrink-0 flex items-center justify-center">
                                        <img src={imageUrl} alt="" className="size-full object-cover" />
                                    </div>
                                    <span className="text-sm font-medium text-text-primary truncate flex-1">{imageName}</span>
                                    <button onClick={() => { setImageUrl(null); setImageName(null) }} className="size-8 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors shrink-0" title="Remove">
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            )}
                            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} hidden />
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage} className="h-10 rounded-xl border-beige bg-white text-sm font-bold hover:bg-cream gap-2">
                                    {uploadingImage ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                                    Upload
                                </Button>
                                <Button variant="outline" onClick={handleImageSearch} className="h-10 rounded-xl border-beige bg-white text-sm font-bold hover:bg-cream gap-2">
                                    <ExternalLink className="size-4" />URL
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Tags (all types) */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-1">Tags</Label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {tags.map((tag, i) => (
                                <span key={i} className="inline-flex items-center gap-1 rounded-full bg-peach px-2.5 py-0.5 text-[10px] font-bold text-terracotta border border-peach-dark/20">
                                    {tag}
                                    <button onClick={() => setTags(tags.filter((_, j) => j !== i))} className="hover:text-red-500"><X className="size-3" /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }} placeholder="Type tag and press Enter..." className="h-12 rounded-xl border-beige bg-white flex-1" />
                            <Button variant="outline" onClick={addTag} className="h-12 w-12 rounded-xl border-beige bg-white"><Plus className="size-4" /></Button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button onClick={() => handleSave(true)} disabled={confirmMutation.isPending}
                            className="h-12 flex-1 rounded-xl border-2 border-terracotta/30 bg-terracotta/5 text-terracotta font-bold hover:bg-terracotta/10 transition-colors">
                            {confirmMutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                            Save &amp; Add Another
                        </Button>
                        <Button onClick={() => handleSave(false)} disabled={confirmMutation.isPending}
                            className="h-12 flex-1 rounded-xl bg-terracotta text-white font-bold shadow-md shadow-terracotta/20 hover:bg-terracotta-dark">
                            {confirmMutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                            Save
                        </Button>
                    </div>
                </div>

                {/* RIGHT: Preview */}
                <div className="space-y-5">
                    {isOcclusion ? (
                        <div className="space-y-4">
                            {(() => {
                                const groups = [...new Set(occlusionMasks.map(m => m.groupIndex))].sort((a, b) => a - b)
                                const firstGroup = groups.length > 0 ? groups[0] : 0
                                return (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-0.5">Front</p>
                                                <div className="rounded-2xl border-2 border-dashed border-beige bg-white p-4">
                                                    <ImageOcclusionCardView
                                                        imageUrl={occlusionImageUrl}
                                                        masks={occlusionMasks}
                                                        variantIndex={firstGroup}
                                                        showBack={false}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-0.5">Back</p>
                                                <div className="rounded-2xl border-2 border-dashed border-beige bg-white p-4">
                                                    <ImageOcclusionCardView
                                                        imageUrl={occlusionImageUrl}
                                                        masks={occlusionMasks}
                                                        variantIndex={firstGroup}
                                                        showBack
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {groups.length > 0 && (
                                            <div className="rounded-2xl border border-beige bg-white p-5 space-y-3">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Cards will be created ({groups.length})</p>
                                                {groups.map((g, i) => {
                                                    const label = occlusionMasks.find(m => m.groupIndex === g)?.label
                                                    const count = occlusionMasks.filter(m => m.groupIndex === g).length
                                                    return (
                                                        <div key={g} className="flex items-center gap-3">
                                                            <span className="size-7 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs shrink-0">{i + 1}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <span className="text-sm font-semibold text-text-primary">{label || "No label"}</span>
                                                                {count > 1 && <span className="text-[10px] text-text-muted ml-2">({count} masks)</span>}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </>
                                )
                            })()}
                        </div>
                    ) : (
                        <CardPreview data={previewData} templates={cardTemplates.length > 0 ? cardTemplates : undefined} />
                    )}

                    {!isOcclusion && (
                    <div className="rounded-2xl border border-beige bg-white p-5 space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Cards will be created</p>
                        {cardTemplates.map((ct) => (
                            <div key={ct.id} className="flex items-center gap-3">
                                <span className="size-7 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">✓</span>
                                <span className="text-sm font-semibold text-text-primary">{ct.name}</span>
                            </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
}
