<template lang="pug">
    transition(name="fade" )
        section.box-controls(v-if="show", :class="{'box-controls_popup':popup,'box-controls_gallery':gallery}")
            .box-controls__overlay()
            .box-controls__box()
                base-btn(
                    :icon="{name:'close'}",
                    @click="$emit('box_control_close')"
                    title="Закрыть"
                ).box-controls__close
                p.box-controls__text
                    slot(name="text")
                slot

</template>

<script>
    export default {
        props: {
            show:Boolean,
            popup:Boolean,
            gallery:Boolean,
            blur:Boolean
        },
        watch:{
            show(val){
                if(val) {
                    document.body
                        .classList.add('is-opened-box-controls');
                } else {
                    document.body
                        .classList.remove('is-opened-box-controls');
                }
            }
        },
        methods: {

            close(e) {

                if (!this.show) return

                if (!e.target.matches('.box-controls__box, .box-controls__box *')) {
                    this.$emit('box_control_close')

                    document.removeEventListener('click', this.close);
                }
            },

        },
        created(){

        },
        mounted() {
            document.addEventListener('click', this.close);
        },
        updated() {
            document.addEventListener('click', this.close);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.close);
            document.body.classList.remove('is-opened-box-controls');
        },
    }
</script>

<style lang="scss">


/*    .chat-dialog__main {
        &::after {
            content:'';
            @extend %full-abs;
            position:fixed;
            background-color:rgba(0, 0, 0, 0.3);
            opacity:0;
            visibility:hidden;
            transition:$glob-trans;
            z-index: 1;
        }


    }
    .is-opened-box-controls .chat-dialog__main::after {
        opacity:1;
        visibility:visible;
    }*/

    .box-controls {
        $self:'.box-controls';
        $color-box:glob-color('light');
        &__box {
            &::before {
                $sz:10px;
                content:'';
                position:absolute;
                border: $sz solid transparent;	border-bottom: $sz solid $color-box;
                right: 0;
                bottom: 100%;
                display:none;
            }

            @include box-decor();
            position:relative;
            margin-top:calc-em(15);
            margin-bottom:calc-em(15);
            z-index:99999;
            background-color:$color-box;

            #{$self}_popup & {
                position:fixed;
                left:50%;
                top:50%;
                transform:translate(-50%,-50%);
                display:flex;
                flex-direction:column;
                height:300px;
                width:300px;
                align-items:center;
                justify-content:center;
                text-align:center;
            }




        }


        &_gallery {
            #{$self}__box {
                position: fixed;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: 0;
                background-color: transparent;
                text-align:center;


                img {
                    max-height:100%;
                }

            }

            #{$self}__close {
                fill:glob-color('light');
            }
        }

    /*    &__gallery {
            @extend %full-abs;
            position:fixed;
            z-index:9999;
            padding:calc-em(30);
            text-align:center;
            img {max-height:100%}

        }
        &_gallery &__close {
            fill:glob-color('light');
        }
*/


        &__text {
            &:empty {
                margin:0;
            }
            margin:calc-em(25) 0;
        }


        &__close {
            position:absolute;
            right:0;
            top:0;
            padding:10px;
            .icon {
                width:15px;
                height:15px;

            }
        }


        &__overlay{
            content:'';
            @extend %full-abs;
            margin:-999em;
            z-index:1;
            opacity:0;
            visibility:visible;
            background-color:rgba(0, 0, 0, 0.3);

            .is-opened-box-controls & {
                opacity:1;
                visibility:visible;
            }

            #{$self}_gallery & {
                position:fixed;
                margin:0;
            }

            #{$self}_popup & {
                position:fixed;
                margin:0;
            }

        }


    }



</style>