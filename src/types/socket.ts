import type { InjectionKey, ShallowRef } from 'vue'
import type { Socket } from 'socket.io-client'

export type ShallowRefSocket = ShallowRef<Socket>
export const socketKey = Symbol() as InjectionKey<ShallowRefSocket>
export const switchToVisitorSocketKey = Symbol() as InjectionKey<{ (): void }>
export const switchToUserSocketKey = Symbol() as InjectionKey<{ (): void }>

// socket 命名空间
export enum SocketNameSpace {
    User = '/user',
    Visitor = '/visitor'
}

// 游客 socket 事件
export enum VisitorSocketEvent {
    Init = 'visitor-init', // 游客初始化链接
    Message = 'visitor-message', // 游客消息
    Online = 'visitor-online'
}
// 用户 socket 事件
export enum UserSocketEvent {
    Init = 'user-init', // 用户初始化链接
    PersonalMessage = 'user-personal-message', // 私聊消息
    GroupMessage = 'user-group-message', // 群聊消息
    ApplyContact = 'user-apply-contact', // 申请添加新联系人
    AddContact = 'user-add-contact', // 添加新联系人
    Refresh = 'user-refresh-token'
}

export interface WsErrorResponse {
    statusCode: 400 | 500 | 600
    message?: string
}