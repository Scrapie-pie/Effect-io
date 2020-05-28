<template lang="pug">
    scroll-bar.layout.ps(ref="scrollbarLayout")
        header.layout__header(:class="{'layout__header_padding-wrap_no':headerPaddingNo}")
            .layout__grid
                h1.layout__title
                    slot(name="title")
            .layout__close(@click="$emit('close')" title="Выход")
                span.layout__close-text-only-scr Выход
                base-icon(name="close")
        .layout__grid
            .layout__inner
                .layout__nav
                    slot(name="nav")
                .layout__main
                    transition(name="fade" mode="out-in")
                        slot(name="main")



</template>

<script>
    import {scrollbar} from "@/mixins/mixins";

    export default {
    mixins:[scrollbar],
    props: {
        headerPaddingNo: Boolean
    },
    data() {
        return {}
    },
    watch:{
        '$route'(){


            this.scrollbarScrollerPush(this.$refs.scrollbarLayout,0)
        }
    },
    created() {},
    methods:{

    },
    mounted() {

    }
}
</script>

<style lang="scss">
.layout {
    margin-right: -(calc-em(15));
    padding-right: calc-em(15);
    /* overflow:auto;*/
    position: relative;
    overflow: hidden;
    &__header {
        position: relative;
        text-align: center;
        box-shadow: 0 0 14px 1px rgba(0, 1, 0, 0.11);
        padding: calc-em(14) 0;
        margin-bottom: calc-em(70);

        &-inner {
            display: flex;
            justify-content: center;
        }

        &_padding-wrap_no {
            margin-top: -(calc-em(30));
            margin-left: -(calc-em(15));
            margin-right: -(calc-em(15));
        }
    }

    &__close {
        position: absolute;
        right: calc-em(15);
        top: 0;
        margin: calc-em(15);
        cursor:pointer;
    }

    &__close-text-only-scr {
        @extend %visuallyhidden;
    }
    &__title {
        margin-bottom: 0;
    }

    &__grid {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 15px;
        width: 100%;
    }

    &__content {
    }

    &__inner {
        display: flex;
    }

    &__nav {
        padding-right: 6%;
    }

    &__main {
        width: 70%;
        margin: 0 auto;
        position: relative;
    }

    .settings-list {
        .field {
            min-width: auto;
        }
        &__name {
            $color: glob-color('main');
            font-weight: 600;
            opacity: 0.8;
            font-size: inherit;
            margin-bottom: calc-em(20);
        }

        &__name,
        &__text-info {
            padding-left: calc-em(15);
        }

        &__item {
            margin-bottom: calc-em(45);
        }
        &__text-info {
            margin-top: calc-em(20);

            &_sub {
                margin-bottom: calc-em(35);
            }
        }

        &__select {
            width: 100%;
            max-width: 276px;
        }
        &__field {
            max-width: 276px;
            width: 100%;
        }
        &__textarea {
            max-width: 362px;
            width: 100%;
        }

        &__name-wrap {
            display: flex;
            justify-content: space-between;
        }

        &__sub {
        }
        &__sub-item {
            margin-bottom: calc-em(20);
        }

        &__row {
            display: flex;
            align-items: center;
            margin: 0 (calc-em(10) * -1);
        }
        &__col {
            padding-left: calc-em(10);
            padding-right: calc-em(10);
        }
    }
}
</style>
