import { nanoid } from 'nanoid'
import { getStorageItem } from './storage'

export const getVisitorId = (): string => getStorageItem('visitor_id', nanoid)
export const getVisitorAvatar = (): string => {
    return getStorageItem('visitor_avatar', (): string => {
        const getRandomNumber = (min: number, max: number): number => {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        return `public/visitor/avatar/${getRandomNumber(0, 9)}.png`
    })
}