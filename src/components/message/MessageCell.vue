<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useVisitorStore } from '@/stores/visitor'
import { MessageType, type VisitorMessage, type PersonalMessage } from '@/types'
const props = defineProps<{ message: VisitorMessage | PersonalMessage }>()
const userStore = useUserStore()
const visitorStore = useVisitorStore()
const content: string = props.message.isImage ? import.meta.env.VITE_BASE_WEB + props.message.content : props.message.content
const avatar = computed<string>(() => {
    return (props.message as VisitorMessage).avatar
})
</script>
<template>
    <div class="message-cell-container">
        <div class="system" v-if="message.messageType === MessageType.System">{{ message.content }}</div>
        <div class="my" v-else-if="message.from === userStore._id || message.from === visitorStore._id">
            <el-avatar shape="square" :size="40" :src="avatar" />
            <el-image class="image" v-if="message.isImage" :src="content" hide-on-click-modal
                :preview-src-list="[content]" />
            <p v-else class="message">{{ message.content }}</p>
        </div>
        <template v-else>
            <div class="friend" v-if="message.messageType === MessageType.Personal">
                <el-avatar shape="square" :size="40" src="public/visitor/avatar/6.png" />
                <el-image class="image" v-if="message.isImage" :src="content" hide-on-click-modal
                    :preview-src-list="[content]" />
                <p v-else class="message">{{ message.content }}</p>
            </div>
            <div class="group" v-else-if="message.messageType === MessageType.Group">
                <el-avatar shape="square" :size="40" :src="avatar" />
                <div>
                    <p class="name">{{ (message as VisitorMessage).name }}</p>
                    <el-image class="image" v-if="message.isImage" :src="content" hide-on-click-modal
                        :preview-src-list="[content]" />
                    <p v-else class="message">{{ message.content }}</p>
                </div>
            </div>
        </template>
</div>
</template>
<style scoped lang="scss">
.message-cell-container {
    margin: 5px 15px;

    .message {
        font-size: 14px;
        max-width: 180px;
        background-color: rgb(149, 168, 202);
        display: inline-block;
        padding: 8px;
        word-wrap: break-word;
        word-break: break-all;
        border-radius: 4px;
        margin: 0 10px;
    }

    .image {
        max-width: 200px;
        margin: 0 10px;
        border-radius: 4px;

        :deep(.el-image-viewer__mask) {
            opacity: .9;
        }
    }

    .friend {
        display: flex;
    }

    .my {
        display: flex;
        flex-direction: row-reverse;

        .message {
            background-color: rgb(204, 215, 224);
        }
    }

    .group {
        display: flex;

        .name {
            margin: 0 10px 2px 10px;
        }
    }

    .system {
        line-height: 30px;
        font-size: 12px;
        color: gray;
        text-align: center;
        user-select: none;
    }
}
</style>
