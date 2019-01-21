<template lang="pug">
    main.chat-main
        .chat-main__header
            .chat-main__header-text
                h1.chat-main__name(v-text="clientName")
                p.chat-main__channel На сайте: site.ru - Кеды для спорта
            ul.chat-main__header-controls
                li.chat-main__header-control
                    base-btn(theme="default" padding="xs") + Пригласить
                li.chat-main__header-control
                    div.chat-main__header__more
        .chat-main__body
            ul.chat-main__list
                li.chat-main__item
                    time.chat-main__date 29 ноября 2017
                    .chat-main__messges
                        ul.messges
                            li.messges__item
                                base-people
            .chat-main__contols
                textarea.chat-main__input(placeholder="Enter - отправить сообщение, Shift+Enter - новая строка.")
            ul.chat-main__buttons
                li.chat-main__button: base-btn(:icon="{name:'phrases'}")
                li.chat-main__button: base-btn(:icon="{name:'offer'}")
                li.chat-main__button: base-btn(:icon="{name:'smiles'}")
                li.chat-main__button: base-btn(:icon="{name:'files'}")
                li.chat-main__button: base-btn(:icon="{name:'gifs'}")
                li.chat-main__button.chat-main__button_send: base-btn.chat-main__send(:icon="{name:'arrow'}")
</template>

<script>
    export default {
        data() {
            return {
                clientName: '',
            }
        },
        created() {
            this.clientName = 'Петр Иванов';

        }
    }
</script>

<style lang="scss">
    .chat-main{
        $color_border:glob-color('border');
        $color_bg-send:glob-color('info-lighten');
        $color_bg_date:glob-color('light');
        display:flex;
        flex-flow:column;

        &__header{
            display:flex;
            justify-content:space-between;
        }
        &__name{
            font-size:inherit;
            margin-bottom:.5em;
        }

        &__body{
            margin-top:auto;
        }

        &__date{
            position:relative;
            display:block;
            text-align:center;
            margin:1.5em 0;

            &::before{
                content:'';
                border-top:1px solid $color_border;
                position:absolute;
                left:0;
                right:0;
                top:50%;
                z-index:-1;
            }
            &::after{
                content:'';
                display:block;
                @extend %full-abs;
                z-index:-1;
                margin:0 auto;
                width:98px;
                background:$color_bg_date;
            }
        }

        &__controls{
            border-top:1px solid $color_border;
        }

        &__input{
            width:100%;
            padding:calc-em(15) 0;
        }

        &__buttons{
            display:flex;
            align-items:center;
        }
        &__button_send{
            margin-left:auto;
        }
        &__send{
            width:calc-em(45);
            height:calc-em(45);
            background-color:$color_bg-send;
            border-radius:50%;

            .icon{
                width:25px;
                height:25px;
            }
        }
    }
</style>