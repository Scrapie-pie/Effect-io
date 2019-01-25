<template lang="pug">
        form.chat-main-footer

            //the-chat-system-messages

            fieldset(v-if="showProcess")
                ul.chat-main-footer__process
                    li.chat-main-footer__process-item
                        base-btn(color="success-dark" size="lg") Присоединиться
                    li.chat-main-footer__process-item
                        base-btn(color="info-dark" size="lg") Отклонить
            fieldset(v-else)
                base-box-menu(:show="showMention", @base_box_menu_close="showMention=false")
                    the-phrases-ready
                base-box-menu(:show="showPhrases", @base_box_menu_close="showPhrases=false")
                    the-phrases-ready
                base-box-menu(:show="showSmiles", @base_box_menu_close="showSmiles=false")
                    the-files-board(name="smiles")
                base-box-menu(:show="showGifs", @base_box_menu_close="showGifs=false")
                    the-files-board(name="gifs")
                base-box-menu(:show="showOffer", @base_box_menu_close="showOffer=false")
                    the-offer()

                .chat-main-footer__contols
                    .chat-main-footer__textarea-wrap
                        scroll-bar.chat-main-footer__scrollbar
                            textarea.chat-main-footer__input(
                                placeholder="Enter - отправить сообщение, Shift+Enter - новая строка."
                                ref="chatInput"
                            )
                ul.chat-main-footer__buttons
                    li.chat-main-footer__button
                        base-btn(
                        :icon="{name:'user',textHidden:'Упомянуть в диалоге'}",
                        @click.prevent="showMention=true"
                        )
                    li.chat-main-footer__button
                        base-btn(
                            :icon="{name:'phrases',textHidden:'Список готовых шаблонных фраз'}",
                            @click.prevent="showPhrases=true"
                        )
                    li.chat-main-footer__button.chat-main-footer__button_offer
                        base-btn(
                            :icon="{name:'more',textHidden:'Предложить посетителю'}",
                            @click.prevent="showOffer=true"
                        )
                    li.chat-main-footer__button
                        base-btn(
                            :icon="{name:'smiles',textHidden:'Гифки'}"
                            @click.prevent="showSmiles=true"
                        )
                    li.chat-main-footer__button: base-btn(:icon="{name:'files'}")
                    li.chat-main-footer__button
                        base-btn(
                            :icon="{name:'gifs',textHidden:'Гифки'}"
                            @click.prevent="showGifs=true"
                        )
                    li.chat-main-footer__button.chat-main-footer__button_send: base-btn.chat-main-footer__send(:icon="{name:'arrow'}")
</template>

<script>

    import TheOffer from '@/components/TheOffer'
    import TheFilesBoard from '@/components/TheFilesBoard'
    import ThePhrasesReady from '@/components/ThePhrasesReady'

    export default {
        components:{

            TheOffer,
            TheFilesBoard,
            ThePhrasesReady
        },
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


            }
        },
        mounted() {



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
            checkIsProcessPage() {
                console.log(this.$route.name);
                if(this.$route.name === 'process') {
                    console.log('checkIsProcessPage');
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

            padding: 0 0 calc-em(20);
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