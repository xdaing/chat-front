<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import ContentHeader from '@/components/ContentHeader.vue'
import { useRouter } from 'vue-router'
import type { UserRegisterForm } from '@/types'
import { useUserStore } from '@/stores/user'


const router = useRouter()
const uerStore = useUserStore()

const resettingFormFormRef = ref<FormInstance | null>(null)
const resettingForm = reactive({
    email: '',
    password: '',
    code: ''
})
const isEmail: RegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
const resettingFormRules: FormRules = reactive({
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


        }
    })
}
const getCode = (form: FormInstance | null) => {
    form && form.validateField('email', (valid: boolean) => {
        valid && uerStore.getEmailCode(resettingForm.email)
    })
}
</script>
<template>
    <div class="resetting">
        <ContentHeader title="重置密码" path="/setting"></ContentHeader>
        <el-form label-width="80px" :model="resettingForm" :rules="resettingFormRules" ref="resettingFormFormRef"
            class="resetting-form">
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="resettingForm.email" />
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input v-model="resettingForm.password" />
            </el-form-item>
            <el-form-item label="验证码" prop="code" style="display: flex;">
                <el-input v-model="resettingForm.code" />
            </el-form-item>
            <el-form-item>
                <el-button @click="getCode(resettingFormFormRef)">获取验证码</el-button>
                <el-button type="primary" @click="onSubmit(resettingFormFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style scoped lang="scss">
.resetting {
    @include content;

    .resetting-form {
        width: 400px;
        margin: 100px auto;
    }
}
</style>
