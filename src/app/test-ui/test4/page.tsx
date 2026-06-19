import {
    Home,
    BookOpen,
    Brain,
    Trophy,
    Users,
    ArrowRight,
    Flame,
    Clock3,
    Star,
} from "lucide-react";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-[#F4D8C5]  lg:p-8">
            <div className=" flex min-h-[calc(100vh-2rem)]  overflow-hidden rounded-[32px] bg-[#FCF6EA]">

                {/* ================= SIDEBAR ================= */}

                <aside className="bg-[#D97D56] hidden w-[260px] border-r border-[#EFE4D5] lg:flex lg:flex-col lg:justify-between p-6">

                    <div>
                        <div className="mb-10 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D97D56] text-white">
                                <Brain size={24} />
                            </div>

                            <div>
                                <h2 className="font-bold text-[#2E2E2E]">
                                    FlashMind
                                </h2>

                                <p className="text-xs text-neutral-500">
                                    Learn smarter
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">

                            <SidebarItem
                                active
                                icon={<Home size={18} />}
                            >
                                Home
                            </SidebarItem>

                            <SidebarItem
                                icon={<BookOpen size={18} />}
                            >
                                Decks
                            </SidebarItem>

                            <SidebarItem
                                icon={<Brain size={18} />}
                            >
                                AI Learning
                            </SidebarItem>

                            <SidebarItem
                                icon={<Trophy size={18} />}
                            >
                                Progress
                            </SidebarItem>

                            <SidebarItem
                                icon={<Users size={18} />}
                            >
                                Community
                            </SidebarItem>
                        </div>
                    </div>

                    <div className="rounded-[24px] bg-white p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-[#D97D56]" />

                            <div>
                                <h4 className="font-medium text-[#2E2E2E]">
                                    Jack
                                </h4>

                                <p className="text-sm text-neutral-500">
                                    🔥 24 Day Streak
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ================= CONTENT ================= */}

                <div className="flex-1 overflow-auto">

                    {/* NAVBAR */}

                    <header className="flex items-center justify-between px-6 py-6 lg:px-10">

                        <div className="lg:hidden flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D97D56] text-white">
                                <Brain size={20} />
                            </div>

                            <span className="font-bold text-[#2E2E2E]">
                                FlashMind
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8 text-[#2E2E2E]">
                            <a href="#">Features</a>
                            <a href="#">Pricing</a>
                            <a href="#">Community</a>
                            <a href="#">Blog</a>
                        </div>

                        <button className="rounded-full bg-[#D97D56] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#C96A42]">
                            Sign In
                        </button>
                    </header>

                    {/* HERO */}

                    <section className="px-6 lg:px-10">
                        <div className="relative overflow-hidden rounded-[32px] bg-[#F6EBDD] p-8 lg:p-12">

                            <div className="max-w-2xl">

                                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[#2E2E2E]">
                                    <Flame size={16} />
                                    AI-powered spaced repetition
                                </div>

                                <h1 className="mt-6 text-4xl font-bold leading-tight text-[#2E2E2E] lg:text-6xl">
                                    Remember More.
                                    <br />
                                    Forget Less.
                                </h1>

                                <p className="mt-5 max-w-xl text-lg text-neutral-600">
                                    Learn languages, medicine, programming,
                                    history and more with smart flashcards,
                                    AI assistance and scientifically proven
                                    spaced repetition.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <button className="rounded-full bg-[#D97D56] px-8 py-4 font-medium text-white transition hover:bg-[#C96A42]">
                                        Start Learning
                                    </button>

                                    <button className="rounded-full bg-white px-8 py-4 font-medium text-[#2E2E2E]">
                                        Browse Decks
                                    </button>
                                </div>
                            </div>

                            {/* Decorative illustration */}

                            <div className="absolute right-10 top-10 hidden xl:block">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-32 w-32 rounded-[28px] bg-[#F8E4B5]" />
                                    <div className="h-32 w-32 rounded-[28px] bg-[#DCE9D8]" />
                                    <div className="h-32 w-32 rounded-[28px] bg-[#F4D6C8]" />
                                    <div className="h-32 w-32 rounded-[28px] bg-white" />
                                </div>
                            </div>

                            <div className="absolute bottom-6 left-6 rounded-[24px] bg-[#D97D56] px-6 py-4 text-white">
                                <h3 className="text-xl font-semibold">
                                    Daily Review
                                </h3>

                                <p className="text-sm text-white/90">
                                    120 cards waiting
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* STATS */}

                    <section className="px-6 py-10 lg:px-10">
                        <div className="grid gap-5 md:grid-cols-3">

                            <StatCard
                                icon={<Clock3 size={24} />}
                                value="120"
                                label="Reviews Today"
                            />

                            <StatCard
                                icon={<BookOpen size={24} />}
                                value="25"
                                label="New Cards"
                            />

                            <StatCard
                                icon={<Brain size={24} />}
                                value="92%"
                                label="Retention Rate"
                            />
                        </div>
                    </section>

                    {/* POPULAR DECKS */}

                    <section className="px-6 pb-10 lg:px-10">
                        <div className="mb-6 flex items-center justify-between">

                            <h2 className="text-3xl font-bold text-[#2E2E2E]">
                                Popular Decks
                            </h2>

                            <button className="flex items-center gap-2 text-[#D97D56]">
                                View All
                                <ArrowRight size={18} />
                            </button>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                            <DeckCard
                                title="English Vocabulary"
                                cards="1,200 Cards"
                                color="#F8E4B5"
                            />

                            <DeckCard
                                title="JLPT N5"
                                cards="850 Cards"
                                color="#DCE9D8"
                            />

                            <DeckCard
                                title="Biology"
                                cards="2,300 Cards"
                                color="#F4D6C8"
                            />

                            <DeckCard
                                title="World History"
                                cards="1,500 Cards"
                                color="#EBD7C6"
                            />
                        </div>
                    </section>

                    {/* FEATURES */}

                    <section className="px-6 py-8 lg:px-10">

                        <h2 className="mb-6 text-3xl font-bold text-[#2E2E2E]">
                            Why Students Love FlashMind
                        </h2>

                        <div className="grid gap-5 md:grid-cols-3">

                            <FeatureCard
                                title="AI Flashcards"
                                desc="Generate flashcards automatically from notes, PDFs and documents."
                            />

                            <FeatureCard
                                title="Spaced Repetition"
                                desc="Review at the perfect time to maximize long-term memory."
                            />

                            <FeatureCard
                                title="Study Analytics"
                                desc="Track progress, retention and learning streaks."
                            />
                        </div>
                    </section>

                    {/* CTA */}

                    <section className="px-6 py-10 lg:px-10">

                        <div className="rounded-[32px] bg-[#D97D56] p-10 text-center text-white">

                            <h2 className="text-4xl font-bold">
                                Ready to master any subject?
                            </h2>

                            <p className="mt-4 text-white/90">
                                Join thousands of learners improving
                                every day with FlashMind.
                            </p>

                            <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-[#D97D56]">
                                Get Started
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}

/* ================= COMPONENTS ================= */

function SidebarItem({
    icon,
    children,
    active,
}: {
    icon: React.ReactNode;
    children: React.ReactNode;
    active?: boolean;
}) {
    return (
        <button
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition
      ${active
                    ? "bg-[#D97D56] text-white"
                    : "text-[#2E2E2E] hover:bg-[#F6EBDD]"
                }`}
        >
            {icon}
            <span>{children}</span>
        </button>
    );
}

function StatCard({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode;
    value: string;
    label: string;
}) {
    return (
        <div className="rounded-[28px] bg-white p-6">
            <div className="mb-4 text-[#D97D56]">
                {icon}
            </div>

            <h3 className="text-3xl font-bold text-[#2E2E2E]">
                {value}
            </h3>

            <p className="text-neutral-500">
                {label}
            </p>
        </div>
    );
}

function DeckCard({
    title,
    cards,
    color,
}: {
    title: string;
    cards: string;
    color: string;
}) {
    return (
        <div className="rounded-[28px] bg-white p-5">

            <div
                className="mb-4 h-40 rounded-[22px]"
                style={{ backgroundColor: color }}
            />

            <h3 className="font-semibold text-[#2E2E2E]">
                {title}
            </h3>

            <p className="mt-2 text-sm text-neutral-500">
                {cards}
            </p>
        </div>
    );
}

function FeatureCard({
    title,
    desc,
}: {
    title: string;
    desc: string;
}) {
    return (
        <div className="rounded-[28px] bg-white p-6">

            <Star
                size={22}
                className="mb-4 text-[#D97D56]"
            />

            <h3 className="text-xl font-semibold text-[#2E2E2E]">
                {title}
            </h3>

            <p className="mt-3 text-neutral-500">
                {desc}
            </p>
        </div>
    );
}