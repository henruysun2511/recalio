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
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import { useLogin } from "@/queries/useAuthQuery";
import { StatCard1 } from "@/components/common/stat-card";

export default function LoginPage() {
    const loginMutation = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: LoginInput) => {
        loginMutation.mutate(data);
    };

    return (
        <main className="auth-container">
            <div className="auth-card">

                {/* LEFT SIDE */}

                <section className="hidden lg:flex lg:w-1/2 bg-terracotta p-10 text-white flex-col justify-between">

                    <div>
                        <div className="flex items-center gap-3">

                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                                <Brain size={28} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold">
                                    FlashMind
                                </h2>

                                <p className="text-white/80">
                                    Learn Smarter
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* HERO */}

                    <div className="max-w-lg">

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                            <Flame size={16} />
                            AI Powered Learning
                        </div>

                        <h1 className="text-5xl font-bold leading-tight">
                            Remember More.
                            <br />
                            Forget Less.
                        </h1>

                        <p className="mt-6 text-lg text-white/80">
                            Master languages, programming,
                            medicine and any subject with
                            spaced repetition and AI-generated
                            flashcards.
                        </p>

                        <div className="mt-10 grid grid-cols-3 gap-4">
                            <StatCard1
                                value="50K+"
                                label="Students"
                            />

                            <StatCard1
                                value="2M+"
                                label="Cards"
                            />

                            <StatCard1
                                value="94%"
                                label="Retention"
                            />
                        </div>
                    </div>

                    {/* Illustration */}

                    <div className="grid grid-cols-2 gap-4">

                        <div className="h-32 rounded-[28px] bg-yellow-soft" />

                        <div className="h-32 rounded-[28px] bg-green-soft" />

                        <div className="h-32 rounded-[28px] bg-peach" />

                        <div className="h-32 rounded-[28px] bg-white/20" />
                    </div>
                </section>

                {/* RIGHT SIDE */}

                <section className="flex flex-1 items-center justify-center p-6 md:p-12">

                    <div className="w-full max-w-md">

                        <div className="mb-8">

                            <h2 className="text-4xl font-bold text-text-primary">
                                Welcome Back
                            </h2>

                            <p className="mt-2 text-neutral-500">
                                Continue your learning journey.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <label className="form-label">Email</label>
                                <Input
                                    placeholder="john@example.com"
                                    className="form-input"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="form-label">Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="form-input"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-sm text-destructive">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

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
                            >
                                Google
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-sm text-neutral-500">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
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

                </section>
            </div>
        </main>
    );
}


