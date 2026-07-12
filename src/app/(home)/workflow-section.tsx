import { FileText, Brain, BookOpen, Zap, Flame } from "lucide-react"
import { Title } from "@/components/common/title"

const steps = [
    { label: "Upload", icon: FileText },
    { label: "Extract", icon: Brain },
    { label: "AI Notes", icon: BookOpen },
    { label: "Study", icon: Zap },
    { label: "Master", icon: Flame },
]

export function WorkflowSection() {
    return (
        <section className="max-w-5xl mx-auto px-8 py-20">
            <Title title="The Learning Journey" className="text-5xl text-center mb-16" />
            <div className="relative flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="absolute top-8 left-[10%] right-[10%] h-0.5 bg-beige hidden md:block" />
                {steps.map((step, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center gap-4 bg-off-white">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-beige flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-terracotta">
                            <step.icon size={24} />
                        </div>
                        <span className="font-semibold text-neutral-700">{step.label}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}
