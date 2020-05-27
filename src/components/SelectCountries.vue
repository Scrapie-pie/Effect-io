<template lang="pug">
    base-field.select-countries(
    label="Выберите страну / страны"
    type="select",
    :selectOptions="{ label:'title',options:countryList,reduce:e=>e.id}"
    name="country"
    multiple,
    @input="val=>$emit('input',val)"
    )
</template>

<script>

    import {apiGeo} from "@/api/api";

    export default {
    name: "select-countries",
    props:['value'],
    data() {
        return {
            countryList:[]
        }
    },
    created(){
        apiGeo.countries().then(list=>{


            this.countryList = list
        })
    }
}
</script>

<style lang="scss">
    .select-countries{}
</style>
