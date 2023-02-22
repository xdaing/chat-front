<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import HeaderLink from '@/components/ContentHeader.vue'
import { useRouter } from 'vue-router'
import type { UserRegisterForm } from '@/types'
import { useUserStore } from '@/stores/user'


const router = useRouter()
const uerStore = useUserStore()
const registerFormRef = ref<FormInstance | null>(null)
const registerForm: UserRegisterForm = reactive({
    email: '',
    password: '',
    repeat: '',
    code: ''
})
const isEmail: RegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const registerFormRules: FormRules = reactive({
    email: [
        { whitespace: true, message: '不能有空格', trigger: 'blur' },
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: (rule: any, value: string,) => isEmail.test(value), message: '邮箱格式错误', trigger: 'blur' }
    ],
    password: [
        { whitespace: true, message: '不能有空格', trigger: 'blur' },
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 12, message: '密码长度应在6-12之间', trigger: 'blur' }
    ],
    repeat: [
        { whitespace: true, message: '不能有空格', trigger: 'blur' },
        { required: true, message: '请确认密码', trigger: 'blur' },
        { validator: (rule: any, value: string) => value === registerForm.password, message: '密码不同', trigger: 'blur' }
    ],
    code: [
        { whitespace: true, message: '不能有空格', trigger: 'blur' },
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码长度为6位', trigger: 'blur' },
        { validator: (rule: any, value: string) => /^\d+$/.test(value), message: '验证码为数字', trigger: 'change' }
    ],
})

const onSubmit = (form: FormInstance | null) => {
    form && form.validate(async (valid) => {
        if (valid) {
            const { email, password, code } = registerForm
            const result = await uerStore.register({ email, password, code })
            result && router.replace({ path: '/setting/login' })
        }
    })
}
const getCode = (form: FormInstance | null) => {
    form && form.validateField('email', (valid: boolean) => {
        valid && uerStore.getEmailCode(registerForm.email)
    })
}
</script>
<template>
    <div class="register">
        <HeaderLink title="注册" path="/setting"></HeaderLink>
        <el-form label-width="80px" :model="registerForm" :rules="registerFormRules" ref="registerFormRef"
            class="register-form">
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerForm.email" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="registerForm.password" show-password />
            </el-form-item>
            <el-form-item label="确认密码" prop="repeat">
                <el-input v-model="registerForm.repeat" show-password />
            </el-form-item>
            <el-form-item label="验证码" prop="code" style="display: flex;">
                <el-input v-model="registerForm.code" />
            </el-form-item>
            <el-form-item>
                <el-button @click="getCode(registerFormRef)">获取验证码</el-button>
                <el-button type="primary" @click="onSubmit(registerFormRef)">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style scoped lang="scss">
.register {
    @include content;

    .register-form {
        width: 400px;
        margin: 100px auto;
    }
}
</style>
