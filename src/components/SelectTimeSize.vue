<template lang="pug">
    base-field.select-time-size(
    type="select",
    :selectOptions="{value:value,label:'name',options:timeSizeList,reduce:(e)=>e.value}"
    name="timeSize",
    @input="(val)=>$emit('input',val)"
    )
</template>

<script>
export default {
    name: "select-time-size",
    props:['value'],
    data() {
        return {
            timeSizeList: [
                { name: 'Секунд', value: 0 },
                { name: 'Минут', value: 1 },
                { name: 'Часов', value: 2 },

            ],
        }
    },
    methods:{

    }
}
</script>

<style lang="scss">
    .select-time-size{}
</style>
