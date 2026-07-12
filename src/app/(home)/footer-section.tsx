export function FooterSection() {
    return (
        <footer className="border-t border-beige bg-white">
            <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-5 gap-12">

                {/* BRAND COLUMN */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-terracotta flex items-center justify-center text-white font-bold">R</div>
                        <span className="text-lg font-bold">Recalio</span>
                    </div>
                    <p className="text-text-muted text-sm max-w-xs leading-relaxed">
                        AI-powered flashcards and community-driven learning designed to help you remember everything.
                    </p>
                </div>

                {/* LINKS COLUMNS */}
                {[
                    { title: "Product", links: ["Flashcards", "Marketplace", "Community", "AI Workspace"] },
                    { title: "Resources", links: ["Pricing", "API", "Blog", "Support"] },
                    { title: "Company", links: ["About", "GitHub", "Privacy", "Terms"] },
                ].map((section) => (
                    <div key={section.title}>
                        <h4 className="font-bold text-sm mb-6">{section.title}</h4>
                        <ul className="space-y-4">
                            {section.links.map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-text-muted hover:text-terracotta transition-colors duration-200">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* BOTTOM BAR */}
            <div className="max-w-7xl mx-auto px-8 py-8 border-t border-beige flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-muted">
                <p>© 2026 Recalio. All rights reserved.</p>
                <div className="flex gap-6">
                    Made by Nhat Huy
                </div>
            </div>
        </footer>
    );
}
