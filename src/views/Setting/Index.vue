<script setup lang="ts">
import SettingList from '@/components/Setting/SettingList.vue'

</script>
<template>
    <div class="setting-stage">
        <SettingList></SettingList>
        <router-view></router-view>
    </div>
</template>
<style scoped lang="scss">
.setting-stage {
    @include stage;
}
</style>
