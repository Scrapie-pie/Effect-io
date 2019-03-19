<template lang="pug">
    aside.nav-aside
        slot
</template>

<script>
export default {
    data() {
        return {}
    },   
}
</script>

<style lang="scss">
    .nav-aside{
        $color_border:glob-color('border');
        $color_bg:glob-color('info-lighten');
        $sz:calc-em(30);

        width:275px;
        background-color:$color_bg;
        border-right:1px solid $color_border;

        padding:$sz 0 ;
        margin:($sz * -1) 0 ;
        margin-left:-($sz / 2);

        @include media($width_lg){
            width:190px;
        }

    }
</style>