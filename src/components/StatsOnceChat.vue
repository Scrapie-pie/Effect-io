<template lang="pug">
    section.stats-once-chat
        .stats-once-chat__list
            .stats-once-chat__item
                .stats-once-chat__table
                    stats-branches(v-bind="payload('branches')")
                p.stats-once-chat__all
                    | Всего принято диалогов по выбранным отделам: 766
            .stats-once-chat__item
                .stats-once-chat__table
                    stats-operators(v-bind="payload('employees')")
                p.stats-once-chat__all
                    | Всего принято диалогов по выбранным сорудникам: 7366

</template>

<script>

    const StatsOperators = ()=> import ('@/components/StatsOperators')
    const StatsBranches = ()=> import ('@/components/StatsBranches')


    import {stats} from '@/mixins/mixins'
export default {

    components:{
        StatsOperators,
        StatsBranches,


    },
    mixins:[stats],
    data() {
        return {
            onceBranches:[],
            onceEmployees:[],

            best_branches_by_percents:[],
            best_branches_by_rating:[],
            best_employees_by_rating:[],
            best_employees_by_speed:[],
            company:{}

        }
    },
    computed:{

    },
    methods:{
        payload(type){

            let obj = {
                type
            }

            if(type==='branches') {
                obj.caption="По отделам",
                obj.filterBranchIdsOn=true
            }
            if(type==='employees') {
                obj.caption="По сотрудникам",
                obj.filterOperatorIdsOn=true
            }
            let main = {
                date_from:this.date_from,
                date_to:this.date_to,
                time_from:this.time_from,
                time_to:this.time_to,
                last_days:this.last_days,
                btnDetailHide:true,
                order:'dialogues_requests',
                is_one_time_chat:1,
            }

            return Object.assign(main, obj)
        },
    },
    watch:{
        bodyList(val){
            console.log(val);
            if(val){
                    this.onceBranches=val.onceBranches;
                    this.onceEmployees=val.onceEmployees;

                this.best_branches_by_percents=val.best_branches_by_percents
                this.best_branches_by_rating=val.best_branches_by_rating
                this.best_employees_by_rating=val.best_employees_by_rating
                this.best_employees_by_speed=val.best_employees_by_speed
                this.company=val.company
            }
        }
    }
}
</script>

<style lang="scss">
    .stats-once-chat{
        $color_border:glob-color('border');
        &__list {
            display:flex;

            @extend %row-flex;
            @include media($width_xl) {
                flex-flow:wrap;
            }
        }
        &__item {
            @extend %row-flex-col;
            min-width:570px;
            margin-bottom:calc-em(20);
        }
        &__table {
            border:2px solid $color_border;
            margin-bottom:calc-em(20);
            padding:calc-em(15);

            @include media($width_xl,1) {
                height:100%;
            }
        }
        &__all {
            @extend %h4;

        }
    }
</style>