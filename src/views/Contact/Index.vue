<script setup lang="ts">
import ContactList from '@/components/contact/ContactList.vue'
</script>
<template>
    <div class="contact-stage">
        <ContactList></ContactList>
        <router-view></router-view>
    </div>
</template>
<style scoped lang="scss">
.contact-stage {
    @include stage;
}
</style>
