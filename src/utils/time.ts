export const formatTime = (time: Date | string | number): string => {
    if (!time) return ''
    const current: Date = new Date()
    const date: Date = new Date(time)
    const currentYear: number = current.getFullYear()
    const currentMonth: number = current.getMonth() + 1
    const currentDay: number = current.getDate()
    const year: number = date.getFullYear()
    const month: number = date.getMonth() + 1
    const day: number = date.getDate()
    const zero = (num: number): string => (num < 10 ? '0' : '') + num
    const hour = date.getHours()
    const minute = date.getMinutes()
    if (year === currentYear && month === currentMonth && day === currentDay) return `今天${zero(hour)}:${zero(minute)}`
    else if (year === currentYear && month === currentMonth && currentDay - day === 1) return `昨天${zero(hour)}:${zero(minute)}`
    else if (year === currentYear) return `${zero(month)}/${zero(day)}`
    else return `${year}/${month}/${day}`
}