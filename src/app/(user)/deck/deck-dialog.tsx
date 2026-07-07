"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { createDeckSchema, updateDeckSchema, DeckResponse } from "@/schemas/deck.schema"
import { useImageUpload } from "@/hooks/useImageUpload"
import { zodResolver } from "@hookform/resolvers/zod"
import { FolderIcon, ImageIcon, XIcon, Loader2Icon, PlusIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface DeckDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: z.infer<typeof createDeckSchema | typeof updateDeckSchema>) => void
    initialData?: DeckResponse | null
    loading?: boolean
}

export function DeckDialog({ open, onOpenChange, onSubmit, initialData, loading }: DeckDialogProps) {
    const schema = initialData ? updateDeckSchema : createDeckSchema
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { handleUpload, isUploading, deleteMediaMutation } = useImageUpload()
    const [oldPublicId, setOldPublicId] = useState<string | null>(null)

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { isPublic: false },
    })
    const [tagInput, setTagInput] = useState("")

    const currentCover = form.watch("coverImage")

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    description: initialData.description || "",
                    coverImage: initialData.coverImage || "",
                    isPublic: initialData.isPublic,
                    tags: initialData.tags || [],
                })
            } else {
                form.reset({ name: "", description: "", coverImage: "", isPublic: false, tags: [] })
            }
            setOldPublicId(null)
            setTagInput("")
        }
    }, [initialData, form, open])

    const tags = form.watch("tags") || []

    const addTag = () => {
        const trimmed = tagInput.trim()
        if (trimmed && !tags.includes(trimmed)) {
            form.setValue("tags", [...tags, trimmed])
        }
        setTagInput("")
    }

    const removeTag = (tag: string) => {
        form.setValue("tags", tags.filter((t: string) => t !== tag))
    }

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addTag()
        }
    }

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (oldPublicId) {
            deleteMediaMutation.mutate({ publicId: oldPublicId, resourceType: "image" })
        }
        const result = await handleUpload(file, "decks")
        if (result) {
            form.setValue("coverImage", result.url)
            setOldPublicId(result.publicId)
        }
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const removeCover = () => {
        if (oldPublicId) {
            deleteMediaMutation.mutate({ publicId: oldPublicId, resourceType: "image" })
        }
        form.setValue("coverImage", "")
        setOldPublicId(null)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto admin-dialog-content"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="admin-dialog-header">
                    <div className="admin-dialog-icon-box bg-peach">
                        <FolderIcon className="size-6 text-terracotta" />
                    </div>
                    <DialogTitle className="admin-dialog-title">
                        {initialData ? "Chỉnh sửa bộ thẻ" : "Tạo bộ thẻ mới"}
                    </DialogTitle>
                    <DialogDescription className="admin-dialog-description">
                        {initialData ? "Cập nhật thông tin bộ thẻ..." : "Tạo bộ thẻ mới để bắt đầu học..."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="admin-dialog-body">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Tên bộ thẻ</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="vd: English Vocabulary"
                                                className="admin-form-input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Mô tả</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Mô tả ngắn về bộ thẻ..."
                                                className="admin-form-input min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="coverImage"
                                render={() => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Ảnh bìa</FormLabel>
                                        <FormControl>
                                            {currentCover ? (
                                                <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-beige">
                                                    <img src={currentCover} alt="Cover preview" className="size-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={removeCover}
                                                        className="absolute top-2 right-2 size-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                                                    >
                                                        <XIcon className="size-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-beige bg-cream/50 cursor-pointer transition-colors hover:border-terracotta/40">
                                                    {isUploading ? (
                                                        <Loader2Icon className="size-8 text-text-muted animate-spin" />
                                                    ) : (
                                                        <>
                                                            <ImageIcon className="size-8 text-text-muted mb-1" />
                                                            <span className="text-sm text-text-muted">Nhấn để tải ảnh lên</span>
                                                        </>
                                                    )}
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={onFileChange}
                                                        disabled={isUploading}
                                                    />
                                                </label>
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tags"
                                render={() => (
                                    <FormItem className="col-span-2">
                                        <FormLabel className="admin-form-label">Thẻ tag</FormLabel>
                                        <FormControl>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        placeholder="Nhập tag và nhấn Enter..."
                                                        className="admin-form-input"
                                                        value={tagInput}
                                                        onChange={(e) => setTagInput(e.target.value)}
                                                        onKeyDown={handleTagKeyDown}
                                                    />
                                                    <Button type="button" size="icon" variant="outline" onClick={addTag} className="size-10 shrink-0 rounded-xl border-gray-300">
                                                        <PlusIcon className="size-4" />
                                                    </Button>
                                                </div>
                                                {tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {tags.map((tag: string) => (
                                                            <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-peach/60 px-3 py-1 text-xs font-medium text-terracotta">
                                                                {tag}
                                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-terracotta-dark">
                                                                    <XIcon className="size-3" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isPublic"
                                render={({ field }) => (
                                    <FormItem className="col-span-2 admin-field-card">
                                        <div>
                                            <FormLabel className="text-sm font-bold text-text-primary">Công khai</FormLabel>
                                            <p className="text-xs text-text-muted">Cho phép người dùng khác xem và sao chép bộ thẻ này</p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-terracotta"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="admin-dialog-footer">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="admin-btn-cancel"
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="admin-btn-primary"
                            >
                                {loading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Tạo mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
