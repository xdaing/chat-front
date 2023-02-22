<script lang="ts">
const navigationGuard = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const userStore = useUserStore()
    const _id: string = to.query._id as string
    userStore.contacts.has(_id) ? next() : next({ path: '/contact', replace: true })
}
export default defineComponent({
    beforeRouteEnter: navigationGuard,
    beforeRouteUpdate: navigationGuard
})
</script>
<script setup lang="ts">
import { computed, defineComponent, ref } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { useRouter, useRoute, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router'
import { useUserStore } from '@/stores/user'
import type { Contact } from '@/types'
import { ElMessage } from 'element-plus'
import { contactRemark } from '@/api'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const contact = computed<Contact>(() => {
    const _id: string = route.query._id as string
    return userStore.contacts.get(_id)!
})
const remark = ref<string>('')
const changeRemark = () => {
    const input: string = remark.value.trim()
    remark.value = ''
    if (input === '') return ElMessage.warning('输入不能为空')
    const _id: string = route.query._id as string
    contactRemark({ contact: _id, remark: input })
    const contact: Contact = userStore.contacts.get(_id)!
    contact.remark = input
}
const changeRoute = () => {
    const _id: string = route.query._id as string
    const contact: Contact = userStore.contacts.get(_id)!
    if (!contact.onList) contact.onList = true
    router.replace({ path: '/message/chat', query: { _id } })
}
</script>
<template>
    <div class="contact-info-container">
        <div class="title">
            <SvgIcon name="back" size="20px" class="icon" @click="router.replace('/contact')"></SvgIcon>
            <p class="name">好友信息</p>
        </div>
        <div class="top">
            <el-avatar shape="square" :size="60" :src="contact.avatar" />
            <div class="base-info">
                <p class="remark">{{ contact.remark }}</p>
                <p class="email">账号:{{ contact.email }}</p>
                <p class="name">昵称:{{ contact.name }}</p>
            </div>
        </div>
        <div class="main">
            <p class="signature">个性签名:{{ contact.signature }}</p>
            <div class="change-remark">备注:</div>
            <textarea v-model="remark" class="text" maxlength="6" :placeholder="contact.remark"></textarea>
        </div>
        <div class="bottom">
            <div class="change" @click="changeRemark">更改备注</div>
            <div class="send" @click="changeRoute">发送消息</div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.contact-info-container {
    width: $content-width;
    height: $box-height;

    .title {
        width: $content-width;
        font-size: 16px;
        height: 50px;
        font-weight: 600;
        user-select: none;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .icon {
            position: absolute;
            cursor: pointer;
            left: 15px;
        }
    }


    .top {
        // margin-top: 20px;
        padding: 20px 30px;
        display: flex;
        @include line(($content-width)-(30px));

        .base-info {
            margin-left: 20px;
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
            padding: 10px 30px;
        }

        .change-remark {
            padding: 10px 30px;
        }

        .text {
            margin: 10px 30px;
            width: ($content-width) - (60px);
            height: 60px;
            overflow-y: hidden;
            font-size: 16px;
            padding: 0 5px;
            resize: none;
            background-color: transparent;
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

        user-select: none;

        .change {
            line-height: 45px;
            text-align: center;
            cursor: pointer;
            border-top: 1px solid rgba(155, 153, 153, .2);
        }

        .send {
            line-height: 45px;
            text-align: center;
            cursor: pointer;
            border-top: 1px solid rgba(155, 153, 153, .2);
            border-bottom: 1px solid rgba(155, 153, 153, .2);
        }
    }
}
</style>
