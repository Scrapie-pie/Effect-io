<template lang="pug">
    article.chat-dialog
        the-last-messages.chat-dialog__last-messages

        main.chat-dialog__main
                the-chat-main
        footer.chat-dialog__info
            the-client-info

</template>

<script>
    import TheLastMessages from '@/components/TheLastMessagess';
    import TheClientInfo from '@/components/TheClientInfo';
    import TheChatMain from '@/components/TheChatMain';
    export default {
        components: {
            TheChatMain,
            TheLastMessages,
            TheClientInfo,


        },
    }
</script>

<style lang="scss">
    .chat-dialog {
        flex-direction:row;

        &__last-messages {

        }

        &__last-messages{
            width:275px;
            background-color:glob-color('info-lighten');
            //padding-bottom:calc-em(30);

            padding:calc-em(30) 0 ;
            //padding-left:calc-em(15);
            margin:(calc-em(30) * -1) 0 ;
            margin-left:-(calc-em(15));
            @include media($width_md){
                width:190px;
            }
        }

        &__main{
            flex:1;
            padding-left:calc-em(15);
            padding-right:calc-em(15);
            height:100%;
        }

        &__info{
            margin-left:auto;
            width:280px;
            padding-right:calc-em(20);

            .client-info{
                margin-top:-1em;
            }

            @include media($width_md){
                width:19.532%;
                padding-right:calc-em(5);
            }
        }

    }
</style>