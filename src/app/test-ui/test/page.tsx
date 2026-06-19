"use client";

import React from "react";
import {
  ArrowRight,
  Sparkles,
  Brain,
  Trophy,
  BookOpen,
  Star,
  Wand2,
  Flame,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FFFDF9] text-black">
      {/* NAVBAR */}
      <header className="border-b-4 border-black bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h1 className="text-2xl font-black">Recalio</h1>
              <p className="text-xs font-medium">AI Flashcard Learning</p>
            </div>
          </div>

          <div className="hidden gap-6 md:flex">
            <a href="#features" className="font-bold hover:underline">
              Features
            </a>
            <a href="#ai" className="font-bold hover:underline">
              AI
            </a>
            <a href="#marketplace" className="font-bold hover:underline">
              Marketplace
            </a>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="border-4 border-black font-bold">
              Login
            </Button>
            <Button className="border-4 border-black bg-black font-bold text-white hover:bg-zinc-800">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border-4 border-black bg-[#D6C2FF] px-4 py-2 font-bold">
              <Sparkles className="h-4 w-4" />
              Powered by AI + FSRS
            </div>

            <h1 className="text-6xl font-black leading-tight">
              Learn Faster.
              <br />
              Remember Longer.
            </h1>

            <p className="mt-6 max-w-xl text-xl font-medium text-zinc-700">
              Recalio helps you create flashcards with AI, review smarter using
              FSRS, and build long-term memory effortlessly.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-2xl border-4 border-black bg-[#FFE27A] font-bold text-black shadow-[6px_6px_0px_#000] hover:bg-[#ffd84d]"
              >
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="rounded-2xl border-4 border-black font-bold"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* MASCOT */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute -left-6 top-10 rounded-3xl border-4 border-black bg-[#B8F5B0] px-4 py-3 font-bold shadow-[6px_6px_0px_#000]">
                🔥 7 Day Streak
              </div>

              <div className="absolute -right-6 top-0 rounded-3xl border-4 border-black bg-[#FFB7D5] px-4 py-3 font-bold shadow-[6px_6px_0px_#000]">
                ⭐ +250 XP
              </div>

              <div className="rounded-[40px] border-4 border-black bg-[#A7D8FF] p-12 shadow-[12px_12px_0px_#000]">
                <div className="text-[180px]">🤖</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-[32px] border-4 border-black bg-[#FFE27A] shadow-[8px_8px_0px_#000]">
            <CardContent className="p-6">
              <div className="text-5xl">📚</div>
              <h3 className="mt-4 text-4xl font-black">1M+</h3>
              <p className="font-semibold">Flashcards Created</p>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-4 border-black bg-[#FFB7D5] shadow-[8px_8px_0px_#000]">
            <CardContent className="p-6">
              <div className="text-5xl">🔥</div>
              <h3 className="mt-4 text-4xl font-black">95%</h3>
              <p className="font-semibold">Retention Rate</p>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-4 border-black bg-[#B8F5B0] shadow-[8px_8px_0px_#000]">
            <CardContent className="p-6">
              <div className="text-5xl">⚡</div>
              <h3 className="mt-4 text-4xl font-black">10x</h3>
              <p className="font-semibold">Faster Learning</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-12 text-center text-5xl font-black">Why Recalio?</h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="FSRS"
            color="#FFE27A"
            text="Optimize review intervals automatically."
          />

          <FeatureCard
            icon={<Wand2 className="h-8 w-8" />}
            title="AI Generate"
            color="#A7D8FF"
            text="Generate flashcards from any text."
          />

          <FeatureCard
            icon={<BookOpen className="h-8 w-8" />}
            title="Smart Decks"
            color="#FFB7D5"
            text="Organize your learning efficiently."
          />

          <FeatureCard
            icon={<Trophy className="h-8 w-8" />}
            title="Gamification"
            color="#B8F5B0"
            text="XP, levels, streaks and achievements."
          />
        </div>
      </section>

      {/* AI SECTION */}
      <section id="ai" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[40px] border-4 border-black bg-[#D6C2FF] p-10 shadow-[10px_10px_0px_#000]">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-5xl font-black">AI Card Generator</h2>

              <p className="mt-6 text-xl font-medium">
                Paste a paragraph and instantly create vocabulary flashcards.
              </p>

              <Button className="mt-8 border-4 border-black bg-black font-bold text-white hover:bg-zinc-800">
                Try AI
              </Button>
            </div>

            <div className="rounded-3xl border-4 border-black bg-white p-6">
              <p className="font-medium text-zinc-800">
                Climate change is one of the most pressing issues...
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-xl border-2 border-black bg-[#FFE27A] px-3 py-2 font-bold">
                  climate
                </span>

                <span className="rounded-xl border-2 border-black bg-[#A7D8FF] px-3 py-2 font-bold">
                  pressing
                </span>

                <span className="rounded-xl border-2 border-black bg-[#B8F5B0] px-3 py-2 font-bold">
                  issue
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARKETPLACE */}
      <section id="marketplace" className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="mb-12 text-center text-5xl font-black">
          Community Decks
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {["IELTS", "JLPT N3", "React"].map((deck) => (
            <Card
              key={deck}
              className="rounded-[32px] border-4 border-black bg-white shadow-[8px_8px_0px_#000]"
            >
              <CardContent className="p-6">
                <h3 className="text-2xl font-black">{deck}</h3>

                <div className="mt-4 flex items-center gap-2 font-bold">
                  <Star className="h-4 w-4 fill-current text-black" />
                  4.9
                </div>

                <Button className="mt-6 w-full border-4 border-black bg-[#FFE27A] font-bold text-black hover:bg-[#ffd84d]">
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-[40px] border-4 border-black bg-[#FFE27A] p-12 text-center shadow-[12px_12px_0px_#000]">
          <Flame className="mx-auto h-12 w-12 fill-current text-black" />

          <h2 className="mt-6 text-5xl font-black">Ready To Master Anything?</h2>

          <p className="mt-4 text-xl font-medium">
            Start learning smarter with Recalio today.
          </p>

          <Button
            size="lg"
            className="mt-8 border-4 border-black bg-black font-bold text-white hover:bg-zinc-800"
          >
            Get Started Free
          </Button>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  text,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  color: string;
}) {
  return (
    <Card
      className="rounded-[32px] border-4 border-black shadow-[8px_8px_0px_#000]"
      style={{ backgroundColor: color }}
    >
      <CardContent className="p-6">
        <div className="mb-4 text-black">{icon}</div>

        <h3 className="text-2xl font-black">{title}</h3>

        <p className="mt-3 font-medium text-black/80">{text}</p>
      </CardContent>
    </Card>
  );
}