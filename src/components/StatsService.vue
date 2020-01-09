<template lang="pug">
    section.stats-service
        stats-top-operators(v-bind="payloadTopEmployees")
        stats-top-branches(v-bind="payloadTopBranches")
        stats-result(
            v-bind="payloadTopCompany"
            )
</template>

<script>
import { stats } from '@/mixins/mixins'

export default {
    name: 'StatsService',
    components: {
        StatsTopBranches: () => import('@/components/StatsTopBranches'),
        StatsTopOperators: () => import('@/components/StatsTopOperators'),
        StatsResult: () => import('@/components/StatsResult')
    },
    mixins: [stats],
    data() {
        return {
            best_branches_by_percents: [],
            best_branches_by_rating: [],
            best_employees_by_rating: [],
            best_employees_by_speed: [],
            company: {}
        }
    },
    computed: {
        payloadTopBranches() {
            return Object.assign({}, this.$props, { type: 'top_branches' })
        },
        payloadTopEmployees() {
            return Object.assign({}, this.$props, { type: 'top_employees' })
        },
        payloadTopCompany() {
            return Object.assign({}, this.$props, { type: 'top_company' })
        }
    },

    watch: {
        bodyList(val) {
            console.log(val)
            if (val) {
                this.best_branches_by_percents = val.best_branches_by_percents
                this.best_branches_by_rating = val.best_branches_by_rating
                this.best_employees_by_rating = val.best_employees_by_rating
                this.best_employees_by_speed = val.best_employees_by_speed
                this.company = val.company
            }
        }
    },
    methods: {
        get() {
            console.log('обнулил метод в mixins stats')
            //
        }
    }
}
</script>

<style lang="scss">
.stats-service {
    $color_border: glob-color('border');
    &__table {
        border: 2px solid $color_border;
        margin-bottom: calc-em(20);
        padding: calc-em(15);
    }
}
</style>
