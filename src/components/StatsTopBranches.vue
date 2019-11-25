<template lang="pug">
    .stats-top-branches
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

</template>

<script>



import { stats } from '@/mixins/mixins'

export default {

    components: {
        StatsBranches:()=>import('@/components/StatsBranches.vue'),


    },
    mixins: [
        stats
    ],
    data() {
        return {
            best_branches_by_percents: [],
            best_branches_by_rating: [],

        }
    },

    watch: {
        bodyList(val) {
            console.log(val)
            if (val) {
                this.best_branches_by_percents = val.best_branches_by_percents
                this.best_branches_by_rating = val.best_branches_by_rating


            }
        }
    },

}
</script>

<style lang="scss">

</style>
