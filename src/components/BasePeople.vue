<template lang="pug">
    .base-people(:class="classObject")
        .base-people__avatar-wrap
            base-avatar.base-people__avatar(:width="avatarWidth")
            base-icon(:name="channelName").base-people__channel
        .base-people__inner
            .base-people__header
                strong.base-people__name(v-text="name")
                time.base-people__datetime(
                v-if="datetime"
                v-text="datetime"
                )
                base-count.base-people__count(:count="count")
            p.base-people__text(
            v-if="text"
            v-html="text"
            )


</template>

<script>
    import BaseCount from '@/components/BaseCount';
    export default {
        components: {
            BaseCount
        },
        props: {
            channelName: '',
            count: 0,
            bgTextNoFill: false,
            name: '',
            text: '',
            datetime: '',
            avatarWidth: '',
            type: {
                validator: function (value) {
                    return ['visitor', 'operator'].indexOf(value) !== -1
                }
            }
        },
        data() {
            return {}
        },
        created() {


        },
        computed: {
            classObject() {
                let parentClass = 'base-people';
                if (this.bgTextNoFill) return `${parentClass}_bg-text_no_fill`;
                if (this.type) return `${parentClass}_${this.type}`;
            }
        }
    }
</script>

<style lang="scss">
    .base-people{
        $ml:calc-em(5);
        $border-raduis:$glob-border-radius;
        $padding:calc-em(15);
        $color_bg:glob-color('info-light');
        $color_name:glob-color('secondary');
        $small:$glob-font-size_small;
        display:flex;
        align-items:center;

        /* width:100%;*/

        &__count{
            float:right;
        }

        &__avatar{
            flex:0 0 auto;
        }

        &__avatar-wrap{
            display:inline-block;
            position:relative;
        }
        &__channel{
            position:absolute;
            bottom:-3px;
            right:-3px;
            z-index:1;
            .icon{
                width:24px;
                height:24px;
            }
        }

        &__inner{
            margin-left:$ml;
            border-radius:$border-raduis;
            background-color:$color_bg;
            padding:$padding;

        }

        &_bg-text_no_fill &__inner{ background-color:transparent }

        &__datetime{
            padding:0 ($padding / 2);
            font-size:$small;
        }
        &__name{
            color:$color_name;
            font-weight:bold;
        }

        &__text{
            white-space:nowrap;
            text-overflow:ellipsis;
            overflow:hidden;
        }

        &_visitor &__inner, &_operator &__inner{
            background-color:transparent;
        }
    }
</style>