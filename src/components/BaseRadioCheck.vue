<template lang="pug">

    label.radio-check(:class="[`radio-check_${type}`,{'radio-check_error': errors.has(name)}]")
        input(
            v-bind="getInputOptions",
            v-on="inputListeners",
        ).radio-check__input
        span.radio-check__text-wrap
            base-icon(name="check").radio-check__check
            span.radio-check__text
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
       /*     textTrue:null,
            textFalse:null,*/
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
            },


        },

        computed: {
            getInputOptions() {

                let checked = this.checked
                if(this.type==="radio") checked=  this.checked === this.value
                let obj = {
                  /*  textTrue:this.textTrue,
                    textFalse:this.textFalse,*/

                    type: this.type,
                    checked: checked,
                    value:this.value,
                    name:this.name
                }

                return Object.assign({},this.$attrs,  obj);
            },
            inputListeners: function () {
                var vm = this
                return Object.assign({},
                    this.$listeners,
                    {
                        change: function (event) {
                            if (vm.type == 'radio') {
                                return vm.$emit('change', vm.value)
                            }

                            if(event.target.checked) vm.$emit('change', 1) // На сервере строгая типизация
                            else vm.$emit('change', 0)


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
        $color_border:glob-color('border');
        $color_main:glob-color('main');
        $transition:$glob-trans;

        &__input{
            @extend %visuallyhidden;

            &:checked ~ #{$self}__text-wrap{
                #{$self}__check{
                    transform:scale(1);
                }
            }
        }
        &__text:not(:empty) {

            margin-left:calc-em(15);
        }
        &__text-wrap{
            position:relative;
            display:flex;
            align-items:center;

            &::before{
                content:'';
                display:block;
                width:$sz;
                height:$sz;
                border:1px solid $color_border;
                border-radius:50%;
            }

            &::after{
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
            transition:$transition;

            .icon{
                width:15px;
                height:15px;
                fill:$color_main
            }
        }

    }
</style>
