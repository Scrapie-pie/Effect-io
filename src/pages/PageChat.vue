<template lang="pug">

    article.page-chat
        template(v-if="viewModeChat === 'common'")
            section.page__view.page-chat
                section.page-chat__main
                    the-chat-main

        template(v-if="viewModeChat === 'operators'")
            section.page__view.page-chat
                the-last-messages()
                section.page-chat__main
                    the-chat-main


        template(v-if="viewModeChat === 'visitors'")
            base-no-found(v-show="messageNo" :name="$route.name")
            section(v-show="!messageNo").page__view.page-chat
                the-last-messages-v
                template(v-if="!show")
                    section.page-chat__main
                            the-chat-main
                    aside.page-chat__info
                        the-client-info

        template(v-if="viewModeChat === 'process'")
            base-no-found(v-show="processNo" :name="$route.name")
            section(v-show="!processNo").page__view.page-chat
                the-last-messages-v

                template(v-if="!show")

                    section.page-chat__main
                        the-chat-main
                    aside.page-chat__info
                        the-client-info

        template(v-if="viewModeChat === 'visor'")
            section.page__view.page-chat
                the-last-messages-v
                section.page-chat__main
                    the-chat-main
                aside.page-chat__info
                    the-client-info



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

            processNo(){
                return this.$route.name==='processAll' && !this.$store.state.visitors.process.length
            },
            messageNo(){

                return this.$route.name==='messageAll' && !this.$store.state.visitors.self.length
            },


        },
        watch:{
            '$route'(to,from){
                this.visorSubscribeSocket(to,from)
            }
        },
        beforeRouteEnter (to, from, next) {
            next(vm=>{
                vm.visorSubscribeSocket(to)
                if(to.name==="common") {
                    if(vm.$store.state.user.profile.is_common_chat) vm.$router.push({name:'common'})
                    else vm.$router.push( {name: 'processAll',},)
                }

            })
        },
        beforeRouteLeave (to, from, next) {
            this.visorSubscribeSocket(null,from)
            this.$store.commit('resetState')
            return next()
        },
        methods:{
            visorSubscribeSocket(to,from){

                if(this.viewModeChat==='visor') {
                    console.log('visorSubscribeSocket');
                    if(to) {
                        this.$http.post('chat-room-supervisor-enter', {
                            site_id:to.params.site_id,
                            uuid:to.params.uuid,
                        })
                    }


                    if(from) {
                        this.$http.post('chat-room-supervisor-exit', {
                            site_id:from.params.site_id,
                            uuid:from.params.uuid,
                        })
                    }


                }
            },
        }




    }
</script>

<style lang="scss">
    .page-chat {
        $color_bg-app:glob-color('light');
        $box-shadow:$glob-box-shadow;
        $transition:$glob-trans;

        flex-direction:row;



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