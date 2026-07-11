export function timeAgo(dateStr: string, locale: "vi" | "en" = "vi") {
    const diff = Date.now() - new Date(dateStr).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(hours / 24)

    if (locale === "en") {
        if (minutes < 1) return "Just now"
        if (minutes < 60) return `${minutes} min ago`
        if (hours < 24) return `${hours}h ago`
        if (days < 7) return `${days}d ago`
        return new Date(dateStr).toLocaleDateString("en-US")
    }

    if (minutes < 1) return "Vừa xong"
    if (minutes < 60) return `${minutes} phút trước`
    if (hours < 24) return `${hours} giờ trước`
    if (days < 7) return `${days} ngày trước`
    return new Date(dateStr).toLocaleDateString("vi-VN")
}
