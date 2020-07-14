<template lang="pug">
    transition(name="fade" )
        section.box-controls(:class="'box-controls_'+type")
            .box-controls__overlay(v-if="overlay" ref="overlay")
            .box-controls__box()
                base-btn(
                    :icon="{name:'close'}",
                    @click="$emit('boxControlClose')"
                    title="Закрыть"
                ).box-controls__close
                base-icon(name="info").box-controls__icon(v-if="type==='notice'")

                p.box-controls__text
                    slot(name="text")
                slot
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            validator: function(value) {
                return ['popup', 'gallery', 'notice', ''].indexOf(value) !== -1
            },
            default: ''
        },
        overlay: {
            type: Boolean,
            default: true
        },
        show: Boolean,
        blur: Boolean
    },
    /*  watch:{
            show:{
                handler(val,oldVal){
                    if(val) {

                        setTimeout(()=>{
                            document.body
                                .classList.add('is-opened-box-controls');
                        },50)

                        //document.addEventListener('click', this.close);
                        console.log(this.$refs.overlay);
                        //this.$refs.overlay.addEventListener('click', this.close);

                    } else {
                        document.body
                            .classList.remove('is-opened-box-controls');
                        //this.$refs.overlay.removeEventListener('click', this.close);
                    }
                },
                immediate: true

            }
        },*/
    created() {
        this.$root.$on('globBoxControlClose', this.boxControlClose)
        setTimeout(() => {
            document.body.classList.add('is-opened-box-controls')
        }, 50)
    },
    mounted() {
        //console.log('mounted()', this.$refs);
        this.$refs.overlay.addEventListener('click', this.close)
    },
    /*   updated() {
            console.log('updated');
            this.$refs.overlay.addEventListener('click', this.close);
        },*/
    beforeDestroy() {
        this.$refs.overlay.removeEventListener('click', this.close)
        document.body.classList.remove('is-opened-box-controls')
        this.$root.$off('globBoxControlClose', this.boxControlClose)
    },
    methods: {
        boxControlClose(val) {
            this.$emit('boxControlClose', val)
        },
        close(e) {
            //if (!this.show) return;

            if (!e.target.matches('.box-controls__box, .box-controls__box *')) {
                this.$emit('boxControlClose')
                document.removeEventListener('click', this.close)
            }
        }
    }
}
</script>

<style lang="scss">
.box-controls {
    $self: '.box-controls';
    $color-box: glob-color('light');
    $transition: $glob-trans;
    &__box {
        &::before {
            $sz: 10px;
            content: '';
            position: absolute;
            border: $sz solid transparent;
            border-bottom: $sz solid $color-box;
            right: 0;
            bottom: 100%;
            display: none;
        }

        @include box-decor();
        position: relative;
        margin-top: calc-em(15);
        margin-bottom: calc-em(15);
        z-index: 99999;
        background-color: $color-box;

        @include media($width_md) {
            .box-controls & {
                position: fixed;
                left: 50%;
                top: 50%;
                bottom: auto;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                max-width: 90%;

                max-height: 90%;
                height: auto;
                margin: auto;
                display: inline-block;
            }

            .chat-main-footer__box-control & {
                width: 100%;
            }
        }

        #{$self}_notice &,
        #{$self}_popup & {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: inline-flex;
            flex-direction: column;

            align-items: center;
            justify-content: center;
            text-align: center;
        }
        #{$self}_notice & {
            height: 300px;
            width: 300px;
        }
    }

    &_gallery#{$self} {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        overflow: auto;

        #{$self}__box {

            left: 0;
            right: 0;

            background-color: transparent;
            text-align: center;

            align-items: center;
            justify-content: center;

            box-shadow: none;
            transform:none;
            position: static;


            display: inline-flex;
            bottom: auto;
            top: auto;
            margin: auto;

            img {
                margin-top: auto;
                margin-bottom:auto;
                position: relative;
                z-index: 9999;
            }
        }

        #{$self}__close {
            fill: glob-color('light');
            z-index: 9999;
        }
    }

    &__text {
        &:empty {
            margin: 0;
        }
        margin: calc-em(25) 0;
        word-break: break-word;
    }

    &__close {
        position: absolute;
        right: 0;
        top: 0;
        padding: 10px;
        .icon {
            width: 15px;
            height: 15px;
        }
    }

    &__overlay {
        content: '';
        @extend %full-abs;
        margin: -999em;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        background-color: rgba(0, 0, 0, 0.3);
        transition: $transition;
        transition-duration: 0.2s;
        .is-opened-box-controls & {
            opacity: 1;
            visibility: visible;
        }

        #{$self}_gallery & {
            position: fixed;
            margin: 0;
        }

        #{$self}_notice &,
        #{$self}_popup & {
            position: fixed;
            margin: 0;
        }
    }

    & &__box {
        /* @include media($width_xs) {
                left:0;right:0;top:0;bottom:0;width:100%;height:100%;
                transform:none;

            }*/
    }
}
</style>
