<script setup lang="ts">
interface Props {
    avatar: string
    name: string
    signature: string
}
defineProps<Props>()
</script>
<template>
    <div class="search-item-container">
        <el-avatar shape="square" :size="50" :src="avatar" />
        <div class="content">
            <p class="name">{{ name }}</p>
            <p class="signature">{{ signature }}</p>
        </div>
    </div>
</template>
<style scoped lang="scss">
.search-item-container {
    @include item;
    height: 70px;

    .content {
        box-sizing: border-box;
        padding-left: $stage-list-item-avatar-space;
        height: 45px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .name {
            font-size: 16px;
            font-weight: 600;
        }

        .signature {
            max-width: 160px;
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>
