"use client"

import { useState } from "react"
import { ChevronDown, MessageCircle, Quote, Star } from "lucide-react"
import { Title } from "@/components/common/title"
import { UserAvatar } from "@/components/common/user-avatar"
import { cn } from "@/lib/utils"

const testimonials = [
    {
        name: "Nguyễn Văn A",
        username: "nguyenvanA",
        score: "TOEIC 945",
        text: "Recalio giúp tôi ghi nhớ hơn 6000 từ vựng tiếng Anh. Flashcard AI tiết kiệm cho tôi hàng giờ mỗi tuần.",
    },
    {
        name: "Trần Thị B",
        username: "tranthib",
        score: "Sinh viên Y khoa",
        text: "Tải lên bài giảng PDF và nhận ghi chú có cấu trúc ngay lập tức thật không thể tin được.",
    },
    {
        name: "Lê Văn C",
        username: "levanc",
        score: "Lập trình viên",
        text: "Thuật toán ôn tập SM-2 giúp tôi nhớ mãi không quên. Rất phù hợp cho việc học từ vựng kỹ thuật.",
    },
]

const faqs = [
    {
        q: "Recalio có miễn phí không?",
        a: "Recalio cung cấp gói miễn phí với đầy đủ tính năng cơ bản. Bạn có thể nâng cấp lên gói Pro để mở khóa thêm nhiều tính năng AI nâng cao.",
    },
    {
        q: "AI tạo flashcard như thế nào?",
        a: "AI phân tích nội dung bạn tải lên, trích xuất từ khóa quan trọng và tự động tạo flashcard với nhiều dạng câu hỏi khác nhau.",
    },
    {
        q: "Tôi có thể tải lên tài liệu PDF không?",
        a: "Có, bạn có thể tải lên file PDF và AI sẽ tự động trích xuất nội dung, tạo ghi chú và flashcard chỉ trong vài giây.",
    },
    {
        q: "Tôi có thể chia sẻ bộ thẻ công khai không?",
        a: "Có, bạn có thể chia sẻ bộ thẻ lên Marketplace để mọi người cùng sử dụng và học tập.",
    },
    {
        q: "Recalio có hỗ trợ spaced repetition không?",
        a: "Có, Recalio sử dụng thuật toán SM-2 và FSRS, hai thuật toán spaced repetition hàng đầu giúp tối ưu lịch ôn tập.",
    },
]

export function TestimonialsSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section id="community" className="relative overflow-hidden py-24">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-peach-light/30 to-transparent" />
            <div className="relative mx-auto max-w-7xl px-8">
                <div className="mb-14 text-center">
                    <span className="inline-flex rounded-full bg-peach px-4 py-2 text-sm font-semibold text-terracotta">Community</span>
                    <Title title="Loved by learners" className="mt-5 text-5xl" />
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
                        Hàng nghìn người dùng Recalio mỗi ngày để tạo ghi chú thông minh, flashcard AI và ôn tập hiệu quả.
                    </p>
                </div>
                <div className="grid gap-10 lg:grid-cols-2">
                    {/* LEFT - Testimonials */}
                    <div>
                        <div className="mb-6 flex items-center gap-3">
                            <MessageCircle className="size-5 text-terracotta" />
                            <h3 className="text-2xl font-bold">What learners say</h3>
                        </div>
                        <div className="space-y-5">
                            {testimonials.map((item, index) => (
                                <div key={index} className="rounded-[28px] border border-beige bg-white p-7 transition hover:-translate-y-1 hover:border-terracotta/30">
                                    <div className="flex items-center justify-between">
                                        <Quote className="size-8 text-terracotta/30" />
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="mt-6 leading-8 text-text-muted">&ldquo;{item.text}&rdquo;</p>
                                    <div className="mt-8 flex items-center gap-4">
                                        <UserAvatar username={item.username} fullName={item.name} className="size-12 rounded-2xl" />
                                        <div>
                                            <h4 className="font-bold">{item.name}</h4>
                                            <p className="text-sm text-text-muted">{item.score}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT - FAQ */}
                    <div>
                        <div className="mb-6 flex items-center gap-3">
                            <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="rounded-[24px] border border-beige bg-white transition hover:border-terracotta/30">
                                    <button
                                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                        className="group flex w-full items-center justify-between px-7 py-6 text-left"
                                    >
                                        <span className="font-semibold text-text-primary">{faq.q}</span>
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cream transition group-hover:bg-peach">
                                            <ChevronDown className={cn("size-5 text-text-muted transition duration-200", openIndex === i && "rotate-180")} />
                                        </div>
                                    </button>
                                    {openIndex === i && (
                                        <div className="px-7 pb-6 pt-0 text-text-muted leading-relaxed">{faq.a}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 rounded-[28px] bg-gradient-to-r from-terracotta to-terracotta-dark p-8 text-white">
                            <h4 className="text-2xl font-bold">Still have questions?</h4>
                            <p className="mt-2 text-white/80">Liên hệ với đội ngũ của chúng tôi hoặc tham gia cộng đồng để nhận sự trợ giúp từ những người học khác.</p>
                            <button className="mt-6 rounded-2xl bg-white px-6 py-3 font-semibold text-terracotta transition hover:scale-105">Contact Us</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
