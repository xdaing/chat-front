<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import SearchItem from './SearchItem.vue'
import List from '../List.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const router = useRouter()
userStore.searches.clear()
const isEmail: RegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const searchFormRef = ref<FormInstance | null>(null)
const searchForm: { email: string } = reactive({ email: '' })
// 表单验证规则
const SearchFormRules: FormRules = reactive({
    email: [
        { whitespace: true, trigger: 'blur' },
        { required: true, trigger: 'blur' },
        { validator: (rule: any, value: string,) => isEmail.test(value), trigger: 'blur' }
    ]
})
const search = (form: FormInstance | null) => {
    form && form.validate((valid: boolean) => {
        if (valid) {
            router.replace('/search')
            userStore.searchUser(searchForm.email)
        }
    })
}
const info = (_id: string) => router.replace({ path: '/search/info', query: { _id } })
</script>
<template>
    <List>
        <template #title>搜索</template>
        <el-form class="search-form" :model="searchForm" :rules="SearchFormRules" ref="searchFormRef">
            <el-form-item prop="email" style="width: 225px;" :show-message="false">
                <el-input v-model="searchForm.email" placeholder="输入邮箱搜索" clearable @clear="router.replace('/search')" />
            </el-form-item>
            <el-button type="primary" @click="search(searchFormRef)">搜索</el-button>
        </el-form>
        <SearchItem @click="info(key)" v-for="[key, item] in userStore.searches" :key="key" :avatar="item.avatar"
            :name="item.name" :signature="item.signature"></SearchItem>
    </List>
</template>
<style scoped lang="scss">
.search-form {
    padding: 5px 5px 0 5px;
    display: flex;
    justify-content: space-between;
    margin-bottom: -15px;
}
</style> 