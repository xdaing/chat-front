<script setup lang="ts">
import { computed } from 'vue'
interface Props {
    name: string
    prefix?: string
    color?: string
    size?: string
}
const props = withDefaults(defineProps<Props>(), {
    prefix: 'icon',
    color: '#333',
    size: '50px'
})
const symbolId = computed<string>(() => `#${props.prefix}-${props.name}`)
</script>
<template>
    <svg aria-hidden="true" :style="{ width: size, height: size }">
        <use :href="symbolId" :fill="color" />
    </svg>
</template>