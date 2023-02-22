<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useVisitorStore } from '@/stores/visitor'
import { useConfigStore } from '@/stores/config'
import SvgIcon from './SvgIcon.vue'

const configStore = useConfigStore()
const userStore = useUserStore()
const visitorStore = useVisitorStore()
const avatar = computed<string>(() => userStore.isLogin ? userStore.avatar : visitorStore.avatar)
const name = computed<string>(() => userStore.isLogin ? userStore.name : visitorStore.name)
const unread = computed<number>(() => userStore.isLogin ? userStore.unread : visitorStore.unread)
// 退出登录弹窗
const showDialog = ref<boolean>(false)
const logout = () => {
    showDialog.value = false
    userStore.logout()
}
</script>
<template>
    <div class="toolbar-container">
        <div class="content">
            <el-tooltip :content="name" placement="right" :effect="configStore.theme">
                <div class="avatar-container">
                    <el-avatar :size="55" class="avatar" shape="square" :src="avatar">
                    </el-avatar>
                </div>
            </el-tooltip>
            <router-link to="/message" replace>
                <el-tooltip content="消息" placement="right" :effect="configStore.theme">
                    <el-badge :value="unread" :hidden="unread === 0">
                        <SvgIcon class="icon" name="message" size="38px"></SvgIcon>
                    </el-badge>
                </el-tooltip>
            </router-link>
            <template v-if="userStore.isLogin">
                <router-link to="/contact" replace>
                    <el-tooltip content="好友" placement="right" :effect="configStore.theme">
                        <el-badge :value="userStore.applications.size" :hidden="userStore.applications.size === 0">
                            <SvgIcon class="icon" name="contact" size="40px"></SvgIcon>
                        </el-badge>
                    </el-tooltip>
                </router-link>
                <router-link to="/search" replace>
                    <el-tooltip content="搜索" placement="right" :effect="configStore.theme">
                        <SvgIcon class="icon" name="search" size="40px"></SvgIcon>
                    </el-tooltip>
                </router-link>
            </template>
            <router-link to="/setting" replace>
                <el-tooltip content="设置" placement="right" :effect="configStore.theme">
                    <SvgIcon class="icon" name="setting" size="40px"></SvgIcon>
                </el-tooltip>
            </router-link>
        </div>
        <div class="actions">
            <el-tooltip content="退出登录" placement="right" v-if="userStore.isLogin" :effect="configStore.theme">
                <SvgIcon name="login" class="icon" size="25px" @click="showDialog = true">
                </SvgIcon>
            </el-tooltip>
            <el-tooltip content="项目地址" placement="right" :effect="configStore.theme">
                <a href="https://github.com/xdaing/chat-front" target="_blank">
                    <SvgIcon name="github" class="icon" size="25px" style="margin-top: 10px;"></SvgIcon>
                </a>
            </el-tooltip>
        </div>
    </div>
    <el-dialog v-model="showDialog" title="退出登录" width="30%" align-center>
        <span>确定退出登录？</span>
        <template #footer>
            <span>
                <el-button @click="showDialog = false">取消</el-button>
                <el-button type="primary" @click="logout">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style scoped lang="scss">
.toolbar-container {
    width: $toolbar-width;
    height: $box-height;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    padding-right: 5px;

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;

        .avatar-container {
            margin: 20px 0;
            width: 55px;
            height: 55px;
            overflow: hidden;
            border-radius: 4px;
            cursor: pointer;

            .avatar {
                transition: transform 0.5s ease;

                &:hover {
                    transform: scale(1.1);
                }
            }
        }
    }

    .actions {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-bottom: 20px;
    }

    .icon {
        margin-bottom: 10px;
        transition: transform 0.2s linear;
        cursor: pointer;

        &:hover {
            transform: scale(1.1);
        }
    }
}
</style>
