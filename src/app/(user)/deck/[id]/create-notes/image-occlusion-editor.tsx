"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Loader2, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import cloudinaryService from "@/services/cloudinary.service"
import { handleError } from "@/utils/handleError"

interface Mask {
    x: number
    y: number
    width: number
    height: number
    groupIndex: number
    label?: string | null
}

interface ImageOcclusionEditorProps {
    imageUrl: string | null
    masks: Mask[]
    onChange: (data: { imageUrl: string | null; masks: Mask[] }) => void
}

export function ImageOcclusionEditor({ imageUrl, masks, onChange }: ImageOcclusionEditorProps) {
    const [uploading, setUploading] = useState(false)
    const [drawing, setDrawing] = useState(false)
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)
    const [currentGroup, setCurrentGroup] = useState(1)
    const [shiftHeld, setShiftHeld] = useState(false)
    const imageRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            setUploading(true)
            const res = await cloudinaryService.upload(file)
            const result = (res as any)?.data?.data ?? (res as any)?.data
            onChange({ imageUrl: result?.secure_url ?? result?.url ?? null, masks })
            toast.success("Upload ảnh thành công")
        } catch (error) {
            handleError(error, "Upload ảnh thất bại")
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }

    const getRelativePos = useCallback((e: React.MouseEvent) => {
        const rect = imageRef.current?.getBoundingClientRect()
        if (!rect) return { x: 0, y: 0 }
        return {
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        }
    }, [])

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!imageUrl) return
        setDrawing(true)
        setStartPos(getRelativePos(e))
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!drawing || !startPos) return
        setDrawing(false)
        const end = getRelativePos(e)
        const x = Math.min(startPos.x, end.x)
        const y = Math.min(startPos.y, end.y)
        const width = Math.abs(end.x - startPos.x)
        const height = Math.abs(end.y - startPos.y)
        if (width < 1 || height < 1) return

        const newMask: Mask = {
            x, y, width, height,
            groupIndex: shiftHeld && masks.length > 0 ? currentGroup - 1 : currentGroup,
        }
        onChange({ imageUrl, masks: [...masks, newMask] })
        if (!shiftHeld) setCurrentGroup((g) => g + 1)
        setStartPos(null)
    }

    const removeMask = (index: number) => {
        onChange({ imageUrl, masks: masks.filter((_, i) => i !== index) })
    }

    const setLabel = (index: number, label: string) => {
        const updated = masks.map((m, i) => i === index ? { ...m, label } : m)
        onChange({ imageUrl, masks: updated })
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2 block">
                    Ảnh nền
                </label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleUpload} hidden />
                {imageUrl ? (
                    <div className="relative">
                        <div
                            ref={imageRef}
                            className="relative rounded-xl overflow-hidden border border-beige cursor-crosshair select-none"
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={() => setDrawing(false)}
                        >
                            <img src={imageUrl} alt="" className="w-full max-h-[400px] object-contain" draggable={false} />
                            {masks.map((m, i) => (
                                <div
                                    key={i}
                                    className="absolute flex items-center justify-center bg-terracotta/60 hover:bg-terracotta/80 transition-colors rounded-sm cursor-pointer group"
                                    style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.width}%`, height: `${m.height}%` }}
                                    onClick={() => removeMask(i)}
                                >
                                    <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100">
                                        <X className="size-4" />
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-1.5 text-xs text-text-muted">
                            Kéo chuột để vẽ vùng che. Giữ <kbd className="rounded border border-beige bg-cream px-1.5 py-0.5 font-mono text-[11px]">Shift</kbd> để nhóm vào cùng index.
                        </p>
                    </div>
                ) : (
                    <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        variant="outline"
                        className="w-full h-32 rounded-xl border-dashed border-beige gap-2"
                    >
                        {uploading ? <Loader2 className="size-5 animate-spin" /> : <Upload className="size-5" />}
                        {uploading ? "Đang tải..." : "Chọn ảnh"}
                    </Button>
                )}
            </div>
            {masks.length > 0 && (
                <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2 block">
                        Vùng che ({masks.length})
                    </label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {masks.map((m, i) => (
                            <div key={i} className="flex items-center gap-2 rounded-lg border border-beige bg-cream px-3 py-2">
                                <span className="text-[10px] font-semibold text-text-muted shrink-0 w-5">#{i + 1}</span>
                                <input
                                    value={m.label ?? ""}
                                    onChange={(e) => setLabel(i, e.target.value)}
                                    placeholder="Đáp án..."
                                    className="h-7 flex-1 rounded-md border border-beige bg-white px-2 text-xs font-medium outline-none focus:border-terracotta"
                                />
                                <span className="text-[10px] text-text-muted shrink-0">G{m.groupIndex}</span>
                                <button onClick={() => removeMask(i)} className="text-red-400 hover:text-red-600 transition-colors shrink-0">
                                    <Trash2 className="size-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
