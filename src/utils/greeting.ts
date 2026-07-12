export function getGreeting(hour: number) {
    if (hour >= 5 && hour < 12) {
        return "Buổi sáng tốt lành ☀️"
    }
    if (hour >= 12 && hour < 14) {
        return "Buổi trưa vui vẻ 🌤️"
    }
    if (hour >= 14 && hour < 18) {
        return "Buổi chiều tốt lành 🌅"
    }
    if (hour >= 18 && hour < 23) {
        return "Buổi tối tốt lành 🌙"
    }
    return "Khuya rồi đó 🦉 — Học xong đi ngủ nhé"
}
