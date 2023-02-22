<script setup lang="ts">
interface Props {
    _id: string
    name: string
    avatar: string
}
defineProps<Props>()
</script>
<template>
    <div class="contact-item-container">
        <el-avatar shape="square" :size="40" :src="avatar" />
        <p class="name">{{ name }}</p>
        <div class="modal" :_id="_id"></div>
    </div>
</template>
<style scoped lang="scss">
.contact-item-container {
    @include item;
    height: 55px;

    .name {
        padding-left: $stage-list-item-avatar-space;
    }

    .modal {
        width: $stage-list-content-width;
        height: 55px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: transparent;
    }
}
</style>
