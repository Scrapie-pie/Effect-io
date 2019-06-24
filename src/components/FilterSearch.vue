<template lang="pug">
    base-field(
        :placeholder="placeholder"
        type="search"
        name="search"
        theme="soft",
        v-model="search"
    )
</template>

<script>
import lodash_debounce from 'lodash/debounce'
import lodash_isEmpty from 'lodash/isEmpty'

export default {
    name: "filter-search",
    props:{
        placeholder:{
            type:String,
            default:'',
        },
        startAll:{ // true если search пустой выводились все items
            type:Boolean,
            default:true
        },
        externalSearch:{
            type:String,
            default:null
        },
        fieldName:{
            type:String,
            default:'name'
        },
        itemList:{
            type:Array,
            default:function () {
                return []
            },
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
            if(!this.startAll && !this.search) return []
            if (!this.search) return this.compItemList

            return this.compItemList.filter(item => {
                let regexp = new RegExp(this.search, 'ig');

                if(lodash_isEmpty(item[this.fieldName])) return 0;  //Todo у оператора fullName
                if (item[this.fieldName].match(regexp) == null) return 0
                return true
            })
        }
    },
    watch:{
        externalSearch:{
            handler(val){
                this.search=val
            },
            immediate: true
        },
        search(val) {
            this.$emit('text',val)
        },
        itemListResult:{
            handler(val){
                this.$emit('result',val)
            },
            immediate: true

        },
/*
        itemListResult:{
            handler:lodash_debounce(function(val) {
                    console.log('itemListResult lodash_debounce',val);
                    this.$emit('result',val)
                }, 500
            ),
        }*/


    },

}
</script>

