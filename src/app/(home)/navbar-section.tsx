import { Brain } from "lucide-react"
import Link from "next/link"

export function NavbarSection() {
    return (
        <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-terracotta flex items-center justify-center text-white">
                    <Brain size={24} />
                </div>
                <span className="text-xl font-bold">Recalio</span>
            </div>
            <div className="hidden md:flex items-center gap-8 font-medium text-sm text-text-muted">
                <a href="#features" className="hover:text-terracotta transition-colors">Features</a>
                <a href="#algorithm" className="hover:text-terracotta transition-colors">Algorithm</a>
                <a href="#image-learning" className="hover:text-terracotta transition-colors">AI Vision</a>
                <a href="#community" className="hover:text-terracotta transition-colors">Community</a>
            </div>
            <Link href="/auth/login">
                <button className="rounded-full bg-terracotta px-6 py-2.5 text-white text-sm font-semibold hover:opacity-90 transition">
                    Start Learning
                </button>
            </Link>
        </nav>
    )
}
