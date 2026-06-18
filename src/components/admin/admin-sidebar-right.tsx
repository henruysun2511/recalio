import { User, Calendar } from "lucide-react"

const holidays = [
    { title: "Thanksgiving", price: "$174.99" },
    { title: "Halloween", price: "$326.00" },
    { title: "Holiday", price: "$51.00" },
]

export function AdminSidebarRight() {
    return (
        <aside className="flex h-full min-h-0 w-full flex-col bg-white p-6 overflow-y-auto">
            {/* Profile */}
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-beige">
                    <User className="h-6 w-6 text-terracotta" />
                </div>

                <div>
                    <h3 className="font-semibold text-text-primary">Admin</h3>
                    <p className="text-sm text-neutral-400">Super admin</p>
                </div>
            </div>

            {/* Pending Reviews */}
            <section className="mt-10">
                <h4 className="mb-4 text-xl font-semibold text-text-primary">
                    Pending Reviews
                </h4>

                <div className="space-y-3">
                    {holidays.map((item) => (
                        <div
                            key={item.title}
                            className="flex items-center justify-between rounded-[20px] bg-near-white p-4"
                        >
                            <div>
                                <h5 className="font-medium text-text-primary">
                                    {item.title}
                                </h5>
                                <p className="text-sm text-neutral-400">
                                    {item.price}
                                </p>
                            </div>

                            <button className="rounded-full bg-terracotta px-4 py-2 text-sm text-white transition hover:bg-terracotta-dark">
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quick Stats */}
            <section className="mt-10">
                <h4 className="mb-4 text-xl font-semibold text-text-primary">
                    This Month
                </h4>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-[20px] bg-near-white p-4">
                        <Calendar className="h-5 w-5 text-terracotta" />
                        <div>
                            <p className="text-sm text-neutral-400">New Decks</p>
                            <p className="font-semibold text-text-primary">24</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-[20px] bg-near-white p-4">
                        <Calendar className="h-5 w-5 text-terracotta" />
                        <div>
                            <p className="text-sm text-neutral-400">New Users</p>
                            <p className="font-semibold text-text-primary">128</p>
                        </div>
                    </div>
                </div>
            </section>
        </aside>
    )
}
