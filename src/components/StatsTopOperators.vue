<template lang="pug">
    .stats-top-operators
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
            order="first_answer_average_speed"
            )

</template>

<script>
import StatsOperators from '@/components/StatsOperators'

import { stats } from '@/mixins/mixins'
export default {
    components: {
        StatsOperators
    },
    mixins: [stats],
    data() {
        return {
            best_employees_by_rating: [],
            best_employees_by_speed: []
        }
    },
    computed: {},

    watch: {
        bodyList(val) {
            if (val) {
                this.best_employees_by_rating = val.best_employees_by_rating
                this.best_employees_by_speed = val.best_employees_by_speed
            }
        }
    },
    methods: {}
}
</script>

<style lang="scss"></style>
