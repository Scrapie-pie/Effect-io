<template lang="pug">
    .base-people(:class="classObject")
        base-avatar.base-people__avatar(:width="avatarWidth")
        .base-people__inner
            .base-people__header
                strong.base-people__name(v-text="name")
                time.base-people__datetime(
                v-if="datetime"
                v-text="datetime"
                )
            p.base-people__text(
            v-if="text"
            v-html="text"
            )


</template>

<script>
    export default {
        props: {
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
        display:flex;
        align-items:center;

        &__avatar{
            flex:0 0 auto;
        }

        &__inner{
            margin-left:$ml;
            border-radius:$border-raduis;
            background-color:$color_bg;
            padding:$padding;
        }

        &_bg-text_no_fill &__inner{ background-color:transparent }

        &__datetime{
            padding:0 $padding;
        }
        &__name{
            color:$color_name;
            font-weight:bold;
        }

        &_visitor &__inner, &_operator &__inner{
            background-color:transparent;
        }
    }
</style>