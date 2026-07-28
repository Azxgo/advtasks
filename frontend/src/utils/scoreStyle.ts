export function getScoreStyle(score: number) {
    if (score === 10) {
        return "bg-yellow-500"
    }
    if (score >= 8) {
        return "bg-green-500"
    }
    if (score >= 6) {
        return "bg-blue-500"
    }
    if (score >= 4) {
        return "bg-orange-500"
    }
    return "bg-red-500"
}