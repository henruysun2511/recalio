import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
    return (
        <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 px-8 py-16 items-center">
            <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-peach-light px-4 py-1.5 text-terracotta text-sm font-semibold mb-6">
                    <Sparkles size={14} /> AI-Powered Flashcards
                </div>
                <h1 className="text-6xl font-extrabold leading-[1.1] tracking-tighter mb-6">
                    Master anything <br /> <span className="text-terracotta">faster than ever.</span>
                </h1>
                <p className="text-lg text-text-muted mb-8 leading-relaxed">
                    Recalio giúp bạn học thông minh hơn với sức mạnh của AI và phương pháp lặp lại ngắt quãng
                    (Spaced Repetition). Hệ thống sẽ tự động trích xuất nội dung, tạo ghi chú có cấu trúc, sinh Flashcard chất lượng và xây dựng lộ trình ôn tập tối ưu bằng các thuật toán SM-2 và FSRS, giúp bạn ghi nhớ lâu hơn, giảm thời gian học nhưng vẫn đạt hiệu quả cao.                </p>
                <div className="flex gap-4">
                    <Link href="/auth/login">
                        <button className="bg-terracotta text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2">
                            Start Learning <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-beige shadow-xl rotate-2">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold">Dashboard</h3>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-peach-light p-4 rounded-2xl">
                        <p className="text-xs text-terracotta font-bold uppercase">Today</p>
                        <p className="text-2xl font-bold">24 cards</p>
                    </div>
                    <div className="bg-cream p-4 rounded-2xl">
                        <p className="text-xs text-text-muted font-bold uppercase">Decks</p>
                        <p className="text-2xl font-bold">7 active</p>
                    </div>
                </div>
                <div className="mt-4 h-32 bg-cream rounded-2xl flex items-center justify-center text-text-muted border-dashed border-2 border-beige">
                    AI Workspace: Drag PDF here
                </div>
            </div>
        </section>
    )
}
