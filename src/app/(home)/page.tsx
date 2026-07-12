import type { Metadata } from "next"
import { NavbarSection } from "./navbar-section"
import { HeroSection } from "./hero-section"
import { FeaturesSection } from "./features-section"
import { GamificationSection } from "./gamification-section"
import { WorkflowSection } from "./workflow-section"
import { CommunityPostsSection } from "./community-posts-section"
import { AlgorithmSection } from "./algorithm-section"
import { ImageLearningSection } from "./image-learning-section"
import { AiTextSection } from "./ai-text-section"
import { TestimonialsSection } from "./testimonials-section"
import { CtaSection } from "./cta-section"
import { FooterSection } from "./footer-section"
import { SITE } from "@/constants/site"

export const metadata: Metadata = {
    title: SITE.title,
    description: SITE.description,
    openGraph: {
        title: SITE.title,
        description: SITE.description,
    },
}

export default function HomePage() {
    return (
        <main className="min-h-screen bg-peach-light text-[#1A1A1A] p-4">
            <div className="mx-auto max-w-7xl rounded-[32px] bg-cream overflow-hidden">
                <NavbarSection />
                <HeroSection />
                <FeaturesSection />
                <GamificationSection />
                <WorkflowSection />
                <CommunityPostsSection />
                <AlgorithmSection />
                <ImageLearningSection />
                <AiTextSection />
                <TestimonialsSection />
                <CtaSection />
                <FooterSection />
            </div>
        </main>
    );
}
