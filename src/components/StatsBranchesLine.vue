<template lang="pug">
    base-table.stats-branches
        thead
            tr
                th
                    btn-sort(
                        v-if="item",
                        :toggle="compSort[index]",
                        @result="val=>setSortField(val,index)"
                    )
        tbody
            tr
                td


</template>

<script>

    const sortDefault = ()=> {return {
        val:[true],
        field:[],
        text:[],
    }}

    import BtnSort  from '@/components/BtnSort'
    import {stats} from '@/mixins/mixins'
    import lodash_sortBy from 'lodash/sortBy'

export default {
    components:{
        BtnSort
    },
    mixins:[stats],
    props:{

    },

    data() {
        return {
            sort:sortDefault(),
            currentSort:{
                val:sortDefault().val[0],
                field:sortDefault().field[0]
            },
            filterBranchIds:[]
        }
    },
    computed:{
        compSort(){
            return this.sort.val
        },
        bodyListFormat(){
            return  lodash_sortBy(
                this.setFilterList.map(item=>{
                    return item
                }),
                [
                    (item)=>item[this.currentSort.field]*(this.currentSort.val?-1:1)
                ]
            );
        },
        setFilterList(){
            return  this.bodyList
        }
    },

    methods:{
        setSortField(val,index){
            this.$set(this.sort,'val',sortDefault().val)
            this.$set(this.sort.val,index,val);
            this.currentSort = {
                'val':val,
                'field':this.sort.field[index],

            }
        },
        setCurrentFieldSort(index){

        }
    }
}
</script>

<style lang="scss">
    .stats-branches-line{

    }
</style>

