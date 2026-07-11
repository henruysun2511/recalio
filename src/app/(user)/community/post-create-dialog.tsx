"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    XIcon,
    Loader2Icon,
    PlusIcon,
    FolderIcon,
    SearchIcon,
    GlobeIcon,
    CheckIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { DataPagination } from "@/components/common/data-pagination"
import { PaginationInfo } from "@/components/common/pagination-info"
import { createPostSchema, updatePostSchema, type Post } from "@/schemas/post.schema"
import { SortOrder, DeckSortBy } from "@/constants/sort"
import { useCreatePost, useUpdatePost } from "@/queries/usePostQuery"
import { useMyDecks } from "@/queries/useDeckQuery"
import { handleError } from "@/utils/handleError"
import { Pagination } from "@/constants/pagination"

interface PostDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    initialData?: Post
}

export function PostDialog({ open, onOpenChange, initialData }: PostDialogProps) {
    const createMutation = useCreatePost()
    const updateMutation = useUpdatePost()
    const [deckParams, setDeckParams] = useState({ page: 1, limit: 10, search: undefined as string | undefined, sortOrder: SortOrder.DESC, sort: DeckSortBy.CREATED_AT, isPublic: true })
    const { data: myDecksData, isLoading: loadingDecks } = useMyDecks(deckParams)
    const [deckSearchInput, setDeckSearchInput] = useState("")
    const deckSearchRef = useRef("")

    const schema = initialData ? updatePostSchema : createPostSchema
    const isEdit = !!initialData

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            content: "",
            tags: [],
            isPublished: true,
            deckIds: [],
        },
    })

    const [tagInput, setTagInput] = useState("")
    const tags = form.watch("tags") || []
    const selectedDeckIds = form.watch("deckIds") || []

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    title: initialData.title,
                    content: initialData.content || "",
                    tags: initialData.tags,
                    isPublished: initialData.isPublished,
                    deckIds: initialData.decks?.map((d: any) => d.id) || [],
                })
            } else {
                form.reset({ title: "", content: "", tags: [], isPublished: true, deckIds: [] })
            }
            setTagInput("")
            setDeckSearchInput("")
            deckSearchRef.current = ""
            setDeckParams({ page: 1, limit: 10, search: undefined, sortOrder: SortOrder.DESC, sort: DeckSortBy.CREATED_AT, isPublic: true })
        }
    }, [open, initialData, form])

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

    const handleDeckSearch = useCallback(() => {
        setDeckParams((prev) => ({ ...prev, search: deckSearchRef.current || undefined, page: 1 }))
    }, [])

    const handleDeckSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleDeckSearch()
        }
    }

    const toggleDeckSelection = (deckId: string) => {
        if (selectedDeckIds.includes(deckId)) {
            form.setValue("deckIds", selectedDeckIds.filter(id => id !== deckId))
        } else {
            form.setValue("deckIds", [...selectedDeckIds, deckId])
        }
        form.trigger("deckIds")
    }

    const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
            if (isEdit && initialData) {
                await updateMutation.mutateAsync({ id: initialData.id, data }, {
                    onSuccess: (res: any) => {
                        toast.success(res?.message || "Cập nhật bài viết thành công")
                        onOpenChange(false)
                    },
                    onError: (err: any) => {
                        handleError(err, "Cập nhật bài viết thất bại")
                    },
                })
            } else {
                await createMutation.mutateAsync(data as any, {
                    onSuccess: (res: any) => {
                        toast.success(res?.message || "Đăng bài viết chia sẻ thành công!")
                        onOpenChange(false)
                    },
                    onError: (err: any) => {
                        handleError(err, "Đăng bài viết thất bại")
                    },
                })
            }
        } catch (error) {
            console.error("Post failed", error)
        }
    }

    const decks = ((myDecksData as any)?.data || []) as any[]
    const meta = (myDecksData as any)?.meta as Pagination | undefined
    const metaTotal = meta?.total ?? 0
    const metaLimit = meta?.limit ?? 10
    const totalPages = Math.ceil(metaTotal / metaLimit) || 0

    const isPending = createMutation.isPending || updateMutation.isPending

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto admin-dialog-content"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="admin-dialog-header">
                    <div className="admin-dialog-icon-box bg-peach">
                        <GlobeIcon className="size-6 text-terracotta" />
                    </div>
                    <DialogTitle className="admin-dialog-title">
                        {isEdit ? "Chỉnh sửa bài viết" : "Chia sẻ bộ thẻ với mọi người"}
                    </DialogTitle>
                    <DialogDescription className="admin-dialog-description">
                        {isEdit
                            ? "Cập nhật nội dung bài viết của bạn."
                            : "Đăng tải tài liệu, chia sẻ các Deck hữu ích tới cộng đồng Recalio."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="p-8 space-y-6">
                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">Tiêu đề bài viết *</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="vd: Hướng dẫn học 3000 từ vựng IELTS trong 3 tháng"
                                                className="admin-form-input"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="admin-form-error" />
                                    </FormItem>
                                )}
                            />

                            {/* Content */}
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">Nội dung bài viết</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Chia sẻ kinh nghiệm học tập của bạn..."
                                                className="min-h-[120px] rounded-xl border-beige bg-white focus-visible:ring-terracotta"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="admin-form-error" />
                                    </FormItem>
                                )}
                            />

                            {/* Publish toggle */}
                            <FormField
                                control={form.control}
                                name="isPublished"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center gap-3 rounded-2xl border border-beige bg-cream/40 p-4">
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="isPublished"
                                            />
                                            <Label htmlFor="isPublished" className="space-y-0.5 cursor-pointer">
                                                <p className="font-semibold text-text-primary text-sm">
                                                    {field.value ? "Công khai" : "Bản nháp"}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    {field.value
                                                        ? "Bài viết sẽ được hiển thị trên trang cộng đồng"
                                                        : "Chỉ mình bạn có thể xem bài viết này"}
                                                </p>
                                            </Label>
                                        </div>
                                        <FormMessage className="admin-form-error" />
                                    </FormItem>
                                )}
                            />

                            {/* Tags */}
                            <FormField
                                control={form.control}
                                name="tags"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">Thẻ tags</FormLabel>
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Nhập tag và nhấn Enter hoặc dấu phẩy"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={handleTagKeyDown}
                                                    className="admin-form-input flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={addTag}
                                                    className="h-12 bg-cream border border-beige hover:bg-beige text-text-primary rounded-xl px-4"
                                                >
                                                    <PlusIcon className="size-4" />
                                                </Button>
                                            </div>
                                            {tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="inline-flex items-center gap-1 rounded-full bg-peach/40 px-3 py-1 text-xs font-semibold text-terracotta"
                                                        >
                                                            #{tag}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTag(tag)}
                                                                className="rounded-full hover:bg-peach/75 p-0.5 text-terracotta"
                                                            >
                                                                <XIcon className="size-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <FormMessage className="admin-form-error" />
                                    </FormItem>
                                )}
                            />

                            {/* Deck Selection */}
                            <FormField
                                control={form.control}
                                name="deckIds"
                                render={() => (
                                    <FormItem className="flex flex-col">
                                        <div className="flex items-center justify-between">
                                            <FormLabel className="admin-form-label">
                                                Chọn bộ thẻ chia sẻ {!isEdit && "*"} {!isEdit && "(Chọn ít nhất 1 deck)"}
                                            </FormLabel>
                                            <span className="text-[10px] font-bold text-terracotta uppercase tracking-wider">
                                                Đã chọn: {selectedDeckIds.length}/50
                                            </span>
                                        </div>

                                        <div className="relative mt-2">
                                            <Input
                                                placeholder="Tìm kiếm bộ thẻ của bạn..."
                                                value={deckSearchInput}
                                                onChange={(e) => {
                                                    deckSearchRef.current = e.target.value
                                                    setDeckSearchInput(e.target.value)
                                                }}
                                                onKeyDown={handleDeckSearchKeyDown}
                                                className="admin-form-input h-10 text-sm pr-20"
                                            />
                                            <Button
                                                type="button"
                                                onClick={() => handleDeckSearch()}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 rounded-lg bg-terracotta text-white text-xs font-semibold"
                                            >
                                                Tìm
                                            </Button>
                                        </div>

                                        <div className="mt-3 border border-beige rounded-2xl max-h-[200px] overflow-y-auto bg-cream/20 p-2 divide-y divide-beige/50">
                                            {loadingDecks ? (
                                                <div className="flex items-center justify-center p-8 text-text-muted gap-2 text-sm">
                                                    <Loader2Icon className="size-4 animate-spin text-terracotta" />
                                                    Đang tải danh sách bộ thẻ...
                                                </div>
                                            ) : decks.length === 0 ? (
                                                <div className="p-8 text-center text-sm text-text-muted">
                                                    {deckParams.search
                                                        ? "Không tìm thấy bộ thẻ phù hợp."
                                                        : "Bạn chưa có bộ thẻ nào. Hãy tạo bộ thẻ trước!"}
                                                </div>
                                            ) : (
                                                decks.map((deck: any) => {
                                                    const isSelected = selectedDeckIds.includes(deck.id)
                                                    return (
                                                        <button
                                                            key={deck.id}
                                                            type="button"
                                                            onClick={() => toggleDeckSelection(deck.id)}
                                                            className={`w-full flex items-center justify-between p-3 transition-colors text-left rounded-xl hover:bg-cream/70 ${isSelected ? "bg-peach/10 hover:bg-peach/15" : ""
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg ${isSelected ? "bg-peach/30" : "bg-beige/40"}`}>
                                                                    <FolderIcon className={`size-4 ${isSelected ? "text-terracotta" : "text-text-muted"}`} />
                                                                </div>
                                                                <div>
                                                                    <p className={`text-sm font-semibold ${isSelected ? "text-terracotta" : "text-text-primary"}`}>
                                                                        {deck.name}
                                                                    </p>
                                                                    <p className="text-[10px] text-text-muted/80">
                                                                        {deck.fullPath || deck.name} • {deck._count?.cards || 0} thẻ
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className={`size-5 rounded-md border flex items-center justify-center transition-all ${isSelected
                                                                ? "border-terracotta bg-terracotta text-white"
                                                                : "border-beige bg-white"
                                                                }`}>
                                                                {isSelected && <CheckIcon className="size-3.5 stroke-[3]" />}
                                                            </div>
                                                        </button>
                                                    )
                                                })
                                            )}
                                        </div>
                                        {totalPages > 1 && (
                                            <div className="mt-3 flex items-center justify-between">
                                                <PaginationInfo
                                                    page={meta?.page ?? 1}
                                                    limit={metaLimit}
                                                    totalItems={metaTotal}
                                                    currentLength={decks.length}
                                                    label="bộ thẻ"
                                                    className="text-[11px] text-text-muted"
                                                />
                                                <DataPagination
                                                    page={meta?.page ?? 1}
                                                    totalPages={totalPages}
                                                    onPageChange={(p) => setDeckParams((prev) => ({ ...prev, page: p }))}
                                                />
                                            </div>
                                        )}
                                        <FormMessage className="admin-form-error mt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="admin-dialog-footer justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                                className="admin-btn-cancel"
                                disabled={isPending}
                            >
                                Hủy bỏ
                            </Button>
                            <Button
                                type="submit"
                                className="bg-terracotta hover:bg-terracotta-dark text-white h-12 px-8 rounded-xl font-bold transition-all shadow-md shadow-terracotta/10"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2Icon className="mr-2 size-4 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    isEdit ? "Cập nhật" : "Chia sẻ"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
