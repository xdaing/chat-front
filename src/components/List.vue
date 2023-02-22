<template>
    <div class="list-container">
        <p class="list-title">
            <slot name="title"></slot>
            <slot name="icon"></slot>
        </p>
        <div class="list-content">
            <slot></slot>
        </div>
    </div>
</template>
<style scoped lang="scss">
.list-container {
    height: $box-height;
    width: $stage-list-width;
    box-sizing: border-box;
    border-right: 1px solid;
    border-left: 1px solid;
    @include theme('border-color', 'border_color');

    .list-title {
        position: relative;
        width: $stage-list-content-width;
        height: $stage-list-title-height;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: 600;
        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid black;
    }

    .list-content {
        height: $stage-list-content-height;
        width: $stage-list-content-width;
    }
}
</style>
