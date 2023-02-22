export const getStorageItem = (key: string, callback: () => string): string => {
    const item: string | null = localStorage.getItem(key)
    if (item !== null) return item
    else {
        const newItem: string = callback()
        localStorage.setItem(key, newItem)
        return newItem
    }
}