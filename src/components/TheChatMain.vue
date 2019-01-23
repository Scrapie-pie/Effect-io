<template lang="pug">
    article.chat-main
        header.chat-main__header
            .chat-main__header-text
                h1.chat-main__name(v-text="clientName")
                p.chat-main__channel На сайте: site.ru - Кеды для спорта
            ul.chat-main__header-controls
                li.chat-main__header-control
                    base-btn(theme="default" padding="xs") + Пригласить
                li.chat-main__header-control
                    div.chat-main__header__more
        scroll-bar.chat-main__body.scroll-bar(v-once)
            ul.chat-main__list
                li.chat-main__item
                    time.chat-main__date 29 ноября 2017

                    ul.chat-main__messages
                        li.chat-main__messages-item(v-for="(item, index) in messageList",:key="index")
                            base-people(avatar-width="md" :name="item.name" :text="item.text" :datetime="item.datetime")
        footer.chat-main__footer
            .chat-main__contols
                .chat-main__textarea-wrap
                    scroll-bar.chat-main__scrollbar
                        textarea.chat-main__input(placeholder="Enter - отправить сообщение, Shift+Enter - новая строка." ref="chatInput" )
            ul.chat-main__buttons
                li.chat-main__button: base-btn(:icon="{name:'phrases'}")
                li.chat-main__button: base-btn(:icon="{name:'offer'}")
                li.chat-main__button: base-btn(:icon="{name:'smiles'}")
                li.chat-main__button: base-btn(:icon="{name:'files'}")
                li.chat-main__button: base-btn(:icon="{name:'gifs'}")
                li.chat-main__button.chat-main__button_send: base-btn.chat-main__send(:icon="{name:'arrow'}")
</template>

<script>
    import autosize from 'autosize'
    export default {
        data() {
            return {
                clientName: '',


                messageList: [
                    {name: 'Петр Иванов', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Петр Иванов', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Петр Иванов', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Петр Иванов', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Петр Иванов', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                    {name: 'Маша', text: 'Где можно посмотреть спортивные кеды?', datetime: 17.47},
                ],


            }
        },
        mounted() {
            setTimeout(() => {
                autosize(this.$refs.chatInput);
            }, 5000)


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
        height:100%;

        &__header{
            display:flex;
            justify-content:space-between;
            margin-bottom:2.5em;
        }
        &__name{
            font-size:inherit;
            margin-bottom:.5em;
        }

        &__body{
            margin-top:auto;
            height:auto;
        }

        &__date{
            position:relative;
            display:block;
            text-align:center;
            margin:0 0 1.5em;

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
        &__textarea-wrap{
            border-top:1px solid $color_border;
            padding:calc-em(20) 0 0;
        }
        &__scrollbar{
            max-height:7.5em;
        }
        &__input{
            width:100%;
            height:2em;
            line-height:1.5;

            border:0;
            padding:0;
            overflow:hidden !important;
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

        &__messages{
            margin-bottom:calc-em(25);
        }
        &__messages-item{
            & + &{
                margin-top:calc-em(15);
            }

        }
    }
</style>