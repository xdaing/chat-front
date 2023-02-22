<script setup lang="ts">
import SvgIcon from '../SvgIcon.vue'
interface Props {
    icon: string
    path: string
}
defineProps<Props>()
</script>
<template>
    <router-link :to="`/setting/${path}`" replace class="setting-item-container">
        <div class="content">
            <SvgIcon :name="icon" size="25px"></SvgIcon>
            <p class="text">
                <slot></slot>
            </p>
        </div>
        <SvgIcon name="forward" size="20px"></SvgIcon>
    </router-link>
</template>
<style scoped lang="scss">
.setting-item-container {
    @include item;
    justify-content: space-between;
    height: 50px;

    .content {
        display: flex;
        align-items: center;

        .text {
            padding-left: $stage-list-item-avatar-space;
            color: black;
        }
    }
}
</style>
