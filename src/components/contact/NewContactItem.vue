<script setup lang="ts">
import { ignoreApply } from '@/api'
import { useUserStore } from '@/stores/user'
import { socketKey, UserSocketEvent, type ShallowRefSocket } from '@/types'
import { inject } from 'vue'
interface Props {
    name: string
    avatar: string
    _id: string
    signature: string
}
const userStore = useUserStore()
const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'remove', _id: string): void }>()
const socket = inject(socketKey) as ShallowRefSocket

const ignore = async () => {
    await ignoreApply(props._id)
    userStore.applications.delete(props._id)
    emit('remove', props._id)
}
const agree = () => {
    socket.value.emit(UserSocketEvent.AddContact, props._id, (data: any) => {
        userStore.addContact(data)
    })
    userStore.applications.delete(props._id)
    emit('remove', props._id)
}
</script>
<template>
    <div class="new-contact-item-container">
        <div class="info">
            <el-avatar shape="square" :size="50" :src="avatar" />
            <div class="content">
                <p class="name">{{ name }}</p>
                <p class="signature">{{ signature }}</p>
            </div>
        </div>
        <div class="operation">
            <el-button type="primary" plain @click="ignore">忽略</el-button>
            <el-button type="primary" @click="agree">同意</el-button>
        </div>
    </div>
</template>
<style scoped lang="scss">
.new-contact-item-container {
    box-sizing: border-box;
    padding: 0 30px;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    @include line(($content-width) - (30px));

    .info {
        display: flex;

        .content {
            padding-left: 12px;
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
}
</style>
