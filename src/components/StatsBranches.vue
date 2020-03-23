<template lang="pug">
    base-table.stats-branches
        caption(v-if="caption")
            .stats-branches__caption
                .stats-branches__caption-item {{caption}}
                filter-drop-menu.stats-branches__caption-item(
                    v-if="filterBranchIdsOn"
                    name="branch",
                    @get="(val)=>filterBranchIds=val"
                )

        thead
            tr
                th(v-for="(item, index) in headList" :key="index")
                    .stats-branches__head
                        span(v-html="item[0]")
                        |&nbsp;
                        btn-sort(
                        v-if="item[1]",
                        :toggle="sortFieldsComp[item[1]]",
                        @result="val=>sortFieldsSetSortField(val,item[1])"
                        )

        tbody
            tr(v-for="(item, index) in itemList" :key="item.id")
                td
                    span.h4 {{item.name}}
                    div(v-if="item.operators") сотрудников в отделе: {{item.operators.length}}
                td(v-if="!btnDetailHide")
                    base-btn.base-table__show-hover(
                        padding="xslr"
                        :router="{name:'statsAllBranch',params:{id:item.branch_id}}"
                    ) Детальная статистика
                td(v-text="view==='onceChat'?item.dialogues_accepted:item.dialogues_requests")
                template(v-if="!['dialogues_accepted','dialogues_requests'].includes(order)")
                    template(v-if="!['dialogues_accepted','dialogues_requests'].includes(order)")

                        td
                            span.color_success(v-text="item.dialogues_accepted")
                            span.color_error(v-text="'/'+item.dialogues_missed")
                        td
                            |{{item.first_answer_average_speed | format('time')}}
                        td
                            |{{item.average_guest_time_in_queue | format('time')}}
                        td
                            span.color_success(v-text="item.excellent_ratings")
                            span.color_info(v-text="'/'+item.middling_ratings+'/'")
                            span.color_error(v-text="item.badly_ratings")
                    td(v-else)
                        |{{item[order] | format('percent')}}

</template>

<script>
const FilterDropMenu = () => import('@/components/FilterDropMenu')
import BtnSort from '@/components/BtnSort'
import { stats, sortFields } from '@/mixins/mixins'

export default {
    components: {
        FilterDropMenu,
        BtnSort
    },
    mixins: [stats, sortFields],
    props: {
        view: {
            type: String
        },
        filterBranchIdsOn: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            filterBranchIds: []
        }
    },
    computed: {
        headList() {
            let list = [
                ['Название отдела', 'name'],
                ['', ''],
                ['Получено<br>диалогов', 'dialogues_requests'],
                ['Принято/<br>пропущено<br> диалогов', 'dialogues_accepted'],
                ['Средняя скорость<br>ответа оператора', 'first_answer_average_speed'],
                ['Средняе время<br>ожидания <br> в очереди', 'average_guest_time_in_queue'],

                ['Оценки', 'excellent_ratings']
            ]

            if (this.btnDetailHide) list.splice(1, 1)

            if (this.order === 'dialogues_percents') {
                list = ['Название отдела', 'Получено диалогов']
                list.push('Процент от общего количества диалогов (всех отделов)')
            }

            if (['dialogues_accepted', 'dialogues_requests'].includes(this.order)) {
                list.length = 2
            }

            return list
        },
        bodyListFormat() {
            return this.sortFieldsListGet
        },

        itemListWidthBranchName() {
            return this.bodyList.map(item => {
                item.branchName = ''
                let branch = this.$store.getters['user/branchListAll'].find(
                    itemSub => itemSub.id === item.branch_id
                )
                if (branch) {
                    item.branchName = branch.title
                    item.name = branch.title //base-filter-search сейчас ищет по name
                }
                item.operators = this.$store.getters['operators/all'].filter(itemSub =>
                    itemSub.branches_ids.includes(item.branch_id)
                )

                return item
            })
        },
        sortFieldsListSet() {
            if (this.filterBranchIds.length)
                return this.itemListWidthBranchName.filter(item =>
                    this.filterBranchIds.includes(item.branch_id)
                )
            else return this.itemListWidthBranchName
        }
    },

    methods: {}
}
</script>

<style lang="scss">
.stats-branches {
    &__head {
        display: flex;
        align-items: center;
    }
    &__caption {
        @extend %row-flex;
        &-item {
            @extend %row-flex-col;

            &.filter-drop-menu {
                font-weight: 400;
            }
        }
    }
    th:nth-child(1) {
        width: 253px;
    }
    th:nth-child(2) {
        width: 202px;
    }
}
</style>
