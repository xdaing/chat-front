<script setup lang="ts">
import { computed, inject, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import ContentHeader from '@/components/ContentHeader.vue'
import { socketKey, UserSocketEvent, type SearchResult, type ShallowRefSocket } from '@/types'
import { ElMessage } from 'element-plus'

const route = useRoute()
const userStore = useUserStore()
const info = computed<SearchResult>(() => userStore.searches.get(route.query._id as string)!)

const socket = inject(socketKey) as ShallowRefSocket
const add = () => {
    // socket.value.emit(UserSocketEvent.)
    socket.value.emit(UserSocketEvent.ApplyContact, info.value._id, () => ElMessage.success('好友请求已发送'))

}
onBeforeUnmount(() => userStore.searches.clear())
const showAdd = computed<boolean>(() => {
    if (userStore._id === info.value?._id || userStore.contacts.has(info.value?._id)) return false
    return true
})
</script>
<template>
    <div class="search-info-container">
        <ContentHeader title="用户信息" path="/search"></ContentHeader>
        <div class="top">
            <el-avatar shape="square" :size="60" :src="info?.avatar" />
            <div class="base-info">
                <p class="name">昵称：{{ info?.name }}</p>
                <p class="email">账号：{{ info?.email }}</p>
            </div>
        </div>
        <div class="main">
            <p class="signature">签名：{{ info?.signature }}</p>
        </div>
        <div class="bottom">
            <div class="add" v-if="showAdd" @click="add">添加好友</div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.search-info-container {
    width: $content-width;
    height: $box-height;

    .top {
        // margin-top: 20px;
        padding: 20px 30px;
        display: flex;
        @include line(($content-width)-(30px));

        .base-info {
            margin-left: 20px;

            .name {
                margin-bottom: 5px;
            }
        }
    }

    .main {
        // padding: 30px;
        border-bottom: 1px solid rgba(155, 153, 153, .2);

        &::before {
            width: $content-width;
            display: block;
            content: '';
            height: 10px;
            @include theme('background-color', 'space_color');
        }

        .signature {
            padding: 30px;
        }
    }

    .bottom {

        &::before {
            width: $content-width;
            display: block;
            content: '';
            height: 10px;
            @include theme('background-color', 'space_color');
        }

        .add {
            user-select: none;
            line-height: 45px;
            text-align: center;
            cursor: pointer;
            border-top: 1px solid rgba(155, 153, 153, .2);
            border-bottom: 1px solid rgba(155, 153, 153, .2);

            &:hover {
                @include theme('background-color', 'hover_color');
            }
        }
    }
}
</style>
