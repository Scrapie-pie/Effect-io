<template lang="pug">
    transition(name="fade")
        section.base-box-menu-wrap(v-if="show")
            .base-box-menu
                base-btn(
                    :icon="{name:'close'}",
                    @click="$emit('base_box_menu_close')"
                ).base-box-menu__close
                slot
            .base-box-menu-overlay
</template>

<script>
    export default {
        props: {
            show:false,
        },
        watch:{
            show(val){
                if(val) {
                    document.getElementsByTagName('html')[0]
                        .classList.add('is-opened-base-box-menu');
                } else {
                    document.getElementsByTagName('html')[0]
                        .classList.remove('is-opened-base-box-menu');
                }
            }
        },
        methods: {
            close(e) {

                if (!this.show) return
                console.log(e.target);
                if (!e.target.matches('.base-box-menu, .base-box-menu *')) {
                    this.$emit('base_box_menu_close')
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
            document.getElementsByTagName('html')[0]
                .classList.remove('is-opened-base-box-menu');
        },
    }
</script>

<style lang="scss">




    .base-box-menu {

            @include box-decor();
            position:relative;
            margin-top:calc-em(15);
            margin-bottom:calc-em(15);
            z-index:9999;
            background-color:glob-color('light');


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


        &-overlay{
            content:'';
            @extend %full-abs;
            position:fixed;
            background-color:rgba(0, 0, 0, 0.3);
            z-index:999;
            opacity:0;
            visibility:hidden;
            transition:$glob-trans;

            .is-opened-base-box-menu & {
                opacity:1;
                visibility:visible;
            }

        }
    }
</style>