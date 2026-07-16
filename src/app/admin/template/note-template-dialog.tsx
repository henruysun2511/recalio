"use client"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { NoteTemplateType } from "@/constants/type"
import { NoteTemplate, createNoteTemplateSchema, updateNoteTemplateSchema } from "@/schemas/note-template.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, XIcon } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

interface NoteTemplateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: z.infer<typeof createNoteTemplateSchema | typeof updateNoteTemplateSchema>) => void
    initialData?: NoteTemplate | null
    loading?: boolean
}

export function NoteTemplateDialog({ open, onOpenChange, onSubmit, initialData, loading }: NoteTemplateDialogProps) {
    const schema = initialData ? updateNoteTemplateSchema : createNoteTemplateSchema

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: "", type: NoteTemplateType.BASIC, fieldNames: [""] },
    })

    useEffect(() => {
        if (open) {
            if (initialData) {
                form.reset({
                    name: initialData.name,
                    type: initialData.type as NoteTemplateType,
                    fieldNames: initialData.fieldNames,
                })
            } else {
                form.reset({ name: "", type: NoteTemplateType.BASIC, fieldNames: [""] })
            }
        }
    }, [initialData, form, open])

    const fields = form.watch("fieldNames") ?? [""]

    const addField = () => {
        form.setValue("fieldNames", [...fields, ""])
    }

    const removeField = (index: number) => {
        const updated = fields.filter((_, i) => i !== index)
        form.setValue("fieldNames", updated.length ? updated : [""])
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
                        <FileText className="size-5 text-terracotta" />
                    </div>
                    <DialogTitle className="admin-dialog-title">
                        {initialData ? "Chỉnh sửa template" : "Thêm template mới"}
                    </DialogTitle>
                    <DialogDescription className="admin-dialog-description">
                        {initialData ? "Cập nhật thông tin template..." : "Tạo template ghi chú mới..."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="admin-dialog-body space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">Tên template</FormLabel>
                                        <FormControl>
                                            <Input placeholder="vd: Basic, Vocabulary..." className="admin-form-input" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="admin-form-label">Loại template</FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger className="w-full h-10 border-gray-300 rounded-xl bg-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={NoteTemplateType.BASIC}>Basic</SelectItem>
                                                <SelectItem value={NoteTemplateType.BASIC_REVERSED}>Basic (Reversed)</SelectItem>
                                                <SelectItem value={NoteTemplateType.BASIC_AUDIO}>Basic (Audio Front)</SelectItem>
                                                <SelectItem value={NoteTemplateType.CLOZE}>Cloze</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <FormLabel className="admin-form-label !mb-0">Field names</FormLabel>
                                    <button
                                        type="button"
                                        onClick={addField}
                                        className="text-xs font-bold text-terracotta hover:underline"
                                    >
                                        + Thêm field
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {fields.map((_, index) => (
                                        <FormField
                                            key={index}
                                            control={form.control}
                                            name={`fieldNames.${index}`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <Input
                                                                placeholder={`Field ${index + 1}`}
                                                                className="admin-form-input flex-1"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeField(index)}
                                                            className="rounded-lg p-1.5 text-text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                                                        >
                                                            <XIcon className="size-4" />
                                                        </button>
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="admin-dialog-footer">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="admin-btn-cancel">
                                Hủy bỏ
                            </Button>
                            <Button type="submit" disabled={loading} className="admin-btn-primary">
                                {loading ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
