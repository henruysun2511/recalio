import { Title } from "@/components/common/title"
import Link from "next/link"

export function CtaSection() {
    return (
        <section id="cta" className="max-w-7xl mx-auto px-8 py-20 text-center">
            <div className="bg-terracotta text-white p-16 rounded-[40px]">
                <Title title="Ready to learn smarter?" className="text-5xl mb-6 text-white" />
                <p className="text-xl mb-10 opacity-90">Bắt đầu học từ vựng với Recalio ngay hôm nay.</p>
                <Link href="/auth/register">
                    <button className="bg-white text-terracotta px-10 py-4 rounded-full font-bold text-lg hover:opacity-90">Tạo tài khoản miễn phí</button>
                </Link>
            </div>
        </section>
    )
}
