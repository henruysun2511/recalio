"use client"

import { useState } from "react"
import { Title } from "@/components/common/title"
import { useCreateSuggestion } from "@/queries/useSuggestionQuery"
import { CreateSuggestionInput } from "@/schemas/suggestion.schema"
import { handleError } from "@/utils/handleError"
import { toast } from "sonner"
import { Loader2, Send } from "lucide-react"

export default function SuggestionPage() {
    const [content, setContent] = useState("")
    const mutation = useCreateSuggestion()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) return

        try {
            await mutation.mutateAsync({ content: content.trim() }, {
                onSuccess: (response: any) => {
                    toast.success(response?.message || "Gửi góp ý thành công, cảm ơn bạn!")
                    setContent("")
                },
                onError: (error: any) => {
                    handleError(error, "Gửi góp ý thất bại")
                },
            })
        } catch (error) {
            console.error("Submit suggestion failed", error)
        }
    }

    return (
        <div className="space-y-6">
            <Title title="Góp ý lỗi/tính năng để Huy sửa nhé" />

            <div className="rounded-[24px] border border-beige bg-white p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-text-primary">
                            Nội dung góp ý
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Nhập góp ý của bạn..."
                            rows={6}
                            maxLength={2000}
                            className="w-full resize-none rounded-2xl border border-beige bg-cream px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                        />
                        <p className="mt-1.5 text-right text-xs text-text-muted">
                            {content.length}/2000
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={!content.trim() || mutation.isPending}
                        className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {mutation.isPending ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Send className="size-4" />
                        )}
                        Gửi góp ý
                    </button>
                </form>
            </div>
        </div>
    )
}
