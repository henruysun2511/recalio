export const pastelColors = [
    "bg-peach",
    "bg-yellow-soft",
    "bg-blue-soft",
    "bg-green-soft",
    "bg-purple-soft",
    "bg-pink-soft",
];

export function getColor(id: string) {
    let hash = 0
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    return pastelColors[Math.abs(hash) % pastelColors.length]
}
