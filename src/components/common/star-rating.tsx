"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
    value: number
    onChange?: (rating: number) => void
    size?: number
    disabled?: boolean
}

export function StarRating({ value, onChange, size = 16, disabled }: StarRatingProps) {
    const [hover, setHover] = useState(0)

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hover || value)
                return (
                    <button
                        key={star}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange?.(star)}
                        onMouseEnter={() => !disabled && setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className={`${disabled ? "cursor-default" : "cursor-pointer"} transition-colors`}
                    >
                        <Star
                            size={size}
                            className={`${filled ? "fill-gold text-gold" : "text-beige"} transition-colors`}
                        />
                    </button>
                )
            })}
        </div>
    )
}
