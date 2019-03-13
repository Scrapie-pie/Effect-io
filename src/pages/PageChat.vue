<template lang="pug">

    article.page-chat
        template(v-if="viewModeChat == 'operators'")
            base-no-found(v-show="messageNo" :name="$route.name")
            section(v-show="!messageNo").page__view.page-chat
                the-last-messages.page-chat__last-messages(v-if="viewModeChat=='operators'")
                the-last-messages-v.page-chat__last-messages(v-else)

                template(v-if="!show")
                    section.page-chat__main
                        the-chat-main
                    aside.page-chat__info(v-if="viewModeChat!='operators'")
                        the-client-info

        template(v-if="viewModeChat == 'visitors'")
            base-no-found(v-show="messageNo" :name="$route.name")
            section(v-show="!messageNo").page__view.page-chat
                the-last-messages.page-chat__last-messages(v-if="viewModeChat=='operators'")
                the-last-messages-v.page-chat__last-messages(v-else)

                template(v-if="!show")
                    section.page-chat__main
                            the-chat-main
                    aside.page-chat__info(v-if="viewModeChat!='operators'")
                        the-client-info
        template(v-if="viewModeChat == 'process'")
            base-no-found(v-show="processNo" :name="$route.name")
            section(v-show="!processNo").page__view.page-chat
                the-last-messages.page-chat__last-messages(v-if="viewModeChat=='operators'")
                the-last-messages-v.page-chat__last-messages(v-else)

                template(v-if="!show")
                    section.page-chat__main
                        the-chat-main
                    aside.page-chat__info(v-if="viewModeChat!='operators'")
                        the-client-info
        template(v-if="viewModeChat == 'common'")
            section().page__view.page-chat
                section.page-chat__main
                    the-chat-main


</template>

<script>
    import TheLastMessages from '@/components/TheLastMessages';
    import TheLastMessagesV from '@/components/TheLastMessagesV';
    import TheClientInfo from '@/components/TheClientInfo';
    import TheChatMain from '@/components/TheChatMain';

    import { viewModeChat } from '@/mixins/mixins'

    export default {
        components: {
            TheChatMain,
            TheLastMessages,
            TheLastMessagesV,
            TheClientInfo,
        },
        mixins:[viewModeChat],
        computed:{
            show(){
                return (this.$route.name==='processAll' || this.$route.name==='messageAll')
            },
            showProcess(){
                return this.$route.name==='processAll' && !this.$store.state.visitors.process.length
            },
            showMessage(){
                return this.$route.name==='messageAll'
            },
            processNo(){
                return this.$route.name==='processAll' && !this.$store.state.visitors.process.length
            },
            messageNo(){
                return this.$route.name==='messageAll' && !this.$store.state.visitors.self.length
            },


        },
        beforeRouteLeave (to, from, next) {
            console.log('beforeRouteLeave',this.$store.commit('resetState'));
            this.$store.commit('resetState')
            return next()
        }




    }
</script>

<style lang="scss">
    .page-chat {
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
            z-index:2;
            min-width:0;//для шаблонов, чтобы работало text-overflow: ellipsis;
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