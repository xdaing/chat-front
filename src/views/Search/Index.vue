<script setup lang="ts">
import SearchList from '@/components/Search/SearchList.vue'
</script>
<template>
    <div class="search-stage">
        <SearchList></SearchList>
        <router-view></router-view>
    </div>
</template>
<style scoped lang="scss">
.search-stage {
    @include stage;
}
</style>
