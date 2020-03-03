<template lang="pug">

    base-table.stats-log-status-operator-list
        thead
            tr
                th Оператор

                th Отдел
                th IP
                th Время
                th Действие



        tbody
            tr(v-for="(item, index) in itemList" :key="item.id")
                td
                    router-link(
                        :to="{name:'statsLogStatusOperatorDetail',params:{id:item.user_id}}"
                    ) {{item.name}}
                td(v-if="item.operator" v-html="$options.filters.branchesBr(item.operator.branches_names)")
                td {{item.ip}}
                td {{item.time}}
                td {{item.status}}



</template>

<script>
import FilterDropMenu from '@/components/FilterDropMenu'
import { branchesBr } from '@/modules/modules'

import { stats, paginatorStats } from '@/mixins/mixins'

export default {
    components: {
        FilterDropMenu
    },
    filters: {
        branchesBr
    },
    mixins: [stats, paginatorStats],

    data() {
        return {}
    },
    computed: {
        bodyListFormat() {
            return this.bodyList.map(item => {
                item.operator = this.$store.getters['operators/all'].find(
                    itemSub => itemSub.id === item.user_id
                )
                if (item.operator) item.name = item.operator.fullName
                return item
            })
        }
    },
    methods: {}
}
</script>

<style lang="scss">
.stats-log-status-operator-list {
    width: auto;
}
</style>
