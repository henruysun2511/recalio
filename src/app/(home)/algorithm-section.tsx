"use client"

import { useState } from "react"
import {
    BrainCircuit,
    CheckCircle2,
    RotateCcw,
    Sparkles,
} from "lucide-react"

export function AlgorithmSection() {
    const [flip, setFlip] = useState(false)

    return (
        <section id="algorithm" className="mx-auto max-w-7xl px-8 py-24">
            <div className="rounded-[40px] border border-beige bg-white p-12">
                <div className="grid gap-16 lg:grid-cols-2">

                    {/* LEFT */}
                    <div>
                        <h2 className="mt-5 text-5xl font-black tracking-tight">
                            Powered by
                            <br />

                            SM-2 & FSRS

                        </h2>

                        <p className="mt-6 text-lg leading-8 text-text-muted">

                            Recalio sử dụng hai thuật toán ôn tập nổi tiếng
                            <span className="font-semibold text-text-primary">
                                {" "}SM-2{" "}
                            </span>
                            và
                            <span className="font-semibold text-text-primary">
                                {" "}FSRS{" "}
                            </span>
                            để tính toán thời điểm xem lại tối ưu cho từng Flashcard.

                            Hệ thống sẽ phân tích mức độ ghi nhớ của bạn sau mỗi lần học,
                            từ đó tự động điều chỉnh khoảng thời gian ôn tập nhằm giảm quên
                            và tối đa hóa khả năng ghi nhớ lâu dài.

                        </p>

                        <div className="mt-10 space-y-5">
                            <Feature title="Ít thời gian hơn" desc="Chỉ ôn khi thực sự cần thiết." />
                            <Feature title="Ghi nhớ lâu hơn" desc="Tăng khoảng cách giữa các lần ôn tập." />
                            <Feature title="AI tối ưu liên tục" desc="Khoảng thời gian được cập nhật sau mỗi lần trả lời." />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col items-center">
                        <div onClick={() => setFlip(!flip)} className="group perspective cursor-pointer">
                            <div className={`relative h-[330px] w-[420px] transition-all duration-700 [transform-style:preserve-3d] ${flip ? "[transform:rotateY(180deg)]" : ""}`}>
                                {/* FRONT */}
                                <div className="absolute inset-0 rounded-[36px] border border-beige bg-cream p-10 [backface-visibility:hidden]">
                                    <div className="mb-8 flex items-center gap-3">
                                        <BrainCircuit className="text-terracotta" />
                                        <span className="font-semibold">Front</span>
                                    </div>
                                    <div className="flex h-full items-center justify-center">
                                        <h3 className="text-center text-3xl font-black">
                                            What is<br />Artificial Intelligence?
                                        </h3>
                                    </div>
                                </div>
                                {/* BACK */}
                                <div className="absolute inset-0 rounded-[36px] border border-beige bg-peach p-10 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                    <div className="mb-8 flex items-center gap-3">
                                        <Sparkles className="text-terracotta" />
                                        <span className="font-semibold">Back</span>
                                    </div>
                                    <p className="leading-8 text-lg">
                                        Artificial Intelligence (AI) is the simulation of human intelligence by machines that can learn, reason and solve problems.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-5 text-sm text-text-muted">Nhấn vào Flashcard để lật.</p>

                        <div className="mt-8 flex gap-4">
                            <button className="rounded-2xl bg-red-100 px-6 py-3 font-semibold text-red-600">Again</button>
                            <button className="rounded-2xl bg-orange-100 px-6 py-3 font-semibold text-orange-600">Hard</button>
                            <button className="rounded-2xl bg-green-soft px-6 py-3 font-semibold text-green-700">Good</button>
                            <button className="rounded-2xl bg-blue-soft px-6 py-3 font-semibold text-blue-700">Easy</button>
                        </div>
                        <div className="mt-10 flex items-center gap-6">
                            <RotateCcw className="text-terracotta" />
                            <div>
                                <p className="font-semibold">Thuật toán sẽ tính khoảng thời gian mới</p>
                                <p className="text-sm text-text-muted">
                                    Again → 10 phút · Hard → 1 ngày · Good → 3 ngày · Easy → 7 ngày
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center bg-cream p-8 mt-12 rounded-3xl border border-beige">
                    {["Today", "Tomorrow", "3 Days", "7 Days", "30 Days"].map((time, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${i === 0 ? 'bg-terracotta' : 'bg-beige'}`} />
                            <span className="text-sm font-medium text-text-muted">{time}</span>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}

function Feature({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="flex gap-4">
            <div className="mt-1">
                <CheckCircle2 className="text-terracotta" />
            </div>
            <div>
                <h4 className="font-bold">{title}</h4>
                <p className="text-text-muted">{desc}</p>
            </div>
        </div>
    )
}
