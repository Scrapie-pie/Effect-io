<template lang="pug">
    section.stats-service
        .stats-service__table
            stats-operators(
                :btn-detail-hide="true"
                caption="ТОП сотрудников (по оценкам)",
                :set-body-list="best_employees_by_rating"
            )
        .stats-service__table
            stats-operators(
                :btn-detail-hide="true"
                caption="Самый быстрый сотрудник",
                :set-body-list="best_employees_by_speed"
            )
        .stats-service__table
            stats-branches(
                caption="ТОП отделов (по оценкам)",
                :set-body-list="best_branches_by_rating"
            )
        .stats-service__table
            stats-branches(
            caption="ТОП отделов (по общей нагрузке)",
            :set-body-list="best_branches_by_percents"

            )
        stats-result(
            type="company",
            :set-body-list="company"
            )
</template>

<script>

    import StatsOperators from '@/components/StatsOperators'
    import StatsBranches from '@/components/StatsBranches'
    import StatsResult from '@/components/StatsResult'

    import {stats} from '@/mixins/mixins'
export default {
    name: "stats-service",
    components:{
        StatsOperators,
        StatsBranches,
        StatsResult,

    },
    mixins:[stats],
    data() {
        return {
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
    .stats-service{
        $color_border:glob-color('border');
        &__table {
            border:2px solid $color_border;
            margin-bottom:calc-em(20);
            padding:calc-em(15);
        }
    }
</style>