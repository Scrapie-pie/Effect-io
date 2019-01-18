<template lang="pug">

    label.radio-check(:class="[`radio-check_${type}`, {'radio-check_tab': tab },{'radio-check_error': errors.has(name)}]")
        input(
        v-bind="$attrs",
        :value="value"
            :type="type",
        :name="name",
        @checked="checked"
        v-on="inputListeners",
        :checked="checked"
        ).radio-check__input
        span.radio-check__text
            base-icon(name="check" v-if="type=='checkbox'").radio-check__check
            slot

</template>

<script>
    export default {
        name: 'radio-check',
        inject: ['$validator'],
        inheritAttrs: false,
        model: {
            prop: 'checked',
            event: 'change'
        },
        props: {
            tab: {
                required: false,

                default: false

            },
            value: {
                required: false,
                default: 1
            },
            name: {
                required: true
            },
            type: {
                required: false,
                default: 'checkbox'
            },
            disabled: {
                required: false,
                default: false
            },
            checked: {
                required: false,
                default: false
            }

        },

        mounted() {
            // this.$emit('input', this.checked)
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
                            if (vm.type == 'radio') {
                                return vm.$emit('input', event.target.value)
                            }
                            vm.$emit('input', event.target.checked)
                        },
                        change: function (event) {
                            if (vm.type == 'radio') {
                                return vm.$emit('change', event.target.value)
                            }
                            vm.$emit('change', event.target.checked)
                        }
                    }
                )
            }
        }
    }
</script>

<style lang="scss">


    .radio-check{
        $self:&;
        $sz:calc-em(24);
        &__input{
            @extend %visuallyhidden;

            &:checked ~ #{$self}__text{
                #{$self}__check{
                    transform:scale(1);
                }
            }
        }
        &__text{
            position:relative;
            display:flex;
            align-items:center;

            &:before{
                content:'';
                display:block;
                width:$sz;
                height:$sz;
                border:1px solid glob-color('border');
                margin-right:calc-em(15);
            }
            &:after{
                content:'';
                display:block;
            }
        }
        &__check{
            position:absolute;
            left:0;
            top:0;
            margin-top:.4em;
            margin-left:.4em;
            transform:scale(0);
            transition:$glob-trans;

            .icon{
                width:15px;
                height:15px;
            }
        }

    }
</style>
