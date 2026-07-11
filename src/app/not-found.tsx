import Link from "next/link"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-peach-light flex items-center justify-center p-4 md:p-8">
            <div className="max-w-lg w-full text-center">
                <div className="bg-white rounded-[36px] border border-beige p-12 md:p-16 shadow-sm">
                    <div className="size-20 rounded-3xl bg-cream border border-beige flex items-center justify-center mx-auto mb-8">
                        <span className="text-4xl font-black text-terracotta">?</span>
                    </div>

                    <h1 className="text-7xl md:text-8xl font-black text-terracotta tracking-tighter leading-none">
                        404
                    </h1>

                    <p className="mt-4 text-lg font-semibold text-text-primary">
                        Trang không tìm thấy
                    </p>

                    <p className="mt-2 text-sm text-text-muted max-w-xs mx-auto">
                        Có vẻ như trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="inline-flex h-12 px-8 rounded-2xl bg-terracotta text-white font-semibold items-center justify-center hover:bg-terracotta-dark hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                        >
                            Về trang chủ
                        </Link>
                        <Link
                            href="/community"
                            className="inline-flex h-12 px-8 rounded-2xl border border-beige bg-white text-text-primary font-semibold items-center justify-center hover:border-terracotta/30 hover:bg-cream transition-all duration-200"
                        >
                            Cộng đồng
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-xs text-text-muted/60">
                    Recalio &mdash; AI Powered Flashcard Learning Platform
                </p>
            </div>
        </div>
    )
}
