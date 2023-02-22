<script setup lang="ts">
import ContactItem from './ContactItem.vue'
import SvgIcon from '../SvgIcon.vue'
import List from '../List.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const router = useRouter()
const info = (event: Event) => {
    const _id: string | null = (event.target as HTMLDivElement).getAttribute('_id')
    if (_id !== null) router.replace({ path: '/contact/info', query: { _id } })
}
</script>
<template>
    <List>
        <template #title> 联系人 </template>
        <el-scrollbar noresize @click="info">
            <div class="new-contact-container" @click="router.replace('/contact/newContact')">
                <div class="content">
                    <SvgIcon name="newFriend" size="30px"></SvgIcon>
                    <p class="text">新的朋友</p>
                </div>
                <el-badge :value="userStore.applications.size" :hidden="userStore.applications.size === 0"></el-badge>
            </div>
            <template v-for="[spell, value] in userStore.dividedContacts">
                <div class="surname" v-if="value.length" :key="spell">
                    <p class="spell">{{ spell }}</p>
                    <ContactItem v-for="item in  value" :name="item.name" :_id="item._id" :avatar="item.avatar"
                        :key="item._id">
                    </ContactItem>
                </div>
            </template>
        </el-scrollbar>
    </List>
</template>
<style scoped lang="scss">
.new-contact-container {
    height: 50px;
    padding: 0 $stage-list-item-space;
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    cursor: pointer;
    position: relative;
    @include line;

    .content {
        display: flex;
        align-items: center;

        .text {
            padding-left: 15px;
        }
    }
}

.surname {

    .spell {
        user-select: none;
        color: rgb(138, 138, 137);
        line-height: 25px;
        font-size: 13px;
        padding-left: 10px;
        @include theme('background-color', 'space_color');
    }
}
</style>
