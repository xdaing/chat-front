import type { UserRegister, UserLogin, RequestFunction, LoginSuccess, SearchResult, ApplicationsItem } from '@/types'
import request from './request'

export const register: RequestFunction<UserRegister, string> = data => request.post('user', data)

export const searchUser: RequestFunction<string, SearchResult | null> = email => request.get('user', { params: { email } })

export const login: RequestFunction<UserLogin, LoginSuccess> = data => request.post('user/login', data)

export const getEmailCode: RequestFunction<string, string> = email => request.get('user/code', { params: { email } })

export const applications: RequestFunction<Array<string>, Array<ApplicationsItem>> = applications => request.post('user/applications', { applications })

export const ignoreApply: RequestFunction<string, string> = applyId => request.put('user/apply', { applyId })

export const uploadVisitorImage: RequestFunction<FormData, string> = data => request.post('file/visitor', data)

export const uploadUserImage: RequestFunction<FormData, string> = data => request.post('file/user', data)

export const clearUnread: RequestFunction<string, string> = contact => request.put('user/unread', { contact })

export const contactRemark: RequestFunction = (data) => request.put('user/remark', data)
