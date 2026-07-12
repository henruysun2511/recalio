"use client"

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Title } from "@/components/common/title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { registerSchema, type RegisterInput } from "@/schemas/auth.schema";
import { useRegister } from "@/queries/useAuthQuery";
import { handleError } from "@/utils/handleError";
import { toast } from "sonner";

export default function RegisterPage() {
    const registerMutation = useRegister();

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        await registerMutation.mutateAsync(data, {
            onSuccess: (response: any) => {
                toast.success(response?.message || "Đăng ký thành công");
            },
            onError: (error: any) => {
                handleError(error, "Đăng ký thất bại");
            },
        });
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-8">
                <Title title="Tạo tài khoản" description="Bắt đầu hành trình học tập của bạn" className="text-4xl" />
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên đăng nhập</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="john_doe"
                                        className="form-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="form-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="displayName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên hiển thị</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="John Doe"
                                        className="form-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="At least 6 characters"
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
                        disabled={registerMutation.isPending}
                        className="form-btn"
                    >
                        {registerMutation.isPending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                    </Button>
                </form>
            </Form>

            <p className="mt-8 text-center text-sm text-neutral-500">
                Đã có tài khoản?{" "}
                <Link
                    href="/auth/login"
                    className="font-medium text-terracotta"
                >
                    Đăng nhập
                </Link>
            </p>
        </div>
    );
}
