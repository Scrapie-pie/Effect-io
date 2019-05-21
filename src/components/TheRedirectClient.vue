<template lang="pug">
    form.the-redirect-client(@submit.prevent="submit" v-if="viewModeChat==='visitors'")
        fieldset
            legend Перенаправление клиента
            base-field.the-redirect-client__base-field(placeholder="Введите URL" name="redirect" v-model="url")
            base-btn(type="submit" color="info-dark" ) Перенаправить
</template>

<script>
    import { viewModeChat,httpParams } from '@/mixins/mixins'
export default {
    name: "the-redirect-client",
    mixins:[viewModeChat,httpParams],
    data() {
        return {
            url:''
        }
    },
    methods:{
        submit(){
            if (!this.url) return
            let data = this.httpParams.params;
            data.url = this.url;
            this.url='';
            this.$http.post('guest-redirect',data)
                .then(()=> {
                    console.log('guest-redirect');
                })

        }
    }
}
</script>

<style lang="scss">
    .the-redirect-client{
        $color_bg:glob-color('info-lighten');
        background-color:$color_bg;
        padding:calc-em(15);


        &__base-field {
            .field__input {
                background-color:glob-color('light');
                margin:calc-em(10) 0;
            }

        }
    }
</style>