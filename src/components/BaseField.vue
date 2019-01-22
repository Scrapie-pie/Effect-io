<template lang="pug">
    transition
        label.field(:class="classObject" v-if="type!='select'")
            span.field__input-wrap
                span.field__label(v-if="label" v-text="label")

                input(
                autocomplete="off"
                v-bind="$attrs",
                :value="value",
                :name="name",
                :disabled="disabled",
                v-on="inputListeners",
                :placeholder="getPlaceholder",
                :type="getType"
                ref="input",
                @blur="$emit('blur')",
                @focus="$emit('focus')"
                ).field__input



                button.field__close(
                v-if="type=='search'",
                title="Очистить",
                @click.prevent="clearSearch()"
                ) ×

                button.field__eye(
                v-if="type=='password'",
                type="button"
                title="Показать пароль",
                @click.prevent="togglePassword()"
                )
                    base-icon(name="eye")
                    span.field__eye-text Показать пароль

            strong.field__error(v-if="errors.has(name) && type!='amount'" v-html="errors.first(name)")

        .field(:class="classObject" v-else-if="type=='select'"    ref="input")
            label.field__label(v-if="label" v-text="label")
            base-select(
                :class="{invalid_force: errors.has(name)}"
            autocomplete="off",
            key="id"

            v-bind="getSelectOptions",
            v-on="inputListeners",


            ).field__select
                span(slot="no-options")
                //template(slot="no-options") Результат 0

</template>

<script>

    import moment from 'moment'

    import Inputmask from 'inputmask'
    // import '@/assets/js/phone-ru'

    import vSelect from 'vue-select' // https://github.com/sagalbot/vue-select
    export default {
        components: {'base-select': vSelect},
        inject: ['$validator'],
        inheritAttrs: false,
        props: {
            theme: String,
            select: {
                required: false,
                default: false
            },
            selectOptions: {
                required: false,
                default: false
            },
            label: {
                required: false,
                default: ''
            },
            placeholder: {
                required: false,
                default: ''
            },
            name: {
                required: true
            },
            type: {
                required: false,
                default: 'text'
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
        data() {
            return {
                focus: false,
                options: {},
                mapMask: {
                    passport: '9999 999999',
                    passportCode: '999-999',

                    index: '999999',
                    snils: '999-999-999 99',
                    inn: '999999999999',
                    birthdate: '99.99.9999',
                    dateIssue: '99.99.9999',
                    phone: '+7 (999) 999 99 99',
                    email: {
                        alias: 'email',
                        disablePredictiveText: true,
                        placeholder: '',
                        showMaskOnHover: false
                    },
                    bic: '999999999',
                    accCorr: '99999999999999999999',
                    accCheck: {
                        mask: '99999.999.9.99999999999',
                        autoUnmask: true,
                        showMaskOnHover: false
                    },
                    accPers: {
                        mask: '99999.999.9.99999999999',
                        autoUnmask: true,
                        showMaskOnHover: false
                    }
                }
            }
        },
        mounted() {

            /*    if (this.label) {
                let divClosest = this.$refs.input.closest('.form__item')
                if (divClosest) {
                  divClosest.classList.add('form__item_field_label')
                }
              }*/
            this.$nextTick(() => {
                if (this.mapMask[this.name]) {
                    if (this.name == 'email' && this.mobileOS == 'Android') return

                    Inputmask(this.mapMask[this.name], {showMaskOnHover: false}).mask(this.$refs.input)
                }

                if (this.type == 'date') {
                    this.$refs.input.DatePickerX.init({
                        maxDate: moment().subtract(18, 'year').toDate()
                    })
                }

                if (this.name == 'acc' || this.name == 'accCheck') {
                    this.$refs.input.addEventListener('copy', this.handleCopy)
                }
            })
        },
        beforeDestroy() {
            if (this.$refs.input && this.$refs.input.inputmask) this.$refs.input.inputmask.remove()
            if (this.name == 'acc' || this.name == 'accCheck') {
                this.$refs.input.removeEventListener('copy', this.handleCopy)
            }
        },

        computed: {
            getSelectOptions() {
                return Object.assign({}, this.$attrs, this.selectOptions);
            },
            selectLoading() {
                if (this.selectOptions.options.length) return false
                return true
            },
            getType() {
                if (this.type == 'date' || this.type == 'amount') return 'text'

                return this.type
            },
            getPlaceholder() {
                if (this.label != '') return;
                if (this.placeholder == '') return 'Поиск';
                else return this.placeholder
            },
            classObject() {
                return {
                    'field_theme_soft': this.theme == 'soft',
                    'field_has_value': !!this.value,
                    'field_focus': (this.focus),
                    'field_disabled': this.disabled,
                    'field_label': this.label,
                    'field_select': this.type == 'select',
                    'field_error': this.errors.has(this.name)
                }
            },

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
                        focus: function (event) {
                            vm.$emit('focus');
                            vm.focus = true
                        },
                        blur: function (event) {
                            vm.$emit('blur');
                            if (event.target.value) return
                            vm.focus = false
                        },
                        input: function (event) {

                            if (vm.type == 'amount') {
                                vm.$emit('input', vm.amountInput(event.target.value))
                                return
                            }

                            if (vm.type == 'select') {
                                vm.$emit('input', event)

                                return
                            }
                            vm.$emit('input', event.target.value)
                        },
                        change: function (event) {
                            if (vm.type == 'date') {
                                vm.$emit('input', event.target.value)
                            }
                        },
                        keydown: function (event) {
                            if (vm.type == 'date') {
                                if (event.keyCode == 9) {
                                    setTimeout(() => {
                                        if (event.target.nextSibling.classList.contains('active')) event.target.click()
                                    }, 200)
                                }
                            }
                        }

                    }
                )
            }
        },

        methods: {
            handleCopy(e) {
                e.clipboardData.setData('text/plain', e.target.value)
                e.preventDefault()
            },
            togglePassword() {
                let el = this.$refs.input

                let tp = el.getAttribute('type')

                if (tp == 'password') el.setAttribute('type', 'text')
                else el.setAttribute('type', 'password')
            }
        }

    }

</script>

<style lang="scss">

</style>
