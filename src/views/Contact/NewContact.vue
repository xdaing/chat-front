<script setup lang="ts">
import { ref } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import NewContactItem from '@/components/contact/NewContactItem.vue'
import { useRouter } from 'vue-router'
import { applications } from '@/api'
import { useUserStore } from '@/stores/user'
import type { ApplicationsItem } from '@/types'
const userStore = useUserStore()

const router = useRouter()
applications(Array.from(userStore.applications)).then((data: any) => {
    list.value = data.data
})
const list = ref<Array<ApplicationsItem>>([])
const remove = (_id: string) => {
    console.log(_id);
    for (let i = 0; i < list.value.length; i++) {
        if (list.value[i]._id === _id) {
            list.value.splice(i, 1)
            break
        }
    }
}
</script>
<template>
    <div class="new-contact-container">
        <div class="title">
            <SvgIcon name="back" size="20px" class="icon" @click="router.replace('/contact')"></SvgIcon>
            <p class="name">新的朋友</p>
        </div>
        <el-scrollbar class="contact-scroll" noresize>
            <NewContactItem @remove="remove" v-for="item in list" :avatar="item.avatar" :_id="item._id"
                :signature="item.signature" :name="item.name"></NewContactItem>
        </el-scrollbar>
    </div>
</template>
<style scoped lang="scss">
.new-contact-container {
    width: $content-width;
    height: $box-height;

    .title {
        width: $content-width;
        font-size: 16px;
        height: 55px;
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

    .contact-scroll {
        width: $content-width;
        height: ($box-height) - (55px);
    }
}
</style>
