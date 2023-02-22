<script setup lang="ts">
import { useRouter } from 'vue-router'
import SvgIcon from './SvgIcon.vue'
interface Props {
    title: string
    path: string
    height?: string
    rightIcon?: string
}
withDefaults(defineProps<Props>(), {
    height: '50px'
})
const router = useRouter()
</script>
<template>
    <div class="content-header" :style="{ height }">
        <SvgIcon name="back" size="20px" @click="router.replace(path)" class="left"></SvgIcon>
        <div class="title">{{ title }}</div>
        <SvgIcon v-if="rightIcon" :name="rightIcon" size="20px" class="right">
        </SvgIcon>
    </div>
</template>
<style scoped lang="scss">
.content-header {
    width: $content-width ;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .title {
        font-weight: 600;
        user-select: none;
    }

    .left {
        position: absolute;
        left: 15px;
        cursor: pointer;
    }

    .right {
        position: absolute;
        right: 15px;
        cursor: pointer;
    }
}
</style>
