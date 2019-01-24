<template lang="pug">
        form.chat-main-footer
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
                        :icon="{name:'phrases',textHidden:'Список готовых шаблонных фраз'}",
                        @click.prevent="showPhrases=true"
                    )
                li.chat-main-footer__button
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
        data() {
            return {
                showGifs:false,
                showOffer:false,
                showSmiles:false,
                showPhrases:false,


            }
        },
        mounted() {



        },
        created() {


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