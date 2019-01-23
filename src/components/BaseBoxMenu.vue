<template lang="pug">
    transition(name="fade")
        section.base-box-menu(v-if="show")
            base-btn(
                :icon="{name:'close'}",
                @click="$emit('base_box_menu_close')"
            ).base-box-menu__close
            slot
</template>

<script>
    export default {
        props: {
            show:false,
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
        },
    }
</script>

<style lang="scss">
    .base-box-menu {
        @include box-decor();
        position:absolute;
        margin-top:calc-em(15);
        margin-bottom:calc-em(15);
        z-index:1;
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
    }
</style>