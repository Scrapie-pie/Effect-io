<template lang="pug">
    ul.chat-main-header-actions
        li.chat-main-header-actions__more-item
            base-btn(:icon="{name:'transfer',top:true}") Передать диалог
        li.chat-main-header-actions__more-item
            base-btn(:icon="{name:'exit',top:true}") Выйти из диалога
        li.chat-main-header-actions__more-item
            base-btn(:icon="{name:'bl',top:true}") Блокировать клиента
</template>

<style lang="scss">
    .chat-main-header-actions {
        $color_info-dark:glob-color('info-dark');
        display:flex;

        &__more-btn {
            .icon {
                fill:$color_info-dark;
                width:27px;
                height:17px;
            }
        }
        &__more-list {

        }
        &__more-item {
            padding-left:calc-em(25);
            padding-right:calc-em(25);
            white-space:nowrap;
        }

    }

</style>