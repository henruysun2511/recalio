"use client";

import React from "react";
import {
    Flame,
    Users,
    BookOpen,
    Star,
    Calendar,
    MessageCircle,
    UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-off-white text-black">

            {/* <section className="relative h-72 border-b-4 border-black bg-blue-soft">
                <div className="absolute right-12 top-12 text-8xl">📚</div>
                <div className="absolute left-12 top-12 text-7xl">🤖</div>
            </section> */}

            {/* PROFILE HEADER - Đã sửa bố cục căn trái và tối ưu không gian */}
            <div className="mt-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col items-center text-center md:flex-row md:items-end md:text-left gap-6">
                    {/* Avatar với hiệu ứng nghiêng Neo-brutalism đặc trưng */}
                    <div
                        className="
                flex h-40 w-40 shrink-0 items-center justify-center
                rounded-full border-4 border-black
                bg-gold text-7xl
                shadow-[8px_8px_0px_#000]
                transform -rotate-3 hover:rotate-0 transition-transform duration-200
            "
                    >
                        😎
                    </div>

                    {/* Cụm thông tin tên và tiểu sử */}
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black tracking-tight">Huy Sun</h1>
                        <p className="inline-block rounded-xl border-2 border-black bg-white px-3 py-1 text-sm font-black shadow-[3px_3px_0px_#000]">
                            🚀 Level 12 Learner
                        </p>
                        <p className="max-w-xl font-bold text-zinc-700 pt-2">
                            Building better memories with AI, FSRS and flashcards every day.
                        </p>
                    </div>
                </div>

                {/* Cụm nút bấm hành động đẩy sang góc phải trên Desktop */}
                <div className="flex justify-center gap-4 sm:w-full md:w-auto">
                    <Button className="
            border-4 border-black
            bg-gold
            font-black
            text-black
            shadow-[4px_4px_0px_#000]
            hover:bg-gold-dark
            active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000]
            transition-all
        ">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Follow
                    </Button>

                    <Button className="
            border-4 border-black
            bg-blue-soft
            font-black
            text-black
            shadow-[4px_4px_0px_#000]
            hover:bg-blue-dark
            active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000]
            transition-all
        ">
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Message
                    </Button>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 pb-20">

                <div className="-mt-20 flex flex-col items-center">
                    <div
                        className="
              flex h-40 w-40 items-center justify-center
              rounded-full
              border-4 border-black
              bg-gold
              text-7xl
              shadow-[8px_8px_0px_#000]
            "
                    >
                        😎
                    </div>

                    <h1 className="mt-6 text-5xl font-black">Huy Sun</h1>

                    <p className="mt-2 text-xl font-bold">Level 12 Learner</p>

                    <p className="mt-3 max-w-xl text-center font-medium text-zinc-700">
                        Building better memories with AI, FSRS and flashcards every day.
                    </p>

                    <div className="mt-6 flex gap-4">
                        <Button className="
                border-4 border-black
                bg-gold
                font-bold
                text-black
                shadow-[4px_4px_0px_#000]
                hover:bg-gold-dark
              ">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Follow
                        </Button>

                        <Button className="
                border-4 border-black
                bg-pink-soft
                font-bold
                text-black
                shadow-[4px_4px_0px_#000]
                hover:bg-pink-dark
              ">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Message
                        </Button>
                    </div>
                </div>


                <div className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
                    <StatCard
                        icon={<Star className="h-6 w-6" />}
                        value="15,250"
                        label="XP"
                        color="#FFE27A"
                    />

                    <StatCard
                        icon={<Flame className="h-6 w-6" />}
                        value="127"
                        label="Streak"
                        color="#FFB7D5"
                    />

                    <StatCard
                        icon={<BookOpen className="h-6 w-6" />}
                        value="8,530"
                        label="Reviews"
                        color="#B8F5B0"
                    />

                    <StatCard
                        icon={<Users className="h-6 w-6" />}
                        value="1,280"
                        label="Followers"
                        color="#A7D8FF"
                    />
                </div>


                <div className="mt-10 grid gap-8 lg:grid-cols-[350px_1fr]">

                    <div className="space-y-6">
                        <Card className="
                rounded-[32px]
                border-4 border-black
                bg-white
                shadow-[8px_8px_0px_#000]
              ">
                            <CardContent className="p-6">
                                <h3 className="text-2xl font-black">About</h3>

                                <p className="mt-4 font-medium">
                                    Learning English 🇬🇧, Japanese 🇯🇵 and Fullstack Development.
                                </p>

                                <div className="mt-5 flex items-center gap-2 font-semibold text-zinc-700">
                                    <Calendar className="h-4 w-4" />
                                    Joined June 2026
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="
                rounded-[32px]
                border-4 border-black
                bg-purple-soft
                shadow-[8px_8px_0px_#000]
              ">
                            <CardContent className="p-6">
                                <h3 className="text-2xl font-black">Achievements</h3>

                                <div className="mt-6 space-y-4">
                                    <Achievement emoji="🔥" title="100 Day Streak" />
                                    <Achievement emoji="🏆" title="1000 Reviews" />
                                    <Achievement emoji="⭐" title="Level 10" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>


                    <div className="space-y-8">

                        <Card className="
                rounded-[32px]
                border-4 border-black
                bg-white
                shadow-[8px_8px_0px_#000]
              ">
                            <CardContent className="p-6">
                                <h2 className="text-3xl font-black">Learning Activity</h2>


                                <div
                                    className="mt-6 grid gap-2"
                                    style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}
                                >
                                    {Array.from({ length: 98 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`
                        aspect-square rounded-md border-2 border-black
                        ${i % 4 === 0
                                                    ? "bg-gold"
                                                    : i % 4 === 1
                                                        ? "bg-pink-soft"
                                                        : i % 4 === 2
                                                            ? "bg-blue-soft"
                                                            : "bg-[#B8F5B0]"
                                                }
                      `}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>


                        <Card className="
                rounded-[32px]
                border-4 border-black
                bg-white
                shadow-[8px_8px_0px_#000]
              ">
                            <CardContent className="p-6">
                                <h2 className="text-3xl font-black">Shared Decks</h2>

                                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                    <DeckCard color="#FFE27A" downloads="12k" title="IELTS Vocabulary" />

                                    <DeckCard color="#A7D8FF" downloads="8k" title="JLPT N3" />

                                    <DeckCard color="#B8F5B0" downloads="5k" title="React Interview" />

                                    <DeckCard color="#FFB7D5" downloads="15k" title="TOEIC Core" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    value: string;
    label: string;
    color: string;
}

function StatCard({ icon, value, label, color }: StatCardProps) {
    return (
        <Card
            className="
        border-4 border-black
        rounded-[28px]
        shadow-[8px_8px_0px_#000]
      "
            style={{ backgroundColor: color }}
        >
            <CardContent className="p-6">
                <div className="text-black">{icon}</div>

                <h3 className="mt-4 text-4xl font-black">{value}</h3>

                <p className="font-bold text-black/90">{label}</p>
            </CardContent>
        </Card>
    );
}

interface AchievementProps {
    emoji: string;
    title: string;
}

function Achievement({ emoji, title }: AchievementProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-3xl">{emoji}</div>
            <span className="font-bold text-black">{title}</span>
        </div>
    );
}

interface DeckCardProps {
    title: string;
    downloads: string;
    color: string;
}

function DeckCard({ title, downloads, color }: DeckCardProps) {
    return (
        <div
            className="
        rounded-[24px]
        border-4 border-black
        p-5
        shadow-[4px_4px_0px_#000]
      "
            style={{ backgroundColor: color }}
        >
            <h3 className="text-xl font-black">{title}</h3>
            <p className="mt-2 font-semibold text-black/80">{downloads} downloads</p>
        </div>
    );
}