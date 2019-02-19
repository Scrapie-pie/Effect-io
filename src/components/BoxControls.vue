<template lang="pug">
    transition(name="fade" )
        section.box-controls(v-if="show", :class="{'box-controls_popup':type}")
            .box-controls__overlay()
            .box-controls__box()
                base-btn(
                    :icon="{name:'close'}",
                    @click="$emit('boxControlClose')"
                    title="Закрыть"
                ).box-controls__close
                base-icon(name="info").box-controls__icon(v-if="type==='popup'")

                p.box-controls__text
                    slot(name="text")
                slot
</template>

<script>
    export default {
        props: {
            type:{
                type:String,
                validator: function (value) {
                    return ['popup','gallery'].indexOf(value) !== -1
                }
            },
            show:Boolean,
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
        created(){
            this.$root.$on('globBoxControlClose',()=>{
                this.$emit('boxControlClose')
            })
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
        methods: {

            close(e) {
                if (!this.show) return;

                if (!e.target.matches('.box-controls__box, .box-controls__box *')) {
                    this.$emit('boxControlClose');
                    document.removeEventListener('click', this.close);
                }
            },

        },

    }
</script>

<style lang="scss">
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
                    width:100%;
                }

            }

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

        &__text {
            &:empty {
                margin:0;
            }
            margin:calc-em(25) 0;
            word-break: break-word;
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
            z-index:999;
            opacity:0;
            visibility:hidden;
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