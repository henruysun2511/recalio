"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react"

import { Title } from "@/components/common/title"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth.schema"
import { useForgotPassword } from "@/queries/useAuthQuery"
import { handleError } from "@/utils/handleError"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const forgotMutation = useForgotPassword()

    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordInput) => {
        await forgotMutation.mutateAsync(data, {
            onSuccess: (response: any) => {
                toast.success(response?.data?.message || "Mã OTP đã được gửi đến email của bạn")
                router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`)
            },
            onError: (error: any) => {
                handleError(error, "Gửi yêu cầu thất bại")
            },
        })
    }

    return (
        <div className="w-full max-w-md">
            <div className="mb-8">
                <Title title="Quên mật khẩu" description="Nhập email để nhận mã OTP đặt lại mật khẩu" className="text-4xl" />
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="john@example.com"
                                        className="form-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="form-btn"
                        disabled={forgotMutation.isPending}
                    >
                        {forgotMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Đang gửi...
                            </>
                        ) : (
                            "Gửi mã OTP"
                        )}
                    </Button>
                </form>
            </Form>

            <div className="mt-6 text-center">
                <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1 text-sm font-medium text-terracotta hover:underline"
                >
                    <ArrowLeft className="size-4" />
                    Quay lại đăng nhập
                </Link>
            </div>

            {/* Mobile branding */}
            <div className="mt-12 lg:hidden">
                <div className="rounded-[28px] bg-beige p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta text-white">
                            <BookOpen size={22} />
                        </div>
                        <div>
                            <h3 className="font-semibold">Recalio</h3>
                            <p className="text-sm text-neutral-500">Học từ vựng thông minh</p>
                        </div>
                    </div>
                    <p className="mt-4 text-neutral-600">
                        Ứng dụng học từ vựng với thuật toán lặp lại ngắt quãng (SRS),
                        hình ảnh minh hoạ và phát âm chuẩn bản ngữ.
                    </p>
                </div>
            </div>
        </div>
    )
}
