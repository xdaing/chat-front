import { defineStore } from 'pinia'
import { getVisitorId, getVisitorAvatar } from '@/utils/visitor'
import type { VisitorMessage, MessagesItem } from '@/types'
import { ElMessage } from 'element-plus'

export const useVisitorStore = defineStore('visitor', {
    state: () => ({
        _id: getVisitorId(),
        avatar: getVisitorAvatar(),
        messages: new Array<VisitorMessage>(),
        unread: 0,
        received: 0,
        online: 0,
    }),
    getters: {
        name(): string {
            return `游客${this._id.slice(0, 4)}`
        },
        messagesList(): Array<MessagesItem> {
            const last: VisitorMessage | undefined = this.messages[this.messages.length - 1]
            const content: string = last ? `${last.from === this._id ? '我' : last.name}：${last.isImage ? '[图片]' : last.content}` : '暂无消息'
            return [{
                _id: '00000000',
                name: '游客频道',
                time: last?.time ?? '',
                avatar: '/public/visitor/group/default.png',
                unread: this.unread,
                content
            }]
        }
    },
    actions: {
        init(messages: Array<VisitorMessage>) {
            this.messages = messages.reverse()
        },
        changeOnline(online: number) {
            this.online = online
        },
        receiveVisitorMessage(visitorMessage: VisitorMessage, _id: string | undefined) {
            this.messages.push(visitorMessage)
            this.received++
            if (_id !== '00000000') {
                this.unread++
                ElMessage.info('收到了一条消息')
            }
        }
    }
})
