<template lang="pug">
    the-layout-table.page-stats-service
        base-filter-search(
            v-if="filterSearchShow"
            slot="control",
            :placeholder="placeholder",
            :item-list="itemList",
            @result="(val)=>filterSearchResult=val",
            @text="(val)=>search=val",
        )
        base-field(
            slot="control"
            type="select"
            name="period",
            :selectOptions="{label:'name',options:periodList,value:period}"
            v-model="period"
        )
        base-btn(
            v-if="!filterSearchShow"
            slot="control",
            type="a",
            :href="downloadLink"
            download
        ) Выгрузить в Csv
        base-field(
            v-if="routerName==='statsBranches'"
            slot="control"
            type="select"
            name="branch",
            :selectOptions="{label:'title',options:branchListAll,value:branch}"
            v-model="branch"
        )
        ul.page-stats-service__count(v-if="routerName==='statsService'" slot="head")
            li Отделов в команде: {{$store.state.user.branchListAll.length}}
            li Сотрудников в команде: {{$store.state.operators.all.length}}
        section(v-if="routerName==='statsService'")
            .page-stats-service__table
                stats-operators(
                    :btn-detail-hide="true"
                    order="excellent_ratings"
                    type="employees",
                    :period="period.val",
                    caption="ТОП сотрудников (по оценкам)"
                )
            .page-stats-service__table
                stats-operators(
                    :btn-detail-hide="true"
                    order="first_answer_average_speed"
                    type="employees"
                    :period="period.val"
                    caption="Самый быстрый сотрудник"
                    )
            .page-stats-service__table
                stats-branches(
                    :btn-detail-hide="true"
                    order="excellent_ratings"
                    type="branches",
                    :period="period.val"
                    caption="ТОП отделов (по оценкам)"
                )
            .page-stats-service__table
                stats-branches(
                    :btn-detail-hide="true"
                    order="dialogues_percents"
                    type="branches",
                    :period="period.val"
                    caption="ТОП отделов (по общей нагрузке)"
                )
            stats-result(type="company" :period="period.val")
        stats-operators(
            v-if="routerName==='statsEmployees'"
            type="employees",
            :period="period.val",
            @itemList="(val)=>itemList=val",
            :filterListOn="true",
            :filterList="filterSearchResult"
        )
        stats-result(
            v-if="routerName==='statsEmployeesDetail'"
            type="employee",
            :user_id="user_id",
            :period="period.val",
        )
        stats-branches(
            v-if="routerName==='statsBranches'",
            :filterBranchId="branch.id"
            type="branches",
            :period="period.val",
            @itemList="(val)=>itemList=val",
            :filterListOn="true",
            :filterList="filterSearchResult"
        )
        stats-result(
            v-if="routerName==='statsBranchesDetail'"
            type="branch",
            :branch_id="branch_id",
            :period="period.val",
        )
        stats-pages(
            v-if="routerName==='statsPages'"
            type="pages",
            :period="period.val",
            @itemList="(val)=>itemList=val",
            :filterListOn="true",
            :filterList="filterSearchResult"
        )
</template>

<script>

import config from "@/config/index";
import TheLayoutTable from '@/components/TheLayoutTable'
import StatsOperators from '@/components/StatsOperators'
import StatsBranches from '@/components/StatsBranches'
import StatsPages from '@/components/StatsPages'
import StatsResult from '@/components/StatsResult'

export default {
    components:{
        TheLayoutTable,
        StatsOperators,
        StatsBranches,
        StatsResult,
        StatsPages
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
                val:'day',name:'За день',
            },
            branch:{
                title:'Все',
                id:null,
            },
        }
    },
    computed:{
        branch_id(){
            return +this.$route.params.id;
        },
        user_id(){
            return +this.$route.params.id;
        },
        type(){
            if(this.routerName==='statsService') return 'top';
            if(this.routerName==='statsBranchesDetail') return 'branch';
            if(this.routerName==='statsEmployeesDetail') return 'employee';
        },
        downloadLink(){
            return `${config.api_server}app.php?statistic-get-by-params&user_id=${this.user_id}&branch_id=${this.branch_id}&period=${this.period.val}&type=${this.type}&csv=1&jwt=${this.$http.defaults.headers.common.jwt}`
        },
        placeholder(){
            if(this.routerName==='statsBranches') return 'Поиск по названию'
            if(this.routerName==='statsEmployees') return 'Поиск по имени'
            if(this.routerName==='statsPages') return 'Поиск по url'
        },
        filterSearchShow(){
          return (
              this.routerName!=='statsService' &&
              this.routerName!=='statsBranchesDetail' &&
              this.routerName!=='statsEmployeesDetail'
          )
        },
        routerName(){
            return this.$route.name
        },
        branchListAll(){
            let list = this.$store.state.user.branchListAll
            list.push({title:'Все'})
            return list
        }
    },
    watch:{
    /*    branchListAll:{
            handler(val,oldVal){
                if((val && val.length) && (oldVal && !oldVal.length)) {
                    this.branch = val[0]
                }
            },
            immediate: true
        }*/
    },
}
</script>

<style lang="scss">
    .page-stats-service{
        $color_border:glob-color('border');
        &__count {
            @extend %row-flex;
            li{
                @extend %h4
            }
            margin-bottom:calc-em(20);
        }
        &__table {
            border:2px solid $color_border;
            margin-bottom:calc-em(20);
            padding:calc-em(15);
        }
    }
</style>