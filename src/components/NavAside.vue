<template lang="pug">
    nav.nav-aside
        slot
        ul.nav-aside__list(v-if="$slots.item")
            li(class="nav-aside__item" v-for="link in $slots.item")
                vnode(:node="link").nav-aside__link
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>

<style lang="scss">
/*  .push-left {
        &-enter,&-leave-to {
            transform:translateX(-275px);
        }
        &-enter-to,&-leave {

            transform:translateX(0);
        }
        &-enter-active,&-leave-active {
            transition:$glob-trans;
        }
    }*/
.nav-aside {
    $color_border: glob-color('border');
    $color_bg: glob-color('info-lighten');
    $color_bg_active: glob-color('border');
    $color_link: glob-color('main');
    $sz: calc-em(30);

    width: 275px;

    background-color: $color_bg;
    border-right: 1px solid $color_border;

    padding: $sz 0;
    margin: ($sz * -1) 0;
    margin-left: -($sz / 2);

    @include media($width_lg) {
        width: 190px;
    }

    @include media($width_xs) {
        width: 100%;
        margin: 0;
        padding: 10px 0 0;
    }

    &__link {
        text-decoration: none;
        color: $color_link;
        display: block;
        padding: calc-em(20) calc-em(30);
        &.router-link-active,
        &:hover {
            background-color: $color_bg_active;
        }
    }
}
</style>
