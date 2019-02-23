<template lang="pug">
    base-field(
        type="search"
        name="search"
        theme="soft",
        v-model="search"
    )
</template>

<script>
import _ from 'underscore'
export default {
    name: "filter-search",
    props:{
        fieldName:{
            type:String,
            default:'name'
        },
        itemList:{
            type:Array,
            default:[],
        }
    },
    data() {
        return {
            search:'',

        }
    },
    computed:{
        compItemList(){
            return this.itemList
        },
        itemListResult(){
            if (!this.search) return this.compItemList

            return this.compItemList.filter(item => {
                let regexp = new RegExp(this.search, 'ig');

                if(_.isEmpty(item[this.fieldName])) return 0;  //Todo у оператора fullName
                if (item[this.fieldName].match(regexp) == null) return 0
                return true
            })
        }
    },
    watch:{
        search(val){
            this.$emit('text',val)
        },
        itemListResult:{
            handler(val){
                console.log( 'this.$emit(result',val);
                this.$emit('result',val)
            },
            immediate: true

        }

    },

}
</script>

