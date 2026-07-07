import { ReactNode } from "react"

interface PageHeaderProps {
    title: string
    description?: string
    action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black text-text-primary tracking-tighter">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1 text-text-muted">{description}</p>
                )}
            </div>
            {action}
        </div>
    )
}
