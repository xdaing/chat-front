import { inject, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVisitorStore } from '@/stores/visitor'
import { useUserStore } from '@/stores/user'
import type { ShallowRefSocket, VisitorMessage, PersonalMessage, WsErrorResponse } from '@/types'
import { socketKey, UserSocketEvent, VisitorSocketEvent, switchToVisitorSocketKey, switchToUserSocketKey, } from '@/types'
import { ElMessage } from 'element-plus'

export const useSocketHook = () => {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    const visitorStore = useVisitorStore()
    const socket = inject(socketKey) as ShallowRefSocket
    const switchToVisitorSocket = inject(switchToVisitorSocketKey) as () => void
    const switchToUserSocket = inject(switchToUserSocketKey) as () => void
    watch(() => userStore.isLogin, newValue => newValue ? switchToUserSocket() : switchToVisitorSocket())
    watch(socket, () => {
        router.replace('/message')
        // 监听错误
        socket.value.on('error', (response: WsErrorResponse) => {
            const statusCode: number = response.statusCode
            switch (statusCode) {
                case 400:
                    ElMessage.error('出错了')
                    break
                case 500:
                    userStore.logout()
                    switchToVisitorSocket()
                    ElMessage.error('登录出错')
                    break
                case 600:
                    userStore.isLogin = false
                    switchToVisitorSocket()
                    ElMessage.error('重复登录')
                    break
            }
        })
        if (userStore.isLogin === true) {
            socket.value.once(UserSocketEvent.Init, userStore.init)
            socket.value.on(UserSocketEvent.PersonalMessage, (personalMessage: PersonalMessage) => {
                const _id = route.query._id as string | undefined
                userStore.receivePersonalMessage(personalMessage, _id)
            })
            socket.value.on(UserSocketEvent.ApplyContact, userStore.receiveApply)
            socket.value.on(UserSocketEvent.AddContact, userStore.addContact)
            socket.value.on(UserSocketEvent.Refresh, userStore.refreshToken)
        } else {
            socket.value.once(VisitorSocketEvent.Init, visitorStore.init)
            socket.value.on(VisitorSocketEvent.Online, visitorStore.changeOnline)
            socket.value.on(VisitorSocketEvent.Message, (visitorMessage: VisitorMessage) => {
                const _id = route.query._id as string | undefined
                visitorStore.receiveVisitorMessage(visitorMessage, _id)
            })
        }
    }, { immediate: true })
}