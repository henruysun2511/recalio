import { FileText, BrainCircuit, BookOpenCheck, Volume2, Users, Trophy } from "lucide-react"
import { Title } from "@/components/common/title"

const features = [
    { icon: FileText, title: "AI Notes", desc: "Tải lên tài liệu PDF, AI tự động trích xuất nội dung và tạo ghi chú có cấu trúc chỉ trong vài giây." },
    { icon: BrainCircuit, title: "AI Flashcards", desc: "Chuyển đổi ghi chú hoặc văn bản thành Flashcard thông minh với nhiều loại câu hỏi khác nhau." },
    { icon: BookOpenCheck, title: "Smart Review", desc: "Ôn tập bằng thuật toán SM-2 và FSRS giúp tối ưu thời điểm xem lại để ghi nhớ lâu hơn." },
    { icon: Volume2, title: "AI Audio", desc: "Tự động chuyển đổi ghi chú và Flashcard thành giọng nói tự nhiên, giúp bạn luyện nghe và học mọi lúc, mọi nơi." },
    { icon: Users, title: "Community", desc: "Theo dõi người dùng khác, chia sẻ bài viết, bộ thẻ và cùng nhau xây dựng cộng đồng học tập." },
    { icon: Trophy, title: "Gamification", desc: "Duy trì động lực học với XP, chuỗi ngày học, thành tích và bảng xếp hạng theo thời gian thực." },
]

export function FeaturesSection() {
    return (
        <section id="features" className="mx-auto my-20 max-w-7xl px-8">
            <div className="mx-auto mb-14 max-w-3xl text-center">
                <span className="inline-flex rounded-full bg-peach px-4 py-2 text-sm font-semibold text-terracotta">Features</span>
                <Title title="Everything You Need to Learn Smarter" className="mt-5 text-5xl" />
                <p className="mt-5 text-lg leading-8 text-text-muted">
                    Từ AI xử lý tài liệu, Flashcard thông minh đến cộng đồng học tập, Recalio cung cấp đầy đủ công cụ giúp bạn học hiệu quả và ghi nhớ lâu dài.
                </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {features.map((feature) => {
                    const Icon = feature.icon
                    return (
                        <div key={feature.title} className="group rounded-[32px] border border-beige bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-lg hover:shadow-terracotta/5">
                            <div className="mb-6 flex size-16 items-center justify-center rounded-3xl bg-peach text-terracotta transition group-hover:bg-terracotta group-hover:text-white">
                                <Icon className="size-8" />
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight text-text-primary">{feature.title}</h3>
                            <p className="mt-4 text-[15px] leading-7 text-text-muted">{feature.desc}</p>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
