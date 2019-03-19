<template lang="pug">
    the-layout-table.page-stats-service
        base-field(
            slot="control"
            type="select"
            name="period",
            :selectOptions="{label:'name',options:periodList,value:period.val}"
            v-model="period"
        )
        base-btn(
            slot="control"
        ) Выгрузить в CVs
        base-field(
            slot="control"
            type="select"
            name="branch",
            :selectOptions="{label:'name',options:branchList,value:branch.val}"
            v-model="branch"
        )
        ul.page-stats-service__count(slot="control")
            li Отделов в команде: 10
            li Сотрудников в команде: 10
        section
            .page-stats-service__table
                stats-table-operators(type="employees" :period="period.val" caption="ТОП сотрудников (по оценкам)")
            .page-stats-service__table
                stats-table-operator-best(type="employee" :period="period.val" caption="Самый быстрый сотрудник")
            .page-stats-service__table
                stats-table-branches(type="branches" :period="period.val" caption="ТОП отделов (по оценкам)")
            .page-stats-service__table
                stats-table-branches(type="branches" :period="period.val" caption="ТОП отделов (по общей нагрузке)")
</template>

<script>

import TheLayoutTable from '@/components/TheLayoutTable'
import StatsTableOperators from '@/components/StatsTableOperators'
import StatsTableOperatorBest from '@/components/StatsTableOperatorBest'
import StatsTableBranches from '@/components/StatsTableBranches'

export default {
    components:{
        TheLayoutTable,
        StatsTableOperators,
        StatsTableOperatorBest,
        StatsTableBranches
    },

    data() {
        return {
            filterSearchResult:[],
            branch_id:null,
            periodList:[
                {val:'day',name:'За день'},
                {val:'month',name:'За месяц'},
                {val:'quarter',name:'За квартал'},
                {val:'year',name:'За год'},
            ],
            period:{
                val:'day',name:'За день',
            },
            branch:{
                val:'day',name:'За день',
            },
            type:'branches',



        }
    },
    computed:{

    }
}
</script>

<style lang="scss">
    .page-stats-service{
        $color_border:glob-color('border');
        &__count {
            @extend %row-flex
        }
        &__table {
            border:2px solid $color_border;
            margin-bottom:calc-em(20);
            padding:calc-em(15);
        }
    }
</style>