<script setup lang="ts">
import { formatTime } from '@/utils/time'
interface Props {
    avatar: string
    name: string
    time: Date | string
    unread: number
    content: string
    _id: string
}
defineProps<Props>()
</script>
<template>
    <div class="message-item-container">
        <el-avatar :size="50" class="avatar" :src="avatar" shape="square">
        </el-avatar>
        <div class="content">
            <div class="top">
                <p class="name">{{ name }}</p>
                <p class="time">{{ formatTime(time) }}</p>
            </div>
            <div class="bottom">
                <p class="text">{{ content }}</p>
                <el-badge :value="unread" :hidden="unread === 0">
                </el-badge>
            </div>
        </div>
        <div class="modal" :_id="_id"></div>
    </div>
</template>
<style scoped lang="scss">
.message-item-container {
    height: 75px;
    @include item;

    .content {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        width: ($stage-list-content-width ) - (80px);
        height: 50px;
        padding-left: $stage-list-item-avatar-space;
        justify-content: space-between;

        .top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            .time {
                font-size: 13px;
                color: rgb(72, 73, 73);
            }
        }

        .bottom {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;

            .text {
                font-size: 14px;
                max-width: 140px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
    }

    .modal {
        width: $stage-list-content-width;
        height: 75px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: transparent;
    }
}
</style>
