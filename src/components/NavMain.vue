<template lang="pug">
    nav.nav-main
        ul.nav-main__list
            li.nav-main__item(
            v-for="(item, index) in itemList",
            :key="index"
            )
                router-link.nav-main__link(
                :to="item.link"
                active-class="nav-main__link_active"
                exact
                )
                    | {{item.text}}
                    base-count.nav-main__count(:count="item.count")


</template>

<script>

    import BaseCount from '@/components/BaseCount';
    export default {
        components: {
            BaseCount
        },
        props: {
            itemList: {}
        }

    }
</script>

<style lang="scss">
    .nav-main{
        $color-border:glob-color('info');
        $color-bg:glob-color('info-lighten');
        $color-text:glob-color('secondary');
        $padding:calc-em(8) calc-em(26);

        //width:calc-em(175);

        &__item{
        }
        &__link{
            border-left:3px solid transparent;
            color:$color-text;
            padding:$padding;
            white-space:nowrap;
            text-decoration:none;
            display:block;
            padding-right:calc-em(20);

            @include media($width_md){
            }

            &_active{
                border-color:$color-border;
                background-color:$color-bg;
                font-weight:700;
            }
        }
        &__count{
            margin-left:4px;
        }
    }
</style>