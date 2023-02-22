// 消息类型
export enum MessageType {
    Group = 'group',
    Personal = 'personal',
    System = 'system',
    Contact = 'contact'
}

interface BaseMessage {
    _id: string
    from: string
    messageType: MessageType
    time: Date
    content: string
    isImage: boolean
}

// 游客消息
export interface VisitorMessage extends BaseMessage {
    name: string
    avatar: string
}

// 私聊消息
export interface PersonalMessage extends BaseMessage {
    to: string
}

// 消息列表信息项目
export type MessagesItem = Omit<VisitorMessage, 'isImage' | 'messageType' | 'from'> & { unread: number }

