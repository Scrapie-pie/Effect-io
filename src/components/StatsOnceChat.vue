<template lang="pug">
    section.stats-once-chat
        ul.stats-once-chat__list
            li.stats-once-chat__item
                .stats-once-chat__table
                    stats-branches(
                    :btn-detail-hide="true"
                    caption="ТОП отделам",
                    :set-body-list="best_branches_by_rating",
                    :sort="true"
                    order="dialogues_requests"
                    )
                p.stats-once-chat__all
                    | Всего принято диалогов по выбранным отделам: 766
            li.stats-once-chat__item
                .stats-once-chat__table
                    stats-operators(
                        :btn-detail-hide="true"
                        caption="ТОП сотрудникам",
                        :set-body-list="best_employees_by_rating",
                        :sort="true"
                        order="dialogues_requests"
                    )

                p.stats-once-chat__all
                    | Всего принято диалогов по выбранным сорудникам: 7366

</template>

<script>

    const StatsOperators = ()=> import ('@/components/StatsOperators')
    const StatsBranches = ()=> import ('@/components/StatsBranches')


    import {stats} from '@/mixins/mixins'
export default {
    name: "stats-service",
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
        }
        &__table {
            border:2px solid $color_border;
            margin-bottom:calc-em(20);
            padding:calc-em(15);
        }
        &__all {
            @extend %h4;
        }
    }
</style>