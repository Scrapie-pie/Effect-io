<template lang="pug">
    the-layout-table.page-stats-service
        base-filter-search(
            slot="control",
            :item-list="compItemList",
            @result="(val)=>filterSearchResult=val",
            fieldName="branchName"
        )
        base-field(
            slot="control"
            type="select"
            name="period",
            :selectOptions="{label:'name',options:periodList,value:period}"
            v-model="period"
            )

        stats-table-branches(
            type="branches",
            :period="period.val",
            @itemList="(val)=>itemList=val",
            :filterList="filterSearchResult",
            :filterListOn="true"
        )

</template>

<script>

import TheLayoutTable from '@/components/TheLayoutTable'

import StatsTableBranches from '@/components/StatsTableBranches'


export default {
    components:{
        TheLayoutTable,
        StatsTableBranches,

    },

    data() {
        return {
            filterSearchResult:[],
            itemList:[],
            periodList:[
                {val:'day',name:'За день'},
                {val:'month',name:'За месяц'},
                {val:'quarter',name:'За квартал'},
                {val:'year',name:'За год'},
            ],
            period:{
                val:'year',name:'За Год',
            },
        }
    },
    computed:{
        compItemList(){
            return this.itemList
        }
    }

}
</script>

<style lang="scss">

</style>