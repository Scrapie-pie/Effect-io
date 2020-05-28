<template lang="pug">
    base-field(
    :label="label",
    :name="name",
    type="select",
    :selectOptions="{value:setValue(value),options:options, label:'title',filterable:true,reduce:e=>e.id}"
    multiple,
    @search="onSearch",
    @input="input"
    )
</template>

<script>
import { apiGeo } from '@/api/api'
import debounce from 'lodash/debounce'
export default {
    name: 'SelectCitiesAndRegions',
    props: {
        countryCode: {
            type: Array,
            default: () => []
        },

        name: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        isExcluding: {
            type: Boolean,
            default: false
        },
        value: {
            type: Array,
            default: () => []
        },
        optionlist: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            options: []
        }
    },
    methods: {
        setValue(val) {
            return val
            return val.map(item => item.id)
        },
        input(val) {
            console.log(val)
            this.$emit('input', val)
        },
        onSearch(search, loading) {
            loading(true)
            this.search(loading, search, this)
        },
        search: debounce((loading, search, vm) => {
            apiGeo.cities({ keyword: search, country_code: vm.countryCode }).then(list => {
                vm.options = list
                loading(false)
            })

            /* fetch(
                `https://api.github.com/search/repositories?q=${escape(search)}`
            ).then(res => {
                res.json().then(json => (vm.options = json.items));
                loading(false);
            });*/
        }, 350)
    },
    created() {},
    mounted() {}
}
</script>

<style lang="scss">
.select-cities-and-regions {
}
</style>
