<template lang="pug">
    form.offer-visitor
        fieldset
            legend.offer-visitor__text-only-scr Ручное предложение
            .offer-visitor__list
                action-list(:itemList="list" v-model="model" name-field-text="title",name-field-value="value")
</template>

<script>
import ActionList from '@/components/ActionList'
import { httpParams } from '@/mixins/mixins'
export default {
    components: {
        ActionList
    },
    mixins: [httpParams],
    data() {
        return {
            model: '',
            list: [
                { title: 'Предложить автозвонок', value: 'call', name: 'manual' },
                {
                    title: 'Предложить ввести контактные данные',
                    value: 'contacts',
                    name: 'manual'
                }
            ]
        }
    },
    watch: {
        model(val) {
            let data = this.httpParams.params

            this.$root.$emit('globBoxControlClose')
            if (this.model === 'call') {
                data.type = this.model
                this.$http.post('message/save', data)
            }
            if (this.model === 'contacts') this.$http.post('guest/contacts-request', data)
        }
    }
}
</script>

<style lang="scss">
.offer-visitor {
    &__text-only-scr {
        @extend %visuallyhidden;
    }
    &__list {
        margin-left: (calc-em(25) * -1);
    }
}
</style>
