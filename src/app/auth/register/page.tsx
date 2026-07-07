"use client"

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
                <h2 className="text-4xl font-bold text-text-primary">
                    Create Account
                </h2>

                <p className="mt-2 text-neutral-500">
                    Start your learning journey.
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
                                <FormLabel>Display Name</FormLabel>
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
                                <FormLabel>Password</FormLabel>
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
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
                    </Button>
                </form>
            </Form>

            <p className="mt-8 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link
                    href="/auth/login"
                    className="font-medium text-terracotta"
                >
                    Sign In
                </Link>
            </p>
        </div>
    );
}
