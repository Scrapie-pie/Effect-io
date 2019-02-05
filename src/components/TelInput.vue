<template lang="pug">
    div.tel-list
        input.field__input(ref="maskPhone" type="text" v-model="phone" key="maskPhone")
        .tel-list__scrollbar()
            scroll-bar
                div(ref="wrapTelList")


    
</template>


    <script>

import 'intl-tel-input/build/js/utils'
import intlTelInput from 'intl-tel-input'
import 'intl-tel-input/build/css/intlTelInput.min.css'

import Inputmask from "inputmask";

export default  {
    watch:{

    },
    computed: {

    },
    mounted() {
        this.initTelList()

    },
    beforeDestroy(){
        this.$refs.maskPhone.inputmask.remove()
        this.$refs.maskPhone.removeEventListener("countrychange", this.setMask);
        this.iti.destroy();
        window.intlTelInputGlobals='';


    },
    data() {
        return {
            iti:'',
            phone:'',
        }

    },
    created(){



    },
    methods: {
        initTelList(){
            this.iti = intlTelInput(this.$refs.maskPhone,{
                nationalMode:false,
                autoPlaceholder:'off',
                preferredCountries:['ru','us', 'de', 'es','fr'],
                dropdownContainer:this.$refs.wrapTelList
            });
            window.intlTelInputGlobals = intlTelInputUtils; //Todo сделать ленивую подгрузку
            this.$refs.maskPhone.addEventListener("countrychange", this.setMask);

            this.getCountryByIp().then(({data})=>{
                this.iti.setCountry(data.country)
                this.setMask()
            })
        },
        getCountryByIp(){
            let ipinfo = this.$http.create({
                baseURL: 'https://ipinfo.io',
                headers: {'content-type': 'application/json'}
            })
            return ipinfo.get('')
        },
        setMask(){
            let country_data = this.iti.getSelectedCountryData(),
                format       = intlTelInputGlobals.getExampleNumber(country_data.iso2, false, intlTelInputGlobals.numberType.MOBILE),
                mask         = format.replace('+' + country_data.dialCode, '').replace(/\d/g, '#'),
                finishMask = '+' + country_data.dialCode.replace(/9/g, '\\9') + mask;

            this.phone='';

            Inputmask({
                mask:finishMask,
                showMaskOnHover:false
            }).mask(this.$refs.maskPhone)

        },
    },
    
}
</script>

<style lang="scss">
    .tel-list {
        $color_border:glob-color('border');
        $border-radius:$glob-border-radius_field;
        $transition:$glob-trans;

        position:relative;
        &__scrollbar {

            @include box-decor();
            margin-top:calc-em(10);
            padding:0;
            padding-top:calc-em(5);
            padding-bottom:calc-em(5);
            position:absolute;
            top:100%;bottom:auto;
            .ps-container {
                max-height:50vh;
            }
        }
        .intl-tel-input {
            display:block;
            position:static;

            .selected-flag{
                transition:$transition;
                border-radius:$border-radius 0 0 $border-radius;
            }

            .country-list{max-height:none;overflow:hidden;position:relative;border:0;box-shadow:none}
            .divider {border-color:$color_border}

        }

        .ps__scrollbar-y-rail{z-index:5}


    }
</style>