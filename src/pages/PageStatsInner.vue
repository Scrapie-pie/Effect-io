<template lang="pug">
    the-layout-table.page-stats-inner
        filter-drop-menu(name="period", @get="filterPeriod" slot="control")
        filter-drop-menu(
            v-if="showCalendar"
            name="calendar",
            @get="filterCalendar"
            slot="control"
        )
        base-filter-search(
            v-if="filterSearchShow"
            slot="control",
            :placeholder="placeholder",
            :item-list="itemList",
            @result="(val)=>filterSearchResult=val",
            @text="(val)=>search=val",
        )
        base-btn(
            v-if="!filterSearchShow && btnDownloadShow"
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

        section.page-stats-inner__main(v-show="last_days || date_from")

            stats-service(
                v-if="routerName==='statsService'",
                :date_from="date_from",
                :date_to="date_to",
                :time_from="time_from",
                :time_to="time_to",
                :last_days="last_days",
                :type="type"
            )

            stats-operators(
                v-if="routerName==='statsEmployees'",
                :date_from="date_from",
                :date_to="date_to",
                :time_from="time_from",
                :time_to="time_to",
                type="employees",
                :last_days="last_days",
                @itemList="(val)=>itemList=val",
                :filterListOn="true",
                :filterList="filterSearchResult",
                :filterBranchId="branch.id"
            )
            stats-result(
                v-if="routerName==='statsEmployeesDetail'",
                :date_from="date_from",
                :date_to="date_to",
                :time_from="time_from",
                :time_to="time_to",
                type="employee",
                :user_id="user_id",
                :last_days="last_days",
            )
            stats-branches(
                v-if="routerName==='statsBranches'",
                type="branches",
                :date_from="date_from",
                :date_to="date_to",
                :time_from="time_from",
                :time_to="time_to",
                :last_days="last_days",
                @itemList="(val)=>itemList=val",
                :filterListOn="true",
                :filterList="filterSearchResult"
            )
            stats-result(
                v-if="routerName==='statsBranchesDetail'"
                type="branch",
                :branch_id="branch_id",
                :last_days="last_days",
                :time_from="time_from",
                :time_to="time_to",
                :date_from="date_from",
                :date_to="date_to",
            )
            stats-pages(
                v-if="routerName==='statsPages'"
                type="pages",
                :last_days="last_days",
                :date_from="date_from",
                :date_to="date_to",
                :time_from="time_from",
                :time_to="time_to",
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
import StatsService from '@/components/StatsService'


import FilterDropMenu from '@/components/FilterDropMenu'



export default {
    components:{
        TheLayoutTable,
        StatsOperators,
        StatsBranches,
        StatsResult,
        StatsPages,
        StatsService,

        FilterDropMenu
    },

    data() {
        return {
            showCalendar:false,
            filterSearchResult:[],
            itemList:[],


            date_from:null,
            date_to:null,
            time_from:null,
            time_to:null,
            last_days:null,


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
            let dates=`&date_from=${this.date_from}&date_to=${this.date_to}&time_from=${this.time_from}&time_to=${this.time_to}`;
            return `${config.api_server}app.php?statistic-get-by-params&user_id=${this.user_id}&branch_id=${this.branch_id}${dates}&last_days=${this.last_days}&type=${this.type}&csv=1&jwt=${this.$http.defaults.headers.common.jwt}`
        },
        placeholder(){
            if(this.routerName==='statsBranches') return 'Поиск по названию'
            if(this.routerName==='statsEmployees') return 'Поиск по имени'
            if(this.routerName==='statsPages') return 'Поиск по url'
        },
        btnDownloadShow(){
            return (this.last_days!==null || (this.date_from!==null && this.date_to!==null))
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
        last_days(val){
            if(val===null)this.showCalendar=true
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
        get(){

            if(this.last_days || (this.date_from && this.date_to)) {

                this.$http.get('statistic-get-by-params',{params:{
                        last_days:this.last_days,
                        date_from:this.date_from,
                        date_to:this.date_to,
                        time_from:this.time_from,
                        time_to:this.time_to,
                        type:this.type,
                    }}).then((response)=>{
                    console.log(response.data.data);
                })
            }

        },
        filterPeriod(val){

            if (val===-1) {

                this.showCalendar=true;
                this.last_days=null;
            }
            else {
                this.last_days=val;
                this.showCalendar=false;
                this.date_from = null;
                this.date_to = null;
                this.time_from = null;
                this.time_to = null;
            }
        },
        filterCalendar(val){
            console.log(val);

            this.date_from = val.date_from;
            this.date_to = val.date_to;
            this.time_from = val.time_from;
            this.time_to = val.time_to;
        }
    }
}
</script>

<style lang="scss">

    .page-stats-inner{

        &__count {
            margin-bottom:calc-em(20);
            @extend %row-flex;

            li{
                @extend %h4
            }
        }


        &__main {
            //padding-right:calc-em(15);
            padding-bottom:calc-em(45);
           // min-width:1100px;
        }
    }
</style>