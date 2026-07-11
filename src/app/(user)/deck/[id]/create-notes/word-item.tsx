"use client"

import { useState, useRef } from "react"
import { Check, X, Trash2, Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { PARTS_OF_SPEECH, PartOfSpeech } from "@/constants/type"
import cloudinaryService from "@/services/cloudinary.service"
import { handleError } from "@/utils/handleError"
import type { AiNote } from "@/schemas/ai.schema"

export type EditField = "word" | "meaning" | "ipa" | "example"

export interface ExtendedWord extends AiNote {
    id: number
    templateId: string
    imageUrl: string | null
}

interface WordItemProps {
    word: ExtendedWord
    templates: { id: string; name: string }[]
    isSelected: boolean
    isEditing: boolean
    editField: EditField
    editValue: string
    onSelect: () => void
    onStartEdit: (field: EditField) => void
    onSaveEdit: () => void
    onCancelEdit: () => void
    onEditValueChange: (v: string) => void
    onPartOfSpeechChange: (val: PartOfSpeech) => void
    onTemplateChange: (templateId: string) => void
    onImageChange: (imageUrl: string | null) => void
    onDelete: () => void
}

export function WordItem({
    word, templates, isSelected, isEditing, editField, editValue,
    onSelect, onStartEdit, onSaveEdit, onCancelEdit, onEditValueChange,
    onPartOfSpeechChange, onTemplateChange, onImageChange, onDelete,
}: WordItemProps) {
    const imageInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            setUploading(true)
            const res = await cloudinaryService.upload(file)
            const result = (res as any)?.data?.data ?? (res as any)?.data
            onImageChange(result?.secure_url ?? result?.url ?? null)
            toast.success("Upload ảnh thành công")
        } catch (error) {
            handleError(error, "Upload ảnh thất bại")
        } finally {
            setUploading(false)
            if (imageInputRef.current) imageInputRef.current.value = ""
        }
    }

    return (
        <div
            data-selected={isSelected}
            onClick={onSelect}
            className="rounded-xl border border-beige bg-white p-4 shadow-sm cursor-pointer transition-all hover:border-terracotta/30 data-[selected=true]:border-terracotta data-[selected=true]:ring-1 data-[selected=true]:ring-terracotta/20"
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        {isEditing && editField === "word" ? (
                            <InlineEdit value={editValue} onChange={onEditValueChange} onSave={onSaveEdit} onCancel={onCancelEdit} />
                        ) : (
                            <span className="text-base font-bold text-text-primary" onClick={(e) => { e.stopPropagation(); onStartEdit("word") }}>
                                {word.word}
                            </span>
                        )}
                        {word.ipa && (
                            <span className="text-xs font-medium text-text-muted italic">
                                {isEditing && editField === "ipa" ? (
                                    <InlineEdit value={editValue} onChange={onEditValueChange} onSave={onSaveEdit} onCancel={onCancelEdit} />
                                ) : (
                                    <span onClick={(e) => { e.stopPropagation(); onStartEdit("ipa") }}>{word.ipa}</span>
                                )}
                            </span>
                        )}
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-text-primary">
                            {isEditing && editField === "meaning" ? (
                                <InlineEdit value={editValue} onChange={onEditValueChange} onSave={onSaveEdit} onCancel={onCancelEdit} />
                            ) : (
                                <span onClick={(e) => { e.stopPropagation(); onStartEdit("meaning") }}>{word.meaning}</span>
                            )}
                        </p>
                        {word.example && (
                            <p className="text-xs text-text-muted italic">
                                {isEditing && editField === "example" ? (
                                    <InlineEdit value={editValue} onChange={onEditValueChange} onSave={onSaveEdit} onCancel={onCancelEdit} />
                                ) : (
                                    <span onClick={(e) => { e.stopPropagation(); onStartEdit("example") }}>&ldquo;{word.example}&rdquo;</span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                        <Select value={word.templateId} onValueChange={onTemplateChange}>
                            <SelectTrigger className="h-7 rounded-lg border-beige bg-white text-[10px] font-bold w-28">
                                <SelectValue placeholder="Template" />
                            </SelectTrigger>
                            <SelectContent>
                                {templates.map((t) => (
                                    <SelectItem key={t.id} value={t.id} className="text-xs">{t.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} hidden />
                        {word.imageUrl ? (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-beige/60">
                                <img src={word.imageUrl} alt="" className="h-full w-full object-cover" />
                                <button onClick={() => onImageChange(null)} className="absolute top-0 right-0 size-4 flex items-center justify-center rounded-bl-lg bg-black/50 text-white hover:bg-black/70"><X className="size-2.5" /></button>
                            </div>
                        ) : (
                            <button onClick={() => imageInputRef.current?.click()} disabled={uploading} className="size-10 flex items-center justify-center rounded-lg border border-dashed border-beige text-text-muted hover:border-terracotta hover:text-terracotta transition-colors" title="Upload ảnh">
                                {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <Select value={word.partOfSpeech} onValueChange={onPartOfSpeechChange}>
                        <SelectTrigger onClick={(e) => e.stopPropagation()} className="h-7 rounded-lg border-beige bg-white text-[10px] font-bold w-20">
                            <SelectValue placeholder="POS" />
                        </SelectTrigger>
                        <SelectContent>
                            {PARTS_OF_SPEECH.map((pos) => (
                                <SelectItem key={pos} value={pos} className="text-xs">{pos}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <button onClick={(e) => { e.stopPropagation(); onDelete() }} className="size-7 flex items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Xóa từ này">
                        <Trash2 className="size-3.5" />
                    </button>
                </div>
            </div>
        </div>
    )
}

function InlineEdit({ value, onChange, onSave, onCancel }: {
    value: string
    onChange: (v: string) => void
    onSave: () => void
    onCancel: () => void
}) {
    return (
        <div className="flex items-center gap-1">
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") onSave(); if (e.key === "Escape") onCancel() }}
                className="h-7 text-sm rounded-lg border-terracotta px-2 py-0 min-w-[80px]"
                autoFocus
            />
            <button onClick={onSave} className="size-6 flex items-center justify-center rounded-md text-green-600 hover:bg-green-50"><Check className="size-3.5" /></button>
            <button onClick={onCancel} className="size-6 flex items-center justify-center rounded-md text-text-muted hover:bg-beige/50"><X className="size-3.5" /></button>
        </div>
    )
}
