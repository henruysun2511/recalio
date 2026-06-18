import { PanelLeft, PanelLeftClose } from "lucide-react"
import { useSidebar } from "../ui/sidebar"

export function SidebarToggle() {
    const { state, toggleSidebar } = useSidebar()
    const collapsed = state === "collapsed"

    return (
        <button
            onClick={toggleSidebar}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-beige hover:text-text-primary"
        >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
    )
}