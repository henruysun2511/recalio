"use client"

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Brain,
    BookOpen,
    Flame,
} from "lucide-react";

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
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import { useLogin } from "@/queries/useAuthQuery";
import { handleError } from "@/utils/handleError";
import { toast } from "sonner";
import { StatCard1 } from "@/components/common/stat-card";

export default function LoginPage() {
    const loginMutation = useLogin();

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginInput) => {
        await loginMutation.mutateAsync(data, {
            onSuccess: (response: any) => {
                toast.success(response?.message || "Đăng nhập thành công");
            },
            onError: (error: any) => {
                handleError(error, "Đăng nhập thất bại");
            },
        });
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-8">
                <h2 className="text-4xl font-bold text-text-primary">
                    Welcome Back
                </h2>

                <p className="mt-2 text-neutral-500">
                    Continue your learning journey.
                </p>
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
                                <FormLabel>Username</FormLabel>
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
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="form-input"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-neutral-600">
                            <input type="checkbox" />
                            Remember me
                        </label>

                        <Link
                            href="#"
                            className="text-sm text-terracotta"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="form-btn"
                    >
                        {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="form-divider">

                        <div className="form-divider-line" />

                        <div className="form-divider-text">
                            <span>or continue with</span>
                        </div>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        className="form-btn-outline"
                        onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                    >
                        Google
                    </Button>
                </form>
            </Form>

            <p className="mt-8 text-center text-sm text-neutral-500">
                Don't have an account?{" "}
                <Link
                    href="/auth/register"
                    className="font-medium text-terracotta"
                >
                    Sign Up
                </Link>
            </p>

            {/* Mobile branding */}
            <div className="mt-12 lg:hidden">
                <div className="rounded-[28px] bg-beige p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta text-white">
                            <BookOpen size={22} />
                        </div>
                        <div>
                            <h3 className="font-semibold">
                                FlashMind
                            </h3>
                            <p className="text-sm text-neutral-500">
                                Learn smarter every day
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-neutral-600">
                        AI-powered flashcards and
                        spaced repetition for better
                        long-term memory.
                    </p>
                </div>
            </div>
        </div>
    );
}
