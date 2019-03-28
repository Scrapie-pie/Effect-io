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
            name="lastDay",
            :selectOptions="{label:'name',options:lastDays,value:lastDay}"
            v-model="lastDay"
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
            filter-drop-menu(name="period", @get="filterPeriod" )
            box-controls(@boxControlClose="showCalendar=false" v-if="showCalendar"  type="popup")
                app-calendar(@get="val=>dates=val")
            template(v-if="routerName==='statsService'")
                .page-stats-inner__table
                    stats-operators(
                        :btn-detail-hide="true"
                        order="excellent_ratings"
                        type="employees",
                        :last_days="lastDay.val",
                        caption="ТОП сотрудников (по оценкам)"
                    )
                .page-stats-inner__table
                    stats-operators(
                        :btn-detail-hide="true"
                        order="first_answer_average_speed",
                        :limit="1",
                        type="employees",
                        :last_days="lastDay.val"
                        caption="Самый быстрый сотрудник"
                        )
                .page-stats-inner__table
                    stats-branches(
                        :btn-detail-hide="true"
                        order="excellent_ratings"
                        type="branches",
                        :last_days="lastDay.val"
                        caption="ТОП отделов (по оценкам)"
                    )
                .page-stats-inner__table
                    stats-branches(
                        :btn-detail-hide="true"
                        order="dialogues_percents"
                        type="branches",
                        :last_days="lastDay.val"
                        caption="ТОП отделов (по общей нагрузке)"
                    )
                stats-result(type="company", :last_days="lastDay.val")
            stats-operators(
                v-if="routerName==='statsEmployees'"

                type="employees",
                :last_days="lastDay.val",
                @itemList="(val)=>itemList=val",
                :filterListOn="true",
                :filterList="filterSearchResult",
                :filterBranchId="branch.id"
            )
            stats-result(
                v-if="routerName==='statsEmployeesDetail'"
                type="employee",
                :user_id="user_id",
                :last_days="lastDay.val",
            )
            stats-branches(
                v-if="routerName==='statsBranches'",
                type="branches",
                :last_days="lastDay.val",
                @itemList="(val)=>itemList=val",
                :filterListOn="true",
                :filterList="filterSearchResult"
            )
            stats-result(
                v-if="routerName==='statsBranchesDetail'"
                type="branch",
                :branch_id="branch_id",
                :last_days="lastDay.val",
            )
            stats-pages(
                v-if="routerName==='statsPages'"
                type="pages",
                :last_days="lastDay.val",
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
import AppCalendar from '@/components/AppCalendar'

import FilterDropMenu from '@/components/FilterDropMenu'

export default {
    components:{
        TheLayoutTable,
        StatsOperators,
        StatsBranches,
        StatsResult,
        StatsPages,
        AppCalendar,
        FilterDropMenu
    },

    data() {
        return {
            showCalendar:false,
            filterSearchResult:[],
            itemList:[],
            lastDays:[
                {val:1,name:'За сутки'},
                {val:7,name:'За 7 дней'},
                {val:30,name:'За 30 дней'},
                {val:null,name:'Выбрать интервал'},
            ],
            dates:{
                date_from:null,
                date_to:null,
            },
            lastDay:{
                val:1,name:'За сутки',
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
            return `${config.api_server}app.php?statistic-get-by-params&user_id=${this.user_id}&branch_id=${this.branch_id}&last_days=${this.lastDay.val}&type=${this.type}&csv=1&jwt=${this.$http.defaults.headers.common.jwt}`
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
        lastDay(val){
            if(val.val===null)this.showCalendar=true
            else this.showCalendar=false;
        }
    /*    branchListAll:{
            handler(val,oldVal){
                if((val && val.length) && (oldVal && !oldVal.length)) {
                    this.branch = val[0]
                }
            },
            immediate: true
        }*/
    },
    methods:{
        filterPeriod(val){
            console.log(val);
            if (val===-1) this.showCalendar=true
        }
    }
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
            //padding-right:calc-em(15);
            padding-bottom:calc-em(45);
           // min-width:1100px;
        }
    }
</style>