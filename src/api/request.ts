import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { AxiosError } from 'axios'
import type { ErrorResponse, } from '@/types'
import { useUserStore } from '@/stores/user'

const request = axios.create({
    baseURL: import.meta.env.VITE_BASE_WEB
})
let isRefreshing: boolean = false
let retryRequests: Array<() => void> = []

request.interceptors.request.use(config => {
    config.headers.token = localStorage.getItem('access_token') ?? ''
    return config
})

// 刷新 token
const refreshToken = () => {
    const refresh_token: string | null = localStorage.getItem('refresh_token')
    if (refresh_token === null) return Promise.reject()
    return axios.get(
        `${import.meta.env.VITE_BASE_WEB}/user/token`,
        { headers: { token: refresh_token } }
    )
}
request.interceptors.response.use(response => {
    if (response.data.statusCode === 401) {
        if (isRefreshing === false) {
            isRefreshing = true
            const userStore = useUserStore()
            return refreshToken().then(response => {
                if (response.data.statusCode === 401) throw new Error()
                const token: string = response.data.data
                console.log('刷新token结束');
                localStorage.setItem('access_token', token)
                for (let i: number = 0, length: number = retryRequests.length; i < length; i++) {
                    retryRequests[i]()
                }
                retryRequests = []
                isRefreshing = false
                return request(response.config)
            }).catch(() => {
                retryRequests = []
                isRefreshing = false
                userStore.logout()
                ElMessage.error('出错了')
            })
        } else return new Promise(resolve => retryRequests.push(() => resolve(request(response.config))))
    } else return response.data
}, (error: AxiosError<ErrorResponse>) => {
    const code: number | undefined = error.response?.status
    let message: string = ''
    switch (code) {
        case 401:
            message = '登录后再试吧'
            break
        case 413:
            message = '文件过大'
            break
        case 415:
            message = '文件类型错误'
            break
        case 429:
            message = '请求太多了稍后再试吧'
            break
        default:
            message = error.response?.data.message ?? '出错了'
            break
    }
    ElMessage.error(message)
    return { statusCode: 400 }
})

export default request

