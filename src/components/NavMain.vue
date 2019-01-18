<template lang="pug">
    nav.nav-main
        ul.nav-main__list
            li.nav-main__item(
            v-for="(item, index) in itemList",
            :key="index"
            )
                router-link.nav-main__link(
                :to="item.link"
                v-text="item.text"
                active-class="nav-main__link_active"
                exact
                )

</template>

<script>
    export default {
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
        padding-right:calc-em(20);
        &__item{
        }
        &__link{
            border-left:3px solid transparent;
            color:$color-text;
            padding:$padding;
            white-space:nowrap;
            text-decoration:none;
            display:block;

            &_active{
                border-color:$color-border;
                background-color:$color-bg;
            }
        }
    }
</style>