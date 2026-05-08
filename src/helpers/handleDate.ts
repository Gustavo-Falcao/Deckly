export function getCurrentDate(): string {
    const data: Date = new Date()

    return data.getDate() + "/" + data.getMonth() + "/" + data.getFullYear()
}