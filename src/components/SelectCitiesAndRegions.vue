<template lang="pug">
    base-field(
    :label="label",
    :name="name",
    type="select",
    :selectOptions="{value:value,options:options, label:'name',filterable:true}"
    multiple,
    @search="onSearch",
    @input="input"
    )
</template>



<script>
import debounce from  'lodash/debounce'
export default {
    name: "select-cities-and-regions",
    props:{
        name:{
            type:String,
            default:''
        },
        label:{
            type:String,
            default:''
        },
        isExcluding:{
            type:Boolean,
            default:false
        },
        value:{
            type:Array,
            default:()=>([])
        }
    },
    data() {
        return {
            options: []
        }
    },
    methods: {
        input(val){
            console.log(val);
            this.$emit('input',val)
        },
        onSearch(search, loading) {
            loading(true);
            this.search(loading, search, this);
        },
        search: debounce((loading, search, vm) => {
            fetch(
                `https://api.github.com/search/repositories?q=${escape(search)}`
            ).then(res => {
                res.json().then(json => (vm.options = json.items));
                loading(false);
            });
        }, 350)
    },
    created(){

    }
}
</script>

<style lang="scss">
    .select-cities-and-regions{}
</style>
