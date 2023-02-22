<script setup lang="ts">
import { reactive, ref, inject } from 'vue'
import { useUserStore } from '@/stores/user'
import type { UserLoginForm, } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'
import ContentHeader from '@/components/ContentHeader.vue'

const userStore = useUserStore()
const isEmail: RegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const loginFormRef = ref<FormInstance | null>(null)
const loginForm: UserLoginForm = reactive({ email: userStore.email, password: '' })

// 表单验证规则
const loginFormRules: FormRules = reactive({
    email: [
        { whitespace: true, message: '不能有空格', trigger: 'blur' },
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: (rule: any, value: string,) => isEmail.test(value), message: '邮箱格式错误', trigger: 'blur' }
    ],
    password: [
        { whitespace: true, message: '不能有空格', trigger: 'blur' },
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 12, message: '密码长度在6-12之间', trigger: 'blur' }
    ],
})
// 登录
const onSubmit = (form: FormInstance | null) => {
    form && form.validate(async (valid: boolean) => {
        valid && userStore.login(loginForm)
    })
}
</script>
<template>
    <div class="login-container">
        <ContentHeader title="登录" path="/setting"></ContentHeader>
        <el-form label-width="80px" :model="loginForm" :rules="loginFormRules" ref="loginFormRef" class="login-form">
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="loginForm.email" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" show-password />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit(loginFormRef)">登录</el-button>
                <!-- <router-link to="/setting/reset" replace> -->
                <p class="forget">忘记密码</p>
                <!-- </router-link> -->
            </el-form-item>
        </el-form>
    </div>
</template>
<style scoped lang="scss">
.login-container {
    @include content;
    // display: flex;
    // align-items: center;
    // justify-content: center;

    .login-form {
        width: 400px;
        margin: 100px auto;

        .forget {
            margin-left: 50px;
            font-size: 13px;
            color: black;
        }
    }
}
</style>
