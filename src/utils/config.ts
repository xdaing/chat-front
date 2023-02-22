import { getStorageItem } from './storage'

export const getTheme = (): string => {
    const theme: string = getStorageItem('config_theme', () => 'light')
    setTheme(theme)
    return theme
}

export const setTheme = (theme: string) => {
    const html: HTMLHtmlElement = document.querySelector('html')!
    html.classList.remove('light', 'dark')
    html.classList.add(theme)
}