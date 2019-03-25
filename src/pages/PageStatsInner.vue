<template lang="pug">
    the-layout-table.page-stats-inner
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
            v-if="routerName==='statsEmployees'"
            slot="control"
            type="select"
            name="branch",
            :selectOptions="{label:'title',options:branchListAll,value:branch}"
            v-model="branch"
        )

        ul.page-stats-inner__count(v-if="routerName==='statsService'" slot="head")
            li Отделов в команде: {{$store.state.user.branchListAll.length}}
            li Сотрудников в команде: {{$store.state.operators.all.length}}

        section.page-stats-inner__main

            template(v-if="routerName==='statsService'")
                .page-stats-inner__table
                    stats-operators(
                        :btn-detail-hide="true"
                        order="excellent_ratings"
                        type="employees",
                        :period="period.val",
                        caption="ТОП сотрудников (по оценкам)"
                    )
                .page-stats-inner__table
                    stats-operators(
                        :btn-detail-hide="true"
                        order="first_answer_average_speed",
                        :limit="1",
                        type="employees"
                        :period="period.val"
                        caption="Самый быстрый сотрудник"
                        )
                .page-stats-inner__table
                    stats-branches(
                        :btn-detail-hide="true"
                        order="excellent_ratings"
                        type="branches",
                        :period="period.val"
                        caption="ТОП отделов (по оценкам)"
                    )
                .page-stats-inner__table
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
                :filterList="filterSearchResult",
                :filterBranchId="branch.id"
            )
            stats-result(
                v-if="routerName==='statsEmployeesDetail'"
                type="employee",
                :user_id="user_id",
                :period="period.val",
            )
            stats-branches(
                v-if="routerName==='statsBranches'",
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
                title:'Все отделы',
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

    .page-stats-inner{
        $color_border:glob-color('border');
        &__count {
            margin-bottom:calc-em(20);
            @extend %row-flex;

            li{
                @extend %h4
            }
        }
        &__table {
            border:2px solid $color_border;
            margin-bottom:calc-em(20);
            padding:calc-em(15);
        }

        &__main {
            max-width:1300px;
            //padding-right:calc-em(15);
            padding-bottom:calc-em(45);
        }
    }
</style>