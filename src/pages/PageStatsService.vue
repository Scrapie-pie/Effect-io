<template lang="pug">
    the-layout-table.page-stats-service
        base-field(
            slot="control"
            type="select"
            name="period",
            :selectOptions="{label:'name',options:periodList,value:period}"
            v-model="period"
        )
        base-btn(
            slot="control"
        ) Выгрузить в CVs
        base-field(
            slot="control"
            type="select"
            name="branch",
            :selectOptions="{label:'title',options:branchListAll,value:branch}"
            v-model="branch"
        )
        ul.page-stats-service__count(slot="control")
            li Отделов в команде: 10
            li Сотрудников в команде: 10
        section
            .page-stats-service__table
                stats-table-operators(
                    :btn-detail-hide="true"
                    order="excellent_ratings"
                    type="employees",
                    :period="period.val",
                    caption="ТОП сотрудников (по оценкам)"
                    )
            .page-stats-service__table
                stats-table-operators(
                    :btn-detail-hide="true"
                    order="first_answer_average_speed"
                    type="employees"
                    :period="period.val"
                    caption="Самый быстрый сотрудник"
                    )
            .page-stats-service__table
                stats-table-branches(
                    :btn-detail-hide="true"
                    order="excellent_ratings"
                    type="branches",
                    :period="period.val"
                    caption="ТОП отделов (по оценкам)"
                )
            .page-stats-service__table
                stats-table-branches(
                    :btn-detail-hide="true"
                    order="dialogues_percents"
                    type="branches",
                    :period="period.val"
                    caption="ТОП отделов (по общей нагрузке)"
                )

            stats-result(type="company" :period="period.val")
</template>

<script>

import TheLayoutTable from '@/components/TheLayoutTable'
import StatsTableOperators from '@/components/StatsTableOperators'

import StatsTableBranches from '@/components/StatsTableBranches'
import StatsResult from '@/components/StatsResult'

export default {
    components:{
        TheLayoutTable,
        StatsTableOperators,

        StatsTableBranches,
        StatsResult
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
                val:'year',name:'За Год',
            },
            branch:{
                title:''
            },
            type:'branches',



        }
    },
    computed:{
        branchListAll(){
            return this.$store.state.user.branchListAll
        }
    },
    watch:{
        branchListAll:{
            handler(val,oldVal){
                if((val && val.length) && (oldVal && !oldVal.length)) {
                    this.branch = val[0]
                }
            },
            immediate: true
        }
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