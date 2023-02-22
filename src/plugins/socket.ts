import type { Plugin } from 'vue'
import { shallowRef } from 'vue'
import { Manager, Socket } from 'socket.io-client'
import { socketKey, SocketNameSpace, switchToUserSocketKey, switchToVisitorSocketKey } from '@/types'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const plugin: Plugin = {
    install: app => {
        const socket = shallowRef<Socket | null>(null)
        const manager: Manager = new Manager(import.meta.env.VITE_BASE_WS, { transports: ['websocket'] })
        const userStore = useUserStore()
        // 获取本地 access_token
        const access_token: string | null = localStorage.getItem('access_token')
        const refresh_token: string | null = localStorage.getItem('refresh_token')
        // 初始化 socket，有 token 为登录状态，验证 token 后链接用户频道，否则链接游客频道
        if (access_token === null || refresh_token === null) socket.value = manager.socket(SocketNameSpace.Visitor)
        else {
            socket.value = manager.socket(SocketNameSpace.User, { auth: { access_token, refresh_token } })
            userStore.isLogin = true
        }
        // 切换 socket 链接
        // visitor -> user
        const switchToUserSocket = () => {
            socket.value?.disconnect()
            const access_token: string | null = localStorage.getItem('access_token')
            const refresh_token: string | null = localStorage.getItem('refresh_token')
            if (access_token === null || refresh_token === null) return ElMessage.error('请先登录')
            socket.value = manager.socket(SocketNameSpace.User, { auth: { access_token, refresh_token } })
            socket.value.connect()
        }
        // user -> visitor
        const switchToVisitorSocket = () => {
            socket.value?.disconnect()
            socket.value = manager.socket(SocketNameSpace.Visitor)
            socket.value.connect()
        }
        app.provide(socketKey, socket)
        app.provide(switchToUserSocketKey, switchToUserSocket)
        app.provide(switchToVisitorSocketKey, switchToVisitorSocket)
    }
}
export default plugin