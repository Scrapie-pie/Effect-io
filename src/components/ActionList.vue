<template lang="pug">
    ul.action-list
        li.action-list__item(
            v-for="(item, index) in itemList",
            :key="index"
        )
            label.action-list__button
                input(
                    type="radio",
                    :name="item.name",
                    :value="item.value",
                    v-on="inputListeners"
                ).action-list__input
                span.action-list__text(v-text="item.text")
</template>

<script>
    export default {
        inheritAttrs: false,
        props:{
            itemList:{
                type:Array,
                default:[]
            },
            value:''
        },
        data(){
            return {
                model:''
            }
        },
        computed: {
            inputListeners: function () {
                var vm = this
                // `Object.assign` объединяет объекты вместе, чтобы получить новый объект
                return Object.assign({},
                    // Мы добавляем все слушатели из родителя
                    this.$listeners,
                    // Затем мы можем добавить собственные слушатели или
                    // перезаписать поведение некоторых существующих.
                    {
                        // Это обеспечит, что будет работать v-model на компоненте
                        input: function (event) {
                            console.log(event);
                            vm.$emit('input', event.target.value)
                        }
                    }
                )
            }
        },
    }
</script>

<style lang="scss">
    .action-list{
        $self:&;
        $color-border:glob-color('info');
        $color-bg:glob-color('info-lighten');
        $transition:$glob-trans;
        $color-text:glob-color('secondary');
        $padding:calc-em(8) calc-em(25);

        &__input {
            @extend %visuallyhidden;

            &:checked ~ #{$self}__text {
                border-color:$color-border;
                background-color:$color-bg;
                font-weight:700;
            }
        }

        &__button{
            display:inline-block;
        }
        &__text{
            transition:$transition;
            position:relative;
            border:0;
            border-left:3px solid transparent;
            background-color:transparent;
            color:$color-text;
            padding:$padding;
            white-space:nowrap;
            text-decoration:none;
            display:block;
        }
    }
</style>