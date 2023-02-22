<script setup lang="ts">
import { useSocketHook } from '@/hooks/useSocketHook'
import Toolbar from './Toolbar.vue'
useSocketHook()
</script>
<template>
    <div class="background">
        <div class="box-container">
            <Toolbar></Toolbar>
            <router-view></router-view>
        </div>
    </div>
</template>
<style scoped lang="scss">
.background {
    height: 100vh;
    position: relative;
    overflow: auto;
    box-sizing: content-box;
    @include theme('background-color', 'base-background-color');

    .box-container {
        width: $box-width;
        height: $box-height;
        border-radius: 10px;
        overflow: hidden;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        @include theme('background-color', 'container_color')
    }
}
</style>
