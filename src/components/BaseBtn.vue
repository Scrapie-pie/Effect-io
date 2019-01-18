<template lang="pug">
    transition
        router-link(v-on="inputListeners" ,:class="classObject", :disabled="disabled" v-if="isRouter", :to="compRouterName")
            slot
        button(v-on="inputListeners", :type="type", :class="classObject" :disabled="disabled" ref="btn")
            template(v-if="icon")
                base-icon(:name="icon.name")
            slot
</template>

<script>
    import _ from 'underscore'

    export default {
        props: {
            icon: {},


            loaded: {
                required: false,
                default: true
            },
            theme: {
                required: false,
                default: ''
            },
            mode: {
                required: false,
                default: false
            },
            router: {
                required: false,
                default: ''
            },
            type: {
                required: false,
                default: 'button'
            },
            disabled: {
                required: false,
                default: false
            },
            value: {
                required: false,
                default: ''
            }

        },
        computed: {
            isRouter() {
                return !_.isEmpty(this.router)
            },
            compRouterName() {
                return this.router
            },

            classObject() {

                let obj = {
                    'btn': true,
                    'btn btn_default': this.theme == 'default',
                    'btn btn_sign': this.theme == 'sign',
                    'spinner spinner_sm': this.loaded
                }


                if (!_.isEmpty(this.icon)) {
                    obj['btn_' + this.icon.name] = true;
                }

                console.log(obj);
                return obj
            },
            inputListeners: function () {
                var vm = this
                // `Object.assign` объединяет объекты вместе, чтобы получить новый объект

                return Object.assign({},
                    // Мы добавляем все слушатели из родителя
                    this.$listeners,
                    // Затем мы можем добавить собственные слушатели или
                    // перезаписать поведение некоторых существующих.
                    {}
                )
            }
        }
    }
</script>

<style lang="scss">
    .btn{
        display:inline-block;
        vertical-align:top;
        font-weight:500;
        line-height:1.2;
        border:1px solid transparent;
        cursor:pointer;
        position:relative;
        text-align:center;

        &_block{
            width:100%;
        }

        &_sign{
            color:glob-color('light');
            border:0;
            box-shadow:0 -1px 14px 2px rgba(222, 163, 31, .53);
            font-weight:bold;
            background:#ff783c;
            background:linear-gradient(to right, #ff783c 0%, #ffb815 100%);
            padding:1em 2em;
            border-radius:2em;
        }
    }
</style>