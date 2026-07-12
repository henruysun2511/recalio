export const SITE = {
    name: "Recalio",
    title: "Recalio — AI Powered Flashcard Learning Platform",
    description:
        "Recalio is an AI-powered spaced repetition flashcard platform. Learn languages, vocabulary, and more with smart scheduling, image occlusion, and cloze deletion.",
    url: "https://recalio.app",
    locale: "vi-VN",
    author: "Recalio Team",
    keywords: [
        "flashcard",
        "spaced repetition",
        "language learning",
        "AI learning",
        "vocabulary",
        "study tool",
        "anki alternative",
        "image occlusion",
        "cloze deletion",
    ],
} as const

export const SITE_OG = {
    type: "website" as const,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
    images: [
        {
            url: `${SITE.url}/og.png`,
            width: 1200,
            height: 630,
            alt: SITE.name,
        },
    ],
}
