<template lang="pug">
    form.offer-visitor
        fieldset
            legend.offer-visitor__text-only-scr Ручное предложение
            .offer-visitor__list
                action-list(:itemList="list" v-model="model")
</template>

<script>
    import ActionList from '@/components/ActionList'
    import {httpParams } from '@/mixins/mixins'
    export default {
        components: {
            ActionList
        },
        mixins:[httpParams],
        data() {
            return {
                model:'',
                list: [
                    {text:'Предложить автозвонок',value:"call",name:'manual'},
                    {text:'Предложить ввести контактные данные',value:"contacts",name:'manual'}
                ]
            }
        },
        watch:{
            model(val){
                let data = this.httpParams.params;
                data.type=this.model;
                this.$http.post('message-send', data);
                this.$root.$emit('globBoxControlClose')
            }
        }
    }
</script>

<style lang="scss">
    .offer-visitor {
        &__text-only-scr {
            @extend %visuallyhidden
        }
        &__list {
            margin-left:(calc-em(25) * -1);
        }
    }







</style>