import { Button } from "@/components/ui/button"
import {
    Folder,
    MoreHorizontal,
    Layers,
} from "lucide-react"

export function DeckCard() {
    return (
        <div
            className="
        group
        relative

        overflow-hidden

        rounded-[28px]

        border
        border-beige

        bg-white

        p-6

        transition-all

        hover:-translate-y-1
        hover:border-terracotta/30
      "
        >
            {/* Folder Icon */}
            <div
                className="
          mb-5

          flex
          h-16
          w-16

          items-center
          justify-center

          rounded-[20px]

          bg-peach
        "
            >
                <Folder
                    className="size-8 text-terracotta"
                    fill="currentColor"
                />
            </div>

            {/* Menu */}
            <button
                className="
          absolute
          right-4
          top-4

          opacity-0

          transition-opacity

          group-hover:opacity-100
        "
            >
                <MoreHorizontal className="size-5 text-text-muted" />
            </button>

            {/* Name */}
            <h3
                className="
          mb-2

          line-clamp-1

          text-lg
          font-bold

          text-text-primary
        "
            >
                English Vocabulary
            </h3>

            {/* Description */}
            <p
                className="
          mb-4

          line-clamp-2

          text-sm

          text-text-muted
        "
            >
                Common English words and phrases for
                daily communication.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Layers className="size-4 text-terracotta" />

                    <span className="text-sm font-medium text-text-muted">
                        120 cards
                    </span>
                </div>

                <span className="text-xs text-text-muted">
                    2 days ago
                </span>
            </div>
        </div>
    )
}

export default function DeckPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-text-primary">
                        My Decks
                    </h1>

                    <p className="mt-1 text-text-muted">
                        Organize your study materials
                    </p>
                </div>

                <Button>
                    Create Deck
                </Button>
            </div>

            {/* Grid */}
            <div
                className="
          grid
          gap-6

          sm:grid-cols-2
          xl:grid-cols-3
          2xl:grid-cols-4
        "
            >
                <DeckCard />
                <DeckCard />
                <DeckCard />
                <DeckCard />
                <DeckCard />
            </div>
        </div>
    )
}