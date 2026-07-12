interface TitleProps {
    title: string
    description?: string
    className?: string
}

export function Title({ title, description, className }: TitleProps) {
    return (
        <div>
            <h1 className={`font-black text-text-primary tracking-tighter ${className || 'text-3xl'}`}>{title}</h1>
            {description && <p className="mt-1 text-text-muted">{description}</p>}
        </div>
    )
}
