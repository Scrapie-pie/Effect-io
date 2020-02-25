<template lang="pug">
    base-table.stats-log-status-operator-list
        thead
            tr



                th IP
                th Время
                th Действие



        tbody
            tr(v-for="(item, index) in itemList" :key="item.id")
                td {{item.ip}}
                td {{item.time
                td {{item.status}}



</template>

<script>



import { stats, paginatorStats } from '@/mixins/mixins'

export default {
    components: {

    },

    mixins: [stats,
        paginatorStats
    ],
    data() {
        return {

        }
    },
    computed: {


    },
    methods: {

    }
}
</script>

<style lang="scss">
.stats-log-status-operator-list {
    max-width:500px;
    width:auto;
}
</style>
