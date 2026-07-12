import { Image, FileText, Layers, Volume2 } from "lucide-react"
import { Title } from "@/components/common/title"

const items = [
    { title: "Object Recognition", desc: "AI nhận diện nhiều vật thể trong cùng một bức ảnh.", icon: Image },
    { title: "Automatic Vocabulary", desc: "Sinh từ vựng, nghĩa tiếng Việt và phiên âm tự động.", icon: FileText },
    { title: "Create Flashcards", desc: "Một cú nhấp để chuyển toàn bộ từ vựng thành Flashcards.", icon: Layers },
    { title: "Natural Pronunciation", desc: "Tự động sinh audio phát âm chuẩn cho từng từ.", icon: Volume2 },
]

export function ImageLearningSection() {
    return (
        <section id="image-learning" className="py-24 bg-terracotta">
            <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center">
                <div className="relative">
                    <div className="absolute -top-10 -left-10 w-56 h-56 rounded-full bg-peach blur-3xl opacity-40" />
                    <div className="absolute -bottom-8 -right-6 w-48 h-48 rounded-full bg-yellow-soft blur-3xl opacity-50" />
                    <div className="relative rounded-[36px] border border-beige bg-white p-6 shadow-xl">
                        <div className="relative overflow-hidden rounded-3xl">
                            <img src="/detect1.png" alt="" className="w-full h-[380px] object-cover" />
                        </div>
                        <div className="mt-6 rounded-2xl bg-cream border border-beige p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="size-8 rounded-xl bg-terracotta flex items-center justify-center text-white">AI</div>
                                <div>
                                    <p className="font-bold text-text-primary">AI Vocabulary Detection</p>
                                    <p className="text-xs text-text-muted">3 objects detected</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    {
                                        word: "woman",
                                        ipa: "/ˈwʊm.ən/",
                                        meaning: "An adult female human being.",
                                        example: "The woman is reading a book in the park.",
                                        partOfSpeech: "noun",
                                        imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
                                    },
                                    {
                                        word: "eyeglasses",
                                        ipa: "/ˈaɪˌɡlæs.ɪz/",
                                        meaning: "Lenses set in a frame worn on the nose and ears to correct vision.",
                                        example: "She needs her eyeglasses to read the fine print.",
                                        partOfSpeech: "noun",
                                        imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100&h=100&fit=crop"
                                    },
                                    {
                                        word: "ponytail",
                                        ipa: "/ˈpoʊ.ni.teɪl/",
                                        meaning: "A hairstyle in which hair is pulled back and tied at the back of the head.",
                                        example: "She tied her hair back in a high ponytail.",
                                        partOfSpeech: "noun",
                                        imageUrl: "https://www.cloudninehair.com/cdn/shop/files/Low_pony.png?v=1760514436"
                                    }
                                ].map((word, index) => (
                                    <div key={index} className="rounded-xl border border-beige bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-terracotta/30 hover:shadow-md">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-base font-bold text-text-primary">{word.word}</span>
                                                    <span className="text-xs font-medium text-text-muted italic">{word.ipa}</span>
                                                </div>

                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-semibold text-text-primary">{word.meaning}</p>
                                                    <p className="text-xs text-text-muted italic">&ldquo;{word.example}&rdquo;</p>
                                                </div>

                                                <div className="flex items-center gap-2 pt-2 flex-wrap">
                                                    <div className="h-7 px-3 rounded-lg border border-beige bg-neutral-50 flex items-center text-[10px] font-bold text-text-muted">
                                                        Template: Default
                                                    </div>
                                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-beige/60">
                                                        <img src={word.imageUrl} alt={word.word} className="h-full w-full object-cover" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 shrink-0">
                                                <div className="h-7 px-3 rounded-lg border border-beige bg-neutral-50 flex items-center text-[10px] font-bold text-text-muted w-20 justify-center">
                                                    {word.partOfSpeech}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Title title="Learn Vocabulary Directly From Images" className="mt-6 text-5xl leading-tight text-white" />
                    <p className="mt-6 text-lg text-white leading-9 text-text-muted">
                        Chỉ cần tải lên một bức ảnh, Recalio sẽ sử dụng AI để nhận diện các đồ vật xuất hiện trong ảnh, trích xuất từ vựng và tự động tạo danh sách ghi nhớ cho bạn.
                    </p>
                    <div className="mt-10 space-y-5">
                        {items.map((item) => {
                            const Icon = item.icon
                            return (
                                <div key={item.title} className="flex gap-4 rounded-2xl border border-beige bg-white p-5 transition hover:-translate-y-1 hover:shadow-md">
                                    <div className="size-12 shrink-0 rounded-2xl bg-peach flex items-center justify-center text-terracotta">
                                        <Icon className="size-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-text-primary">{item.title}</h4>
                                        <p className="mt-1 text-text-muted leading-7">{item.desc}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
