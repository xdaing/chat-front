import { defineStore } from 'pinia'

export const useVisitorStore = defineStore('visitor', {
    state: () => ({
        visitorId: '',
        avatar: ''
    })
})
