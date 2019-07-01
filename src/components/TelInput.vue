<template lang="pug">
    div.tel-list
        input.field__input(
            ref="maskPhone"
            type="tel"
            v-bind="getInputOptions",
            v-on="inputListeners",

        )
        .tel-list__scrollbar()
            scroll-bar
                div(ref="wrapTelList")



</template>

<script>
import 'intl-tel-input/build/js/utils' //Todo отптимизировать, сделать ленивую загрузку
import intlTelInput from 'intl-tel-input'
import 'intl-tel-input/build/css/intlTelInput.min.css'

import Inputmask from 'inputmask'

export default {
    inheritAttrs: false,
    props: {
        value: {
            type: String,
            required: false,
            default: ''
        }
    },
    data() {
        return {
            iti: '',
            phone: '',
            onceUnmaskedValue: 0
        }
    },
    computed: {
        getInputOptions() {
            let obj = {
                value: this.value
            }

            return Object.assign({ maxLength: 64 }, this.$attrs, obj)
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
                    input: function(event, $event) {
                        let str =
                            vm.iti.getSelectedCountryData().dialCode +
                            '' +
                            vm.$refs.maskPhone.inputmask.unmaskedvalue()

                        vm.$emit('unmaskedvalue', str)
                        vm.$emit('input', event.target.value)
                    }
                }
            )
        }
    },
    watch: {
        value(val) {
            if (!this.onceUnmaskedValue) this.$emit('unmaskedvalue', val)
        }
    },
    created() {},
    mounted() {
        this.initTelList()
    },
    beforeDestroy() {
        if (this.$refs.maskPhone.inputmask) {
            this.$refs.maskPhone.inputmask.remove()
            this.$refs.maskPhone.removeEventListener('countrychange', this.setMask)
        }

        this.iti.destroy()
        //delete this.iti;
        //delete window.intlTelInputGlobals;
        //delete window.intlTelInputUtils;
    },
    methods: {
        initTelList() {
            this.iti = intlTelInput(this.$refs.maskPhone, {
                nationalMode: false,
                autoPlaceholder: 'off',
                preferredCountries: ['ru', 'us', 'de', 'es', 'fr'],
                dropdownContainer: this.$refs.wrapTelList,
                formatOnDisplay: false
            })
            //Todo сделать ленивую подгрузку
            this.$refs.maskPhone.addEventListener('countrychange', this.setMask)

            this.getCountryByIp()
                .then(({ data }) => {
                    console.log(data)
                    this.iti.setCountry(data.country)
                    this.setMask()
                })
                .catch(() => {
                    console.log('catch')
                    this.setMask()
                })
        },
        getCountryByIp() {
            let ipinfo = this.$http.create({
                baseURL: 'https://ipinfo.io',
                headers: { 'content-type': 'application/json' }
            })
            return ipinfo.get('')
        },
        setMask() {
            let country_data = this.iti.getSelectedCountryData(),
				format = intlTelInputUtils.getExampleNumber(country_data.iso2, false, 1),  // eslint-disable-line
                mask = format.replace('+' + country_data.dialCode, '').replace(/\d/g, '#'),
                finishMask = '+' + country_data.dialCode.replace(/9/g, '\\9') + mask

            this.phone = ''
            let settingsInputMask = {
                mask: finishMask,
                showMaskOnHover: false
            }
            Inputmask(settingsInputMask).mask(this.$refs.maskPhone)

            //this.phone=Inputmask.format(this.$store.getters['user/profile'].phones.phone, {mask:finishMask});
            //this.phone= Inputmask.format(this.phone,settingsInputMask)
        }
    }
}
</script>

<style lang="scss">
.tel-list {
    $color_border: glob-color('border');
    $border-radius: $glob-border-radius_field;
    $transition: $glob-trans;

    position: relative;
    &__scrollbar {
        @include box-decor();
        margin-top: calc-em(10);
        padding: 0;
        padding-top: calc-em(5);
        padding-bottom: calc-em(5);
        position: absolute;
        top: 100%;
        bottom: auto;
        .ps-container {
            max-height: 50vh;
        }
    }
    .intl-tel-input {
        display: block;
        position: static;

        .selected-flag {
            transition: $transition;
            border-radius: $border-radius 0 0 $border-radius;
        }

        .country-list {
            max-height: none;
            overflow: hidden;
            position: relative;
            border: 0;
            box-shadow: none;
        }
        .divider {
            border-color: $color_border;
        }
    }

    .ps__scrollbar-y-rail {
        z-index: 5;
    }
}
</style>
