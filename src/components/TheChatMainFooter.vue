<template lang="pug">
        form.chat-main-footer

            ///the-chat-system-messages

            fieldset(v-if="showProcess" key="showProcess")
                ul.chat-main-footer__process
                    li.chat-main-footer__process-item
                        base-btn(color="success-dark" size="lg" @click="invite") Присоединиться
                    li.chat-main-footer__process-item
                        base-btn(color="info-dark" size="lg") Отклонить
            fieldset(v-else)
                .chat-main-footer__box-control
                    box-controls(:show="showMention", @boxControlClose="showMention=false")
                        select-operators(name="mention")
                    box-controls(:show="showPhrases", @boxControlClose="showPhrases=false")
                        the-phrases-ready
                    box-controls(:show="showSmiles", @boxControlClose="showSmiles=false")
                        the-files-board(name="smiles")
                    box-controls(:show="showGifs", @boxControlClose="showGifs=false")
                        the-files-board(name="gifs")
                    box-controls(:show="showOffer", @boxControlClose="showOffer=false")
                        the-offer()

                .chat-main-footer__contols
                    .chat-main-footer__textarea-wrap
                        scroll-bar.chat-main-footer__scrollbar
                            textarea.chat-main-footer__input(
                                placeholder="Enter - отправить сообщение, Shift+Enter - новая строка."
                                ref="chatInput",
                                v-model="message",
                                @keydown.enter.exact="onEnter",
                                @click.prevent="messageRead"
                            )
                ul.chat-main-footer__buttons
                    li.chat-main-footer__button(v-if="viewModeChat=='common'")
                        base-btn(
                            :icon="{name:'user',textHidden:'Упомянуть в диалоге'}",
                            @click.prevent="showMention=true"
                        )
                    li.chat-main-footer__button
                        base-btn(
                            :icon="{name:'phrases',textHidden:'Список готовых шаблонных фраз'}",
                            @click.prevent="showPhrases=true"
                        )
                    li.chat-main-footer__button.chat-main-footer__button_offer(v-if="viewModeChat=='visitors'")
                        base-btn(
                            :icon="{name:'more-fill',textHidden:'Предложить посетителю'}",
                            @click.prevent="showOffer=true"
                        )
                    li.chat-main-footer__button
                        base-btn(
                            :icon="{name:'smiles',textHidden:'Гифки'}"
                            @click.prevent="showSmiles=true"
                        )
                    li.chat-main-footer__button: base-btn(:icon="{name:'files',textHidden:'Файлы'}")
                    li.chat-main-footer__button
                        base-btn(
                            :icon="{name:'gifs',textHidden:'Гифки'}"
                            @click.prevent="showGifs=true"
                        )
                    li.chat-main-footer__button.chat-main-footer__button_send
                        base-btn.chat-main-footer__send(
                            @click="send"
                            :icon="{name:'send',textHidden:'Отправить сообщение'}"
                        )
</template>

<script>

    import SelectOperators from '@/components/SelectOperators'
    import TheOffer from '@/components/TheOffer'
    import TheFilesBoard from '@/components/TheFilesBoard'
    import ThePhrasesReady from '@/components/ThePhrasesReady'

    import autosize from 'autosize'

    import { viewModeChat,httpParams } from '@/mixins/mixins'

    export default {
        components:{
            SelectOperators,
            TheOffer,
            TheFilesBoard,
            ThePhrasesReady
        },
        mixins:[viewModeChat,httpParams],
        watch:{
            '$route' (to, from) {
                this.checkIsProcessPage();
            },
        },

        data() {
            return {
                showMention:false,
                showProcess:false,
                showGifs:false,
                showOffer:false,
                showSmiles:false,
                showPhrases:false,
                message:'',


            }
        },
        mounted() {

            setTimeout(()=>{
                autosize(this.$refs.chatInput);
            },500)
        },
        beforeDestroy(){
            autosize.destroy(this.$refs.chatInput);
        },
        created() {
            this.checkIsProcessPage()

        },
        computed:{

            processView(){
                return this.showProcess
            }
        },
        methods: {
            invite(){
                this.$http.post('chat-room-user-accept-invitation', {
                    room_id:105

                });
            },
            messageRead(){

                this.$http.put('message-operator-guest-mark-as-read', {
                    room_id:this.$store.state.user.roomIdOpen
                });

                this.$store.commit('operators/messageRead',this.httpParams.params.id)
            },
            onEnter: function (e) {

                e.stopPropagation()
                e.preventDefault()
                e.returnValue = false
                this.input = e.target.value
                this.send()
            },
            send(){
                let data = {},
                    guest_uuid,
                    site_id,
                    to_id,

                    body = this.message;

                if(this.viewModeChat=="visitors") {

                    guest_uuid = this.$store.state.visitors.itemOpen.uuid,
                    site_id = +this.$store.state.visitors.itemOpen.site_id,

                    data = {
                        guest_uuid,
                        site_id,
                        body
                    }

                } else {

                    to_id = + this.$route.params.id;
                    data = {
                        to_id,
                        body
                    }

                }




                this.$http.post('message-send', data);


                let {first_name,photo,employee_id} = this.$store.state.user.profile,
                    time = (new Date).getTime() / 1000;

                let message = {
                    time,
                    body,
                    from_user_info:{
                        id:employee_id,
                        first_name,
                        photo
                    }
                }

                this.$root.$emit('messageAdd',message);

                message.from_user_info.id = this.$store.state.user.profile.employee_id;
                message.selfId = this.httpParams.params.id;

                this.$store.commit('operators/messageLastUpdate',message)

                this.message='';
            },
            checkIsProcessPage() {
                if(this.$route.name === 'process') {
                    this.showProcess = true;
                }
                else this.showProcess = false
            }
        },




    }
</script>

<style lang="scss">
    .chat-main-footer{
        $color_border:glob-color('border');
        $color_bg-send:glob-color('info-lighten');


        border-top:1px solid $color_border;
        padding-top:calc-em(20);

        &__process {
            @extend %row-flex;
        }

        &__controls{

        }
        &__textarea-wrap{


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

        &__button_offer {
            fill:#cbcfde;
        }

        &__button_send{
            margin-left:auto;
        }

        &__send{
            .icon{
                width:calc-em(45);
                height:calc-em(45);
            }
        }

        &__box-control {
            position:relative;
            z-index:9;
            .box-controls__box {
                @extend %full-abs;
                top:auto;
            }
        }


    }
</style>