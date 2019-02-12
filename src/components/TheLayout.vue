<template lang="pug">
    scroll-bar.layout
        header.layout__header(:class="{'layout__header_padding-wrap_no':headerPaddingNo}")
            .layout__grid
                h1.layout__title
                    slot(name="title")
            router-link.layout__close(:to="{name:'process'}" title="Выход")
                span.layout__close-text-only-scr Выход
                base-icon(name="close")
        .layout__grid
            .layout__inner
                .layout__nav
                    slot(name="nav")
                .layout__main
                    transition(name="fade" mode="out-in")
                        slot(name="main")



</template>

<script>


    export default {
        props: {
            headerPaddingNo:Boolean
        },
        data() {
            return {

            }
        },
        created(){

        },
        mounted(){

        }

    }
</script>


<style lang="scss">


    .layout{
        margin-right:-(calc-em(15));
        padding-right:calc-em(15);
        &__header{
            position:relative;
            text-align:center;
            box-shadow:0 0 14px 1px rgba(0, 1, 0, .11);
            padding:calc-em(14) 0;
            margin-bottom:calc-em(70);

            &-inner {
                display:flex;
                justify-content:center;
            }

            &_padding-wrap_no {
                margin-top:-(calc-em(30));
                margin-left:-(calc-em(15));
                margin-right:-(calc-em(15));
            }
        }

        &__close {
            position:absolute;
            right:calc-em(15);
            top:0;
            margin:calc-em(15);
        }

        &__close-text-only-scr {
            @extend %visuallyhidden;
        }
        &__title{margin-bottom:0}

        &__grid{
            max-width:900px;
            margin:0 auto;
            padding:0 15px;
        }

        &__content {

        }

        &__inner{
            display:flex;
        }

        &__nav{
            padding-right:6%;
        }


        &__main{
            width:70%;
            margin:0 auto;
        }


    }
</style>
