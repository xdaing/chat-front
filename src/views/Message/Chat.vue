<script lang="ts">
const navigationGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const userStore = useUserStore()
    const _id: string = to.query._id as string
    if (userStore.isLogin) {
        const contact: Contact | undefined = userStore.contacts.get(_id)
        if (contact !== undefined) {
            contact.unread !== 0 && (contact.unread = 0)
            next()
        } else next({ path: '/message', replace: true })
    } else {
        if (_id === '00000000') {
            const visitorStore = useVisitorStore()
            visitorStore.unread !== 0 && (visitorStore.unread = 0)
            next()
        } else next({ path: '/message', replace: true })
    }
}
export default defineComponent({
    beforeRouteEnter: navigationGuard,
    beforeRouteUpdate: navigationGuard
})
</script>
<script setup lang="ts">
import { ref, onMounted, computed, inject, onBeforeUnmount, defineComponent } from 'vue'
import { useRoute, useRouter, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import { ElScrollbar } from 'element-plus'
import MessageCell from '@/components/message/MessageCell.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { ElMessage } from 'element-plus'
import { useVisitorStore } from '@/stores/visitor'
import { useUserStore } from '@/stores/user'
import { type Contact, type VisitorMessage, type ShallowRefSocket, socketKey, MessageType, VisitorSocketEvent, type PersonalMessage, UserSocketEvent } from '@/types'
import { uploadVisitorImage, uploadUserImage, clearUnread } from '@/api'
import ContentHeader from '@/components/ContentHeader.vue'

const userStore = useUserStore()
const visitorStore = useVisitorStore()
const router = useRouter()
const route = useRoute()

const socket: ShallowRefSocket = inject(socketKey) as ShallowRefSocket
// 滚动条
const scrollbar = ref<InstanceType<typeof ElScrollbar> | null>(null)
// 滚动条内部容器
const scrollbarInner = ref<HTMLDivElement | null>(null)
// 输入
const content = ref<string>('')
const emojis: Array<string> = ['😁', '😂', '😃', '😄', '😅', '😆', '😉', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😁', '😂', '😃', '😄', '😅', '😆', '😉', '😁', '😂', '😃', '😄', '😅', '😆', '😉']

const scrollToBottom = () => {
    scrollbar.value?.setScrollTop(scrollbarInner.value?.clientHeight ?? 0)
}
const chooseImage = async (event: Event) => {
    const input: HTMLInputElement = event.target as HTMLInputElement
    const files: FileList | null = input.files
    if (files == null) return
    const file: File = files[0]
    const { type, size } = file
    if (!['image/jpeg', 'image/jpg'].includes(type)) return ElMessage.warning('请选择jpg/jpeg类型的图片')
    if (size > 2097152) return ElMessage.warning('请选择小于2mb的图片')
    const formData = new FormData()
    formData.append('file', file)
    input.value = ''
    if (userStore.isLogin) {
        const result = await uploadUserImage(formData)
        if (result.statusCode === 400) return
        const _id: string = route.query._id as string
        const personalMessage: Omit<PersonalMessage, '_id'> = {
            from: userStore._id,
            to: _id,
            messageType: MessageType.Personal,
            isImage: true,
            content: result.data,
            time: new Date()
        }
        socket.value.emit(UserSocketEvent.PersonalMessage, personalMessage, (result: PersonalMessage) => {
            const messages: Array<PersonalMessage> = userStore.messages.get(_id)!
            messages.push(result)
        })
    } else {
        const result = await uploadVisitorImage(formData)
        if (result.statusCode === 400) return
        const visitorMessage: Omit<VisitorMessage, '_id'> = {
            from: visitorStore._id,
            name: visitorStore.name,
            content: result.data,
            avatar: visitorStore.avatar,
            time: new Date(),
            messageType: MessageType.Group,
            isImage: true
        }
        socket.value.emit(VisitorSocketEvent.Message, visitorMessage, (result: VisitorMessage) => {
            visitorStore.messages.push(result)
        })
    }
}
const resizeObserver = new ResizeObserver(scrollToBottom)
onMounted(() => {
    resizeObserver.observe(scrollbarInner.value!)
})
onBeforeUnmount(() => {
    resizeObserver.disconnect()
})
const messages = computed<Array<VisitorMessage | PersonalMessage>>(() => {
    const _id: string = route.query._id as string
    return _id === '00000000' ? visitorStore.messages : userStore.messages.get(_id)!
})
const send = () => {
    const input: string = content.value.trim()
    content.value = ''
    if (input === '') return ElMessage.warning('输入不能为空')
    if (userStore.isLogin) {
        const _id: string = route.query._id as string
        const personalMessage: Omit<PersonalMessage, '_id'> = {
            from: userStore._id,
            to: _id,
            isImage: false,
            time: new Date(),
            content: input,
            messageType: MessageType.Personal
        }
        socket.value.emit(UserSocketEvent.PersonalMessage, personalMessage, (result: PersonalMessage) => {
            const messages: Array<PersonalMessage> = userStore.messages.get(_id)!
            messages.push(result)
        })
    } else {
        const visitorMessage: Omit<VisitorMessage, '_id'> = {
            from: visitorStore._id,
            name: visitorStore.name,
            content: input,
            avatar: visitorStore.avatar,
            time: new Date(),
            messageType: MessageType.Group,
            isImage: false
        }
        socket.value.emit(VisitorSocketEvent.Message, visitorMessage, (result: VisitorMessage) => {
            visitorStore.messages.push(result)
        })
    }
}
const name = computed<string>(() => {
    if (userStore.isLogin) {
        const { remark, name } = userStore.contacts.get(route.query._id as string)!
        return remark || name
    } else return `游客频道(${visitorStore.online})`
})
const chooseEmoji = (event: Event) => {
    const emoji: string | null = (event.target as HTMLSpanElement).getAttribute('emoji')
    if (emoji !== null) content.value += emoji
}
const clear = () => {

    const _id: string = route.query._id as string
    if (_id === '00000000') return
    clearUnread(_id)
}
clear()
</script>
<template>
    <div class="chat-container">
        <ContentHeader rightIcon="more" path="/message" :title="name" height="60px"></ContentHeader>
        <el-scrollbar ref="scrollbar" class="main">
            <div ref="scrollbarInner" style="padding:  5px 0;">
                <TransitionGroup name="list">
                    <MessageCell @changeScroll="scrollToBottom" v-for="item in  messages" :key="item._id" :message="item">
                    </MessageCell>
                </TransitionGroup>
            </div>
        </el-scrollbar>
        <div class="footer">
            <div class="icons">
                <el-popover placement="top-start" :width="200" trigger="hover">
                    <template #reference>
                        <SvgIcon name="emoji" size="20px" class="icon"></SvgIcon>
                    </template>
                    <div class="emojis" @click="chooseEmoji">
                        <span class="emoji" v-for="emoji in emojis" :key="emoji" :emoji="emoji">{{ emoji }}</span>
                    </div>
                </el-popover>
                <el-tooltip effect="dark" content="发送图片" placement="top">
                    <div class="choose-picture">
                        <SvgIcon name="picture" size="20px" class="icon"></SvgIcon>
                        <input type="file" title="" class="file" accept=".jpg,.jpeg" @change="chooseImage">
                    </div>
                </el-tooltip>
            </div>
            <textarea v-model="content" class="text" maxlength="60" @keydown.enter.ctrl="send" />
            <el-tooltip effect="dark" content="Ctrl+Enter发送" placement="bottom">
                <el-button type="primary" style="float: right;" @click="send">发送</el-button>
            </el-tooltip>
        </div>
    </div>
</template>
<style scoped lang="scss">
.list-move,
.list-enter-active {
    transition: opacity 1s ease;
}

.list-enter-from {
    opacity: 0;
}

.chat-container {
    width: $content-width;
    height: $box-height;

    .main {
        height: 410px;
        box-sizing: border-box;
        border-top: 1px solid;
        border-bottom: 1px solid;
        @include theme('border-color', 'border_color');
    }

    .footer {
        height: 150px;
        padding: 10px 30px;
        box-sizing: border-box;

        .icons {
            display: flex;

            .choose-picture {
                position: relative;
                margin-left: 10px;

                .file {
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    left: 0;
                    top: 0;
                    opacity: 0;
                }
            }
        }

        .text {
            width: 100%;
            height: 60px;
            box-sizing: border-box;
            overflow-y: hidden;
            font-size: 14px;
            margin: 5px 0;
            padding: 0 5px;
            resize: none;
            // border: none;
            background-color: transparent;
        }
    }
}

.emoji {
    cursor: pointer;
    user-select: none;

    &:hover {
        background-color: rgb(175, 200, 200);
    }
}
</style>