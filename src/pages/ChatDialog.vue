<template lang="pug">
    article.chat-dialog
        the-last-messages.chat-dialog__last-messages

        section.chat-dialog__main
                the-chat-main
        aside.chat-dialog__info
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
        $color_border:glob-color('border');
        $color_bg:glob-color('info-lighten');
        $color_bg-app:glob-color('light');
        $box-shadow:$glob-box-shadow;
        $transition:$glob-trans;

        flex-direction:row;

        &__last-messages{
            $sz:calc-em(30);
            width:275px;
            background-color:$color_bg;
            border-right:1px solid $color_border;

            padding:$sz 0 ;
            margin:($sz * -1) 0 ;
            margin-left:-($sz / 2);

            @include media($width_lg){
                width:190px;
            }
        }

        &__main{
            flex:1;
            $pd:calc-em(15);
            padding-left:$pd;
            padding-right:$pd;
            height:100%;

            @include media($width_md) {

                padding-right:0;
                margin-right:-#{$pd};
            }
        }

        &__info{
            flex:0 1 16.32%;
            max-width:280px;
            min-width: 182px;
            margin-left:auto;
            background-color:$color_bg-app;

            @include media($width_md) {

                position:fixed;
                top:0;
                bottom:0;
                right:0;
                padding:calc-em(25) calc-em(10);
                width:202px;
                z-index:1;
                box-shadow:$box-shadow;
                transition:$transition;
                transform:translateX(110%);

                .is-opened-client-info & {
                    transform:translateX(0);
                }
            }


            .client-info{
                margin-top:-1em;
            }


        }

    }
</style>