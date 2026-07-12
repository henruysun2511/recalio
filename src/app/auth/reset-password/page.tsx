"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Key, Lock, BookOpen, Loader2, CheckCircle2 } from "lucide-react"

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
import {
    verifyOtpSchema,
    resetPasswordSchema,
    type VerifyOtpInput,
    type ResetPasswordInput,
} from "@/schemas/auth.schema"
import { useVerifyOtp, useResetPassword } from "@/queries/useAuthQuery"
import { handleError } from "@/utils/handleError"
import { toast } from "sonner"

type Step = "otp" | "reset" | "done"

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const emailParam = searchParams.get("email") ?? ""

    const [step, setStep] = useState<Step>("otp")
    const [email, setEmail] = useState(emailParam)

    const verifyOtpMutation = useVerifyOtp()
    const resetPasswordMutation = useResetPassword()

    const otpForm = useForm<VerifyOtpInput>({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: { email, otpCode: "" },
    })

    const resetForm = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { email, otpCode: "", newPassword: "", confirmPassword: "" },
    })

    const onVerifyOtp = async (data: VerifyOtpInput) => {
        await verifyOtpMutation.mutateAsync(data, {
            onSuccess: () => {
                toast.success("Mã OTP hợp lệ")
                resetForm.setValue("email", data.email)
                resetForm.setValue("otpCode", data.otpCode)
                setStep("reset")
            },
            onError: (error: any) => {
                handleError(error, "Xác thực OTP thất bại")
            },
        })
    }

    const onResetPassword = async (data: ResetPasswordInput) => {
        await resetPasswordMutation.mutateAsync(data, {
            onSuccess: (response: any) => {
                toast.success(response?.data?.message || "Mật khẩu đã được đặt lại thành công")
                setStep("done")
            },
            onError: (error: any) => {
                handleError(error, "Đặt lại mật khẩu thất bại")
            },
        })
    }

    if (step === "done") {
        return (
            <div className="w-full max-w-md text-center">
                <div className="mb-8">
                    <CheckCircle2 className="mx-auto size-16 text-green-500" />
                    <div className="mt-4">
                        <Title title="Đặt lại mật khẩu thành công" description="Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại." className="text-4xl" />
                    </div>
                </div>
                <Button
                    onClick={() => router.push("/auth/login")}
                    className="form-btn"
                >
                    Đăng nhập
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md">
            <div className="mb-8">
                <Title
                    title={step === "otp" ? "Nhập mã OTP" : "Đặt lại mật khẩu"}
                    description={step === "otp"
                        ? `Mã OTP đã được gửi đến ${email || "email của bạn"}`
                        : "Nhập mật khẩu mới cho tài khoản của bạn"}
                    className="text-4xl"
                />
            </div>

            {step === "otp" && (
                <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(onVerifyOtp)} className="space-y-5">
                        <FormField
                            control={otpForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="john@example.com"
                                            className="form-input"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                setEmail(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={otpForm.control}
                            name="otpCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mã OTP</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Key className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                                            <Input
                                                placeholder="123456"
                                                className="form-input pl-10 text-center text-2xl tracking-[0.5em] font-bold"
                                                maxLength={6}
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="form-btn"
                            disabled={verifyOtpMutation.isPending}
                        >
                            {verifyOtpMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Đang xác thực...
                                </>
                            ) : (
                                "Xác thực OTP"
                            )}
                        </Button>
                    </form>
                </Form>
            )}

            {step === "reset" && (
                <Form {...resetForm}>
                    <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-5">
                        <FormField
                            control={resetForm.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu mới</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                                            <Input
                                                type="password"
                                                placeholder="Ít nhất 6 ký tự"
                                                className="form-input pl-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={resetForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
                                            <Input
                                                type="password"
                                                placeholder="Nhập lại mật khẩu mới"
                                                className="form-input pl-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="form-btn"
                            disabled={resetPasswordMutation.isPending}
                        >
                            {resetPasswordMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Đang đặt lại...
                                </>
                            ) : (
                                "Đặt lại mật khẩu"
                            )}
                        </Button>
                    </form>
                </Form>
            )}

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
