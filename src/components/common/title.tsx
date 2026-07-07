interface TitleProps {
    title: string
    description?: string
}

export function Title({ title, description }: TitleProps) {
    return (
        <div>
            <h1 className="text-3xl font-black text-text-primary tracking-tighter">{title}</h1>
            {description && <p className="mt-1 text-text-muted">{description}</p>}
        </div>
    )
}
