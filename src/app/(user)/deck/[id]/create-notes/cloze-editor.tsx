"use client"

import { useState, useRef, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ClozeEditorProps {
    text: string
    extra: string
    onChange: (fields: { Text: string; Extra: string }) => void
}

export function ClozeEditor({ text, extra, onChange }: ClozeEditorProps) {
    const [currentIndex, setCurrentIndex] = useState(1)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const insertCloze = useCallback(() => {
        const ta = textareaRef.current
        if (!ta) return
        const start = ta.selectionStart
        const end = ta.selectionEnd
        if (start === end) return

        const selected = text.substring(start, end)
        const cloze = `{{c${currentIndex}::${selected}}}`
        const newText = text.substring(0, start) + cloze + text.substring(end)
        onChange({ Text: newText, Extra: extra })
        setCurrentIndex((i) => i + 1)

        requestAnimationFrame(() => {
            ta.focus()
            ta.setSelectionRange(start + cloze.length, start + cloze.length)
        })
    }, [text, extra, currentIndex, onChange])

    return (
        <div className="space-y-4">
            <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2 block">
                    Text (bôi đen từ + bấm &quot;Cloze&quot;)
                </label>
                <div className="relative">
                    <Textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => onChange({ Text: e.target.value, Extra: extra })}
                        placeholder="Paris is the capital of France."
                        className="min-h-[120px] rounded-xl border-beige bg-white font-mono text-sm"
                    />
                    <Button
                        type="button"
                        onClick={insertCloze}
                        disabled={!textareaRef.current?.selectionEnd}
                        className="absolute top-2 right-2 rounded-lg gap-1 text-xs h-8 px-3"
                        size="sm"
                    >
                        Cloze (c{currentIndex})
                    </Button>
                </div>
                <p className="mt-1.5 text-xs text-text-muted">
                    Giữ <kbd className="rounded border border-beige bg-cream px-1.5 py-0.5 font-mono text-[11px]">Shift</kbd> + bấm nút để nhóm vào cùng index hiện tại
                </p>
            </div>
            <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-2 block">
                    Extra (hiện ở mặt sau)
                </label>
                <Input
                    value={extra}
                    onChange={(e) => onChange({ Text: text, Extra: e.target.value })}
                    placeholder="Extra info..."
                    className="rounded-xl border-beige bg-white"
                />
            </div>
        </div>
    )
}
