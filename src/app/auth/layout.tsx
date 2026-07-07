"use client"

import { Brain, Flame } from "lucide-react"

import { StatCard1 } from "@/components/common/stat-card"



export default function AuthLayout({ children }: { children: React.ReactNode }) {
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
                    {children}
                </section>
            </div>
        </main>
    )
}