<template lang="pug">
    form.the-redirect-client(@submit.prevent="submit" v-if="viewModeChat==='visitors'")
        fieldset
            legend Перенаправление клиента
            base-field.the-redirect-client__base-field(placeholder="Введите URL" name="redirect" v-model="model")
            base-btn(type="submit" color="info" size="sm" padding="xs") Перенаправить
</template>

<script>
    import { viewModeChat } from '@/mixins/mixins'
export default {
    name: "the-redirect-client",
    mixins:[viewModeChat],
    data() {
        return {
            model:''
        }
    },
    methods:{
        submit(){
            this.model='';
            console.log('submit');
        }
    }
}
</script>

<style lang="scss">
    .the-redirect-client{
        $color_bg:glob-color('info-light');
        background-color:$color_bg;
        padding:calc-em(15);
        border-radius:$glob-border-radius_field;

        &__base-field {
            .field__input {
                background-color:glob-color('light');
                margin:calc-em(10) 0;
            }

        }
    }
</style>