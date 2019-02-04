<template lang="pug">
    vue-tel-input(
        v-model="phone",
        @onInput="onInput",
        :onlyCountries="['ru','us', 'de', 'es','fr']"
    )
        
    
</template>
    <script>
import 'vue-tel-input/dist/vue-tel-input.css';
import VueTelInput from 'vue-tel-input'

export default  {
    components:{
        VueTelInput
    },
    data() {
        return {
            phone:''
        }

    },
    methods: {

        onInput({ number, isValid, country }) {
            console.log(number, isValid, country);
        },
    },
    
}
</script>

<style lang="scss">
    .tel-input {
    
    }
</style>