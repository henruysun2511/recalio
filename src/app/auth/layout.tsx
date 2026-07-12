"use client"

import { Brain, Sparkles } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="auth-container">
            <div className="auth-card">
                {/* LEFT SIDE */}
                <section className="hidden lg:flex lg:w-1/2 bg-terracotta p-10 text-white flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                                <Brain size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Recalio
                                </h2>
                                <p className="text-white/80">
                                    Học từ vựng thông minh
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* HERO */}
                    <div className="max-w-lg py-10">
                        <h1 className="text-3xl font-black tracking-tighter leading-tight text-white">
                            Học từ vựng
                            <br />
                            chưa bao giờ dễ đến thế
                        </h1>
                        <p className="mt-6 text-lg text-white/80">
                            Ứng dụng học từ vựng thông minh với thuật toán lặp lại ngắt quãng (SRS),
                            hình ảnh minh hoạ và phát âm chuẩn bản ngữ.
                        </p>
                        <ul className="mt-8 space-y-3">
                            <li className="flex items-center gap-3">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">1</span>
                                <span>Thuật toán SRS tối ưu lịch ôn tập</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">2</span>
                                <span>Hỗ trợ đa ngôn ngữ, phát âm chuẩn</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">3</span>
                                <span>Kho đề có sẵn và tự tạo bộ thẻ riêng</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-bold">4</span>
                                <span>Theo dõi tiến độ và thống kê chi tiết</span>
                            </li>
                        </ul>
                    </div>

                    {/* Illustration */}
                    <div className="grid grid-cols-2 gap-4 mt-8">
                        {/* Khối 1 */}
                        <div className="h-32 rounded-[28px] bg-yellow-soft flex flex-col items-center justify-center p-4">
                            <span className="text-2xl font-bold text-text-primary">5M+</span>
                            <span className="text-xs text-text-muted font-medium mt-1">Thẻ Flashcard</span>
                        </div>

                        {/* Khối 2 */}
                        <div className="h-32 rounded-[28px] bg-green-soft flex flex-col items-center justify-center p-4">
                            <span className="text-2xl font-bold text-text-primary">50K+</span>
                            <span className="text-xs text-text-muted font-medium mt-1">Người dùng</span>
                        </div>

                        {/* Khối 3 */}
                        <div className="h-32 rounded-[28px] bg-peach flex flex-col items-center justify-center p-4">
                            <span className="text-2xl font-bold text-text-primary">4.9/5</span>
                            <span className="text-xs text-text-muted font-medium mt-1">Đánh giá</span>
                        </div>

                        {/* Khối 4 */}
                        <div className="h-32 rounded-[28px] bg-white/20 border border-white/20 flex flex-col items-center justify-center p-4">
                            <span className="text-2xl font-bold text-white">100+</span>
                            <span className="text-xs text-white/80 font-medium mt-1">Bộ đề mẫu</span>
                        </div>
                    </div>
                </section>

                {/* RIGHT SIDE */}
                <section className="flex flex-1 items-center justify-center p-6 md:p-12">
                    {children}
                </section>
            </div>
        </main>
    )
}