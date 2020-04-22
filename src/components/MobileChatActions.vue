<template lang="pug">
    .mobile-chat-actions
        .mobile-chat-actions__close-wrap(@click="$emit('close')")
        base-btn(
            :icon="{name:'close'}",
            @click="$emit('close')"
            title="Закрыть"
        ).mobile-chat-actions__close
        scroll-bar.mobile-chat-actions__scroll-bar
            ul.mobile-chat-actions__list
                li.mobile-chat-actions__item
                    base-btn(theme="text") Поставить тэг
                li.mobile-chat-actions__item
                    base-btn(theme="text") Заявка в ОТРС
                li.mobile-chat-actions__item
                    base-btn(theme="text") Передать в отдел
                li.mobile-chat-actions__item
                    base-btn(theme="text") Десктоп
                li.mobile-chat-actions__item
                    base-btn(theme="text") Менеджер
                li.mobile-chat-actions__item
                    base-btn(theme="text") Завершить диалог

</template>

<script>

export default {
    name: "mobile-chat-actions",
    directives: {

    },
    data() {
        return {

        }
    },
    methods: {
        outside(){
            this.$emit('close')
        }
    },
    mounted() {
        this.popupItem = this.$el
        //document.addEventListener('click', this.close);
    },
}
</script>

<style lang="scss">
    .mobile-chat-actions{
        @extend %full-abs;
        z-index:9999;

        &__item {
            padding:1em;
            font-size:1.5em;
        }
        &__scroll-bar {
            height:100%;
            background:glob-color(light);
            margin-left:3.5em;
        }

        &__close-wrap {
            @extend %full-abs;
            background-color: rgba(0, 0, 0, 0.5);
        }
        & &__close {
            position:absolute;
            top:0;
            left:0;
            padding:1em;
            fill:glob-color(light);
        }

    }
</style>
