<template lang="pug">
        footer.chat-main-footer
            .chat-main-footer__contols
                .chat-main-footer__textarea-wrap
                    scroll-bar.chat-main-footer__scrollbar
                        textarea.chat-main-footer__input(placeholder="Enter - отправить сообщение, Shift+Enter - новая строка." ref="chatInput" )
            ul.chat-main-footer__buttons
                li.chat-main-footer__button: base-btn(:icon="{name:'phrases'}")
                li.chat-main-footer__button: base-btn(:icon="{name:'more'}")
                li.chat-main-footer__button: base-btn(:icon="{name:'smiles'}")
                li.chat-main-footer__button: base-btn(:icon="{name:'files'}")
                li.chat-main-footer__button: base-btn(:icon="{name:'gifs'}")
                li.chat-main-footer__button.chat-main-footer__button_send: base-btn.chat-main-footer__send(:icon="{name:'arrow'}")
</template>

<script>
    import TheChatMainHeader from '@/components/TheChatMainHeader'
    import autosize from 'autosize'
    export default {
        components:{
            TheChatMainHeader
        },
        data() {
            return {
                clientName: '',
                showClientHistoryActions:false,
                showInvite:false,
                showMoreChatActions:false,
                //moreActionsClose:false,

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

        },
        methods: {

        },


    }
</script>

<style lang="scss">
    .chat-main-footer{
        $color_border:glob-color('border');
        $color_bg-send:glob-color('info-lighten');




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


    }
</style>