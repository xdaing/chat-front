<script setup lang="ts">
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import ContentHeader from '@/components/ContentHeader.vue'
import { setTheme } from '@/utils/config'

const configStore = useConfigStore()
const dark = ref<boolean>(configStore.theme === 'dark' ? true : false)
// const html: HTMLHtmlElement = document.querySelector('html')!
const changeTheme = () => {
    const theme: string = dark.value ? 'dark' : 'light'
    setTheme(theme)
    configStore.theme = theme
    localStorage.setItem('config_theme', theme)
}
</script>
<template>
    <div class="config-container">
        <ContentHeader title="应用设置" path="/setting"></ContentHeader>
        黑夜模式<el-switch v-model="dark" @change="changeTheme" />
    </div>
</template>
<style scoped lang="scss">
.config-container {
    @include content;
}
</style>
