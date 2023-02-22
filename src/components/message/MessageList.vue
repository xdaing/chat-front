<script setup lang="ts">
import { useRouter } from 'vue-router'
import SvgIcon from '../SvgIcon.vue'
import MessageItem from './MessageItem.vue'
import List from '../List.vue'
import { useUserStore } from '@/stores/user'
import { useVisitorStore } from '@/stores/visitor'
import { computed } from 'vue'
import type { MessagesItem } from '@/types'
const userStore = useUserStore()
const visitorStore = useVisitorStore()

const router = useRouter()
// 右键菜单
const menu = (event: Event) => {
    const target: HTMLDivElement = event.target as HTMLDivElement
    const _id: string | null = target.getAttribute('_id')
    if (_id !== null) {

    }
}
// 跳转聊天界面
const chat = (event: Event) => {
    const _id: string | null = (event.target as HTMLDivElement).getAttribute('_id')
    if (_id !== null) router.replace({ name: 'chat', query: { _id } })
}
const messagesList = computed<Array<MessagesItem>>(() => userStore.isLogin ? userStore.messagesList : visitorStore.messagesList)
</script>
<template>
    <List>
        <template #title>聊天</template>
        <template #icon>
            <SvgIcon name="add" size="18px" class="create-group-icon"></SvgIcon>
        </template>
        <el-scrollbar noresize @contextmenu.prevent.stop="menu" @click="chat">
            <MessageItem v-for="item in messagesList" :key="item._id" :_id="item._id" :name="item.name"
                :avatar="item.avatar" :content="item.content" :time="item.time" :unread="item.unread">
            </MessageItem>
        </el-scrollbar>
    </List>
</template>
<style scoped lang="scss">
.create-group-icon {
    position: absolute;
    right: 10px;
    cursor: pointer;
}
</style>
