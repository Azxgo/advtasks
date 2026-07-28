export function capitalize(text: string): string {
    return text
        .replace(/-/g, " ") 
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase())
}