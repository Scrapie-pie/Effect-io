<template lang="pug">
    nav.nav-main
        ul.nav-main__list
            li.nav-main__item(
                v-for="(item, index) in itemList",
                :key="index",
                :class="'nav-main__item_'+item.link.name",
            )
                router-link.nav-main__link(

                :to="item.link"
                active-class="nav-main__link_active"
                :exact="item.exact"

                )
                    span.nav-main__text(v-text="item.text")

                    span.nav-main__icon
                        base-icon(v-if="item.icon" :name="item.icon")
                        base-icon(v-else :name="item.link.name")
                    base-count.nav-main__count(:count="item.unread")

</template>

<script>

    import BaseCount from '@/components/BaseCount';
    export default {
        components: {
            BaseCount
        },
        props: {
            itemList: {}
        },
        methods:{

        }


    }
</script>

<style lang="scss">
    .nav-main{
        $self:'.nav-main';
        $color-border:glob-color('info');
        $color-bg:glob-color('info-lighten');
        $color-bg-tooltip:glob-color('light');
        $border-radius:$glob-border-radius;
        $color-text:glob-color('secondary');
        $padding:calc-em(8) calc-em(26);

        //width:calc-em(175);

        &__item{
        }
        &__link{
            position:relative;
            border-left:3px solid transparent;
            color:$color-text;
            padding:$padding;
            white-space:nowrap;
            text-decoration:none;
            display:block;
            padding-right:calc-em(20);

            @include media($width_lg){
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

        &__icon{
            display:none;
            .icon{
                width:28px;
                height:28px;
            }

        }

        @include media($width_lg){
            &__link{
                padding-left:calc-em(20);
                padding-right:calc-em(20);
                border-color:transparent;
                text-align:center;

                .page_hasHover &:hover #{$self}__text{
                    transform:scale(1);
                }
            }

            &__text{
                @include box-decor();
                position:absolute;
                left:50%;
                bottom:100%;
                z-index:10;
                display:inline-block;
                padding:5px;
                transform:scale(0);
            }

            &__icon{
                display:block;
            }

            &__count{
                position:absolute;
                right:1em;
                bottom:100%;
                margin-top:3px;
            }
        }




    }
</style>