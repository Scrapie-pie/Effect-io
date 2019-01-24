<template lang="pug">
    form.offer-visitor
        fieldset
            legend.offer-visitor__text-only-scr Ручное предложение
            .offer-visitor__list
                action-list(:itemList="list")
</template>

<script>
    import ActionList from '@/components/ActionList'
    export default {
        components: {
            ActionList
        },
        data() {
            return {
                list: [
                    {text:'Предложить посетителю заказать обратный звонок'},
                    {text:' Предложить посетителю заказать обратный звонок'}
                ]
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