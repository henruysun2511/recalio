import {
    BookOpen,
    Brain,
    Clock3,
    GraduationCap,
    ArrowRight,
    Flame,
} from "lucide-react";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-peach-light p-4 md:p-8">
            <div className="mx-auto max-w-7xl rounded-[32px] bg-cream overflow-hidden">

                {/* NAVBAR */}

                <nav className="flex items-center justify-between px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-terracotta" />

                        <div>
                            <h1 className="font-bold text-text-primary">
                                FlashMind
                            </h1>

                            <p className="text-xs text-neutral-500">
                                Learn anything
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-text-primary">
                        <a href="#">Decks</a>
                        <a href="#">Features</a>
                        <a href="#">Pricing</a>
                        <a href="#">Community</a>
                    </div>

                    <button className="rounded-full bg-terracotta px-5 py-3 text-white">
                        Sign In
                    </button>
                </nav>

                {/* HERO */}

                <section className="grid lg:grid-cols-2 gap-10 px-8 py-12">

                    <div className="flex flex-col justify-center">
                        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-beige px-4 py-2 text-sm">
                            <Flame size={16} />
                            Learn faster with AI
                        </div>

                        <h1 className="text-5xl font-bold leading-tight text-text-primary">
                            Remember Everything You Learn
                        </h1>

                        <p className="mt-6 max-w-lg text-lg text-neutral-600">
                            Build flashcards, review with spaced repetition,
                            and retain knowledge for the long term.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button className="rounded-full bg-terracotta px-8 py-4 text-white font-medium">
                                Start Learning
                            </button>

                            <button className="rounded-full bg-white px-8 py-4 font-medium text-text-primary">
                                Browse Decks
                            </button>
                        </div>
                    </div>

                    {/* Illustration */}

                    <div className="relative">
                        <div className="h-[450px] rounded-[32px] bg-beige p-6">

                            <div className="grid h-full grid-cols-2 gap-5">

                                <div className="rounded-[28px] bg-yellow-soft" />

                                <div className="rounded-[28px] bg-green-soft" />

                                <div className="rounded-[28px] bg-peach" />

                                <div className="rounded-[28px] bg-brown-soft" />
                            </div>

                            <div className="absolute bottom-10 left-10 rounded-[24px] bg-terracotta px-6 py-5 text-white">
                                <h3 className="text-2xl font-semibold">
                                    Daily Review
                                </h3>

                                <p className="opacity-90">
                                    120 cards waiting
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STATS */}

                <section className="px-8 pb-10">
                    <div className="grid md:grid-cols-3 gap-5">

                        <div className="rounded-[28px] bg-white p-6">
                            <Clock3 className="mb-4 text-terracotta" />

                            <h3 className="text-3xl font-bold">
                                120
                            </h3>

                            <p className="text-neutral-500">
                                Reviews Today
                            </p>
                        </div>

                        <div className="rounded-[28px] bg-white p-6">
                            <BookOpen className="mb-4 text-terracotta" />

                            <h3 className="text-3xl font-bold">
                                25
                            </h3>

                            <p className="text-neutral-500">
                                New Cards
                            </p>
                        </div>

                        <div className="rounded-[28px] bg-white p-6">
                            <Brain className="mb-4 text-terracotta" />

                            <h3 className="text-3xl font-bold">
                                92%
                            </h3>

                            <p className="text-neutral-500">
                                Retention Rate
                            </p>
                        </div>
                    </div>
                </section>

                {/* POPULAR DECKS */}

                <section className="px-8 py-10">
                    <h2 className="mb-6 text-3xl font-bold text-text-primary">
                        Popular Decks
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

                        {[
                            "English Vocabulary",
                            "JLPT N5",
                            "Biology",
                            "World History",
                        ].map((deck) => (
                            <div
                                key={deck}
                                className="rounded-[28px] bg-white p-5"
                            >
                                <div className="mb-4 h-40 rounded-[22px] bg-beige" />

                                <h3 className="font-semibold">
                                    {deck}
                                </h3>

                                <p className="mt-2 text-sm text-neutral-500">
                                    1,200 cards
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* HOW IT WORKS */}

                <section className="px-8 py-12">
                    <h2 className="mb-8 text-3xl font-bold">
                        How It Works
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        <div className="rounded-[28px] bg-white p-6">
                            <BookOpen className="mb-4 text-terracotta" />

                            <h3 className="font-semibold text-xl">
                                Create Cards
                            </h3>

                            <p className="mt-3 text-neutral-500">
                                Build your own flashcards or import decks.
                            </p>
                        </div>

                        <div className="rounded-[28px] bg-white p-6">
                            <Clock3 className="mb-4 text-terracotta" />

                            <h3 className="font-semibold text-xl">
                                Review Daily
                            </h3>

                            <p className="mt-3 text-neutral-500">
                                Smart scheduling chooses the perfect review time.
                            </p>
                        </div>

                        <div className="rounded-[28px] bg-white p-6">
                            <GraduationCap className="mb-4 text-terracotta" />

                            <h3 className="font-semibold text-xl">
                                Retain Longer
                            </h3>

                            <p className="mt-3 text-neutral-500">
                                Spaced repetition helps memory last for years.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}

                <section className="px-8 pb-12">
                    <div className="rounded-[32px] bg-terracotta p-10 text-center text-white">

                        <h2 className="text-4xl font-bold">
                            Ready to master any subject?
                        </h2>

                        <p className="mt-4 opacity-90">
                            Join thousands of learners using FlashMind every day.
                        </p>

                        <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-terracotta font-semibold">
                            Get Started
                            <ArrowRight size={18} />
                        </button>

                    </div>
                </section>

            </div>
        </main>
    );
}