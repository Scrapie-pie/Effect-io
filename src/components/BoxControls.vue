<template lang="pug">
    transition(name="fade")
        section.box-controls(v-if="show", :class="{'box-controls_popup':popup}")
            .box-controls__box
                base-btn(
                    :icon="{name:'close'}",
                    @click="$emit('base_box_menu_close')"
                ).box-controls__close
                p.box-controls__text
                    slot(name="text")
                slot

            .box-controls__overlay
</template>

<script>
    export default {
        props: {
            show:Boolean,
            popup:Boolean
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

                if (!e.target.matches('.box-controls, .box-controls *')) {
                    this.$emit('base_box_menu_close')
                    console.log('base_box_menu_close');
                    document.removeEventListener('click', this.close);
                }
            },

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




    .box-controls {
        $self:&;
        &__box {
            @include box-decor();
            position:relative;
            margin-top:calc-em(15);
            margin-bottom:calc-em(15);
            z-index:9999;
            background-color:glob-color('light');

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
            position:fixed;
            background-color:rgba(0, 0, 0, 0.3);
            z-index:999;
            opacity:0;
            visibility:hidden;
            transition:$glob-trans;
            transition-property:background-color;

            .is-opened-box-controls & {
                opacity:1;
                visibility:visible;
            }

        }
    }
</style>