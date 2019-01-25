<template lang="pug">
    form.chat-actions
        fieldset(v-if="!showBlockClient")
            legend.chat-actions__text-only-scr Выберите одно из действий
            ul.chat-actions__list
                li.chat-actions__more-item
                    base-btn(:icon="{name:'transfer',top:true}") Передать диалог
                li.chat-actions__more-item
                    base-btn(:icon="{name:'exit',top:true}") Выйти из диалога
                li.chat-actions__more-item
                    base-btn(:icon="{name:'bl',top:true}", @click="showBlockClient=true") Блокировать клиента
        fieldset(v-else)
            legend.chat-actions__title Вы уверенв, что хотите заблокировать данного клиента?
            ul.chat-actions__buttons
                li.chat-actions__buttons-item
                    base-btn Заблокировать
                li.chat-actions__buttons-item
                    base-btn(theme="error") Отмена

</template>

<script>
    export default {
        components: {},

        data() {
            return {
                showBlockClient:false,
            }
        }
    }
</script>

<style lang="scss">
    .chat-actions {
        $color_info-dark:glob-color('info-dark');

        &__list {
            display:flex;
        }

        &__buttons {
            @extend %row-flex;


        }

        &__title {
            margin-bottom:calc-em(20);
            font-weight:700;
        }

        &__text-only-scr {
            @extend %visuallyhidden;
        }



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