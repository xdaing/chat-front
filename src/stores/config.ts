import { defineStore } from 'pinia'
import { getTheme } from '@/utils/config'


export const useConfigStore = defineStore('config', {
    state: () => ({
        theme: getTheme(),
    }),
    actions: {
        setTheme(theme: string) {
            localStorage.setItem('config_theme', theme)
            this.theme = theme
        }
    }
})
