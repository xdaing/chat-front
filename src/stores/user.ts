import { defineStore } from 'pinia'
import { getEmailCode, login, register, searchUser } from '@/api'
import type { UserLogin, UserRegister, DividedContact, SearchResult, User, PersonalMessage, Contact, MessagesItem, ContactInfo } from '@/types'
import cnchar from 'cnchar'
import { ElMessage } from 'element-plus'
import { useVisitorStore } from './visitor'

export const useUserStore = defineStore('user', {
    state: () => ({
        isLogin: false,
        email: '',
        _id: '',
        avatar: '',
        name: '',
        searches: new Map<string, SearchResult>(),
        applications: new Set<string>(),
        messages: new Map<string, Array<PersonalMessage>>(), //存放所有的消息
        contacts: new Map<string, Contact>() // 存放所有的联系人信息
    }),
    getters: {
        dividedContacts() { // 按姓氏分组后的联系人
            const spells: Array<string> = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
            const result = new Map<string, Array<DividedContact>>()
            for (let i: number = 0, length: number = spells.length; i < length; i++) {
                result.set(spells[i], new Array<DividedContact>())
            }
            result.set('其他', new Array<DividedContact>())
            for (const [_, item] of this.contacts) {
                const { avatar, name, remark, _id } = item
                const contactName: string = remark || name
                const spellFirst: string = (cnchar.spell(contactName) as string).charAt(0).toUpperCase()
                const dividedContact: DividedContact = { avatar, name: contactName, _id }
                if (spells.includes(spellFirst)) (result.get(spellFirst)!).push(dividedContact)
                else (result.get('其他')!).push(dividedContact)
            }
            return result
        },
        messagesList() { // 按时间排序的消息列表
            const messagesList = new Array<MessagesItem>()
            for (const [_id, contact] of this.contacts) {
                if (!contact.onList) continue
                const messages: Array<PersonalMessage> = this.messages.get(_id)!
                const message: PersonalMessage | undefined = messages[messages.length - 1]
                const { avatar, name, unread, remark } = contact
                const content: string = message ? message.isImage ? '[图片]' : message.content : '暂无消息'
                messagesList.push({ _id, avatar, unread, content, time: message?.time || new Date(), name: remark || name })
            }
            messagesList.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            return messagesList
        },
        unread() {
            let count: number = 0
            for (const [_, item] of this.contacts) {
                count += item.unread
            }
            return count
        }
    },
    actions: {
        async login(userLogin: UserLogin) {
            const result = await login(userLogin)
            if (result.statusCode == 400) return
            ElMessage.success('登录成功')
            this.isLogin = true
            const { access_token, refresh_token } = result.data
            localStorage.setItem('access_token', access_token)
            localStorage.setItem('refresh_token', refresh_token)
            useVisitorStore().$reset()
        },
        async register(userRegister: UserRegister) {
            const result = await register(userRegister)
            if (result.statusCode === 400) return false
            ElMessage.success('注册成功')
            this.email = result.data
            return true
        },
        async getEmailCode(email: string) {
            const result = await getEmailCode(email)
            if (result.statusCode === 400) return
            ElMessage.success(result.data)
        },
        async searchUser(email: string) {
            this.searches.clear()
            const result = await searchUser(email)
            if (result.statusCode === 400) return
            if (result.data === null) return ElMessage.error('账号不存在')
            this.searches.set(result.data._id, result.data)
            ElMessage.success('搜索成功')
        },
        logout() {
            this.$reset()
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        },
        init(user: User) {
            const { _id, applications, name, email, avatar, contacts } = user
            this._id = _id
            this.avatar = avatar
            this.name = name
            this.email = email
            this.applications = new Set(applications)
            for (let i: number = 0, length: number = contacts.length; i < length; i++) {
                const { contact, messages, unread, remark, onList } = contacts[i]
                this.messages.set(contact._id, messages.reverse())
                this.contacts.set(contact._id, { ...contact, remark, unread, received: 0, onList })
            }
        },
        receivePersonalMessage(personalMessage: PersonalMessage, _id: string | undefined) {
            const { from } = personalMessage
            const contact: Contact = this.contacts.get(from)!
            const messages: Array<PersonalMessage> = this.messages.get(from)!
            messages.push(personalMessage)
            contact.received++
            if (_id !== from) {
                contact.unread++
                ElMessage.info(`${contact.remark || contact.name}发来一条消息`)
            }
        },
        receiveApply(from: string) {
            this.applications.add(from)
            ElMessage.info('收到一条好友请求')
        },
        addContact(contactInfo: ContactInfo) {
            const { contact, messages, unread, remark, onList } = contactInfo
            this.messages.set(contact._id, messages)
            this.contacts.set(contact._id, { ...contact, remark, unread, received: 0, onList })
            ElMessage.success('添加好友成功')
        },
        refreshToken(token: string) {
            localStorage.setItem('access_token', token)
        }
    }
})
