<template lang="pug">
    .context-menu
        .context-menu__target(@click.prevent="toggle")
            slot
        transition(name="fade")
            ul.context-menu__list(v-if="show")
                li.context-menu__item
                    slot(name="listItem")
                //li.context-menu__item
                    router-link.context-menu__link(:to="{name:'settingsApp',query: { user_id: 151 }}") Редактировать
</template>

<script>
    export default {
        name: "context-menu",
        data() {
            return {
                show: false
            }
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
        methods: {
            close(e) {
                if (!e.target.matches('.context-menu, .context-menu *')) {
                    this.show = false;
                    document.removeEventListener('click', this.close);
                }
            },
            toggle() {
                this.show = !this.show;
            }
        }
    }
</script>

<style lang="scss">
    .context-menu{
        $font-size:$glob-font-size_h2;
        position:relative;
        &__list{
            @include box-decor();
            display:inline-block;
            position:absolute;
            top:100%;
            left:0;
            z-index:1;
        }

        &__link{ font-size:$font-size;}
    }


</style>