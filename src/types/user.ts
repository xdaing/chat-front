import type { PersonalMessage } from './message'

// 用户登录
export interface UserLogin {
    email: string
    password: string
}
export type UserLoginForm = UserLogin

export interface LoginSuccess {
    access_token: string
    refresh_token: string
}

// 用户注册
export interface UserRegister extends UserLogin {
    code: string
}
export interface UserRegisterForm extends UserRegister {
    repeat: string
}

// 按姓氏分组后的联系人
export interface DividedContact {
    _id: string
    name: string
    avatar: string
}

// 登陆后返回的用户信息
export interface User {
    _id: string
    email: string
    name: string
    signature: string
    avatar: string
    contacts: Array<ContactInfo>
    applications: Array<string>
}

type UserOmit = Omit<User, 'contacts' | 'applications'>

// 登录后返回的联系人信息
export interface ContactInfo {
    contact: UserOmit
    messages: Array<PersonalMessage>
    remark: string
    unread: number
    onList: boolean
}

export interface Contact extends UserOmit {
    received: number
    remark: string
    unread: number
    onList: boolean
}

export type SearchResult = UserOmit

export type ApplicationsItem = Omit<UserOmit, 'email'>
