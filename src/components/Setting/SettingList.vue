<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import SettingItem from './SettingItem.vue'
import List from '../List.vue'
const userStore = useUserStore()
</script>
<template>
    <List>
        <template #title>设置</template>
        <SettingItem icon="login" v-if="userStore.isLogin === true" path="user">用户信息</SettingItem>
        <template v-else>
            <SettingItem icon="login" path="register">注册</SettingItem>
            <SettingItem icon="login" path="login">登录</SettingItem>
        </template>
        <SettingItem icon="login" path="config">应用设置</SettingItem>
        <SettingItem icon="login" path="about">关于</SettingItem>
    </List>
</template>
