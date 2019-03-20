<template lang="pug">
    the-layout-table.page-stats-service
        base-filter-search(
            slot="control",
            :item-list="itemList",
            @result="(val)=>filterSearchResult=val",
            fieldName="url"
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
            @itemList="(val)=>itemList=val"
            filter="filterSearchResult"
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

}
</script>

<style lang="scss">

</style>