<template lang="pug">
    transition
        label.field(:class="classObject" v-if="type!=='select'")
            span.field__input-wrap
                span.field__label(v-if="label" v-text="label")

                textarea.field__input.field__input_textarea(
                    v-if="type==='textarea'"
                    v-bind="getInputOptions",
                    v-on="inputListeners",
                    ref="input",

                )

                input(
                    v-else
                    v-bind="getInputOptions",
                    v-on="inputListeners",
                    ref="input",
                ).field__input

                button.field__close(
                    v-if="type==='search'",
                    title="Очистить",
                    @click.prevent="clearSearch()"
                ) ×

                button.field__eye(
                    v-if="type==='password'",
                    type="button"
                    title="Показать пароль",
                    @click.prevent="togglePassword()"
                )
                    base-icon(name="eye")
                    span.field__eye-text Показать пароль

            strong.field__error(
                v-if="errors.has(name)"
                v-html="errors.first(name)"
            )

        .field(:class="classObject" v-else-if="type==='select'" ref="input")
            label.field__label(v-if="label" v-text="label")
            base-select(
                :class="{invalid_force: errors.has(name)}",

                v-bind="getSelectOptions",
                v-on="inputListeners",
            ).field__select
                template(slot="no-options") Ничего не найдено
            strong.field__error(
                v-if="errors.has(name)"
                v-html="errors.first(name)"
            )

</template>

<script>
import 'vue-select/dist/vue-select.css'
import '@/scss/base/field.scss'

import vSelect from 'vue-select' // https://github.com/sagalbot/vue-select

vSelect.props.components.default = () => ({
    Deselect: {
        render: createElement => createElement('span', '×')
    },
    OpenIndicator: {
        render: createElement => createElement('span', '')
    }
})

export default {
    components: { 'base-select': vSelect },
    inject: ['$validator'],
    inheritAttrs: false,
    props: {
        theme: {
            type: String,
            required: false,
            default: ''
        },
        select: {
            type: Boolean,
            required: false,
            default: false
        },
        selectOptions: {
            type: Object,
            required: false,
            default: () => {}
        },
        label: {
            type: String,
            required: false,
            default: ''
        },
        placeholder: {
            type: String,
            required: false,
            default: ''
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: false,
            default: 'text'
        },
        disabled: {
            type: Boolean,
            required: false,
            default: false
        },
        value: {
            required: false,
            default: ''
        },
        autocomplete: {
            type: String,
            required: false,
            default: 'new-password'
        }
    },
    data() {
        return {
            focus: false,
            options: {}
        }
    },

    computed: {
        getInputOptions() {
            let obj = {
                autocomplete: this.autocomplete,
                name: this.name,
                type: this.type,
                placeholder: this.getPlaceholder,
                value: this.value,
                disabled: this.disabled
            }
            return Object.assign({ maxLength: 64 }, this.$attrs, obj)
        },
        getSelectOptions() {
            return Object.assign(
                {
                    /*resetOnOptionsChange:false*/
                    disabled: this.disabled
                },
                this.$attrs,
                this.selectOptions,

            )
        },
        selectLoading() {
            if (this.selectOptions.options.length) return false
            return true
        },

        getPlaceholder() {
            if (this.label != '') return
            if (this.placeholder == '' && this.type == 'search') return 'Поиск'
            else return this.placeholder
        },
        classObject() {
            return {
                field_theme_soft: this.theme == 'soft',
                field_has_value: !!this.value,
                field_focus: this.focus,
                field_disabled: this.disabled,
                field_label: this.label,
                field_select: this.type == 'select',
                field_error: this.errors.has(this.name)
            }
        },

        inputListeners: function() {
            var vm = this
            // `Object.assign` объединяет объекты вместе, чтобы получить новый объект
            return Object.assign(
                {},
                // Мы добавляем все слушатели из родителя
                this.$listeners,
                // Затем мы можем добавить собственные слушатели или
                // перезаписать поведение некоторых существующих.
                {
                    // Это обеспечит, что будет работать v-model на компоненте
                    focus: function(event) {
                        vm.$emit('focus')
                        vm.focus = true
                    },
                    blur: function(event) {
                        vm.$emit('blur')
                        if (event.target.value) return
                        vm.focus = false
                    },
                    input: function(event) {
                        if (vm.type == 'select') {
                            vm.$emit('input', event)

                            return
                        }
                        vm.$emit('input', event.target.value)
                    }
                }
            )
        }
    },

    methods: {
        clearSearch() {
            this.$emit('input', '')
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
