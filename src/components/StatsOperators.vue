<template lang="pug">
    base-table.stats-operators
        caption(v-if="caption")
            .stats-operators__caption
                .stats-operators__caption-item {{caption}}
                filter-drop-menu.stats-operators__caption-item(
                    v-if="filterOperatorIdsOn"
                    name="operator",
                    @get="(val)=>filterOperatorIds=val"
                )
        thead(v-if="headList.length")
            tr
                th(v-for="(item, index) in headList" :key="index")
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
                    base-people(
                        v-if="item.operator",
                        type="operator",
                        :text="item.operator.statusText",
                        :name="item.operator.fullName",
                        :avatar-url="item.operator.photo"
                    )
                td(v-if="!btnDetailHide")
                    base-btn.base-table__show-hover(

                        padding="xslr",
                        :router="{name:'statsOperatorsDetail',params:{id:item.user_id}}"
                    ) Детальная статистика
                td(v-if="item.operator" v-html="$options.filters.branchesBr(item.operator.branches_names)")
                td(v-if="order==='dialogues_accepted'" v-text="item.dialogues_accepted")
                td(v-else-if="order==='dialogues_requests'" v-text="item.dialogues_requests")
                template(v-else)
                    template(v-if="order!=='first_answer_average_speed'")
                        td(v-text="item.dialogues_requests")
                        td
                            span.color_success(v-text="item.dialogues_accepted")
                            span.color_error(v-text="'/'+item.dialogues_missed")

                        td
                            span.color_success(v-text="item.excellent_ratings")
                            span.color_info(v-text="'/'+item.middling_ratings+'/'")
                            span.color_error(v-text="item.badly_ratings")
                    td(v-else)
                        |Среднее время первого ответа на диалог {{item.first_answer_average_speed | format('time')}}
</template>

<script>
import branchesBr from '@/modules/branchesBr'
const FilterDropMenu = () => import('@/components/FilterDropMenu')
import { stats, sortFields } from '@/mixins/mixins'
import BtnSort from '@/components/BtnSort'

export default {
    components: {
        FilterDropMenu,
        BtnSort
    },
    filters: {
        branchesBr
    },
    mixins: [stats, sortFields],
    props: {
        filterBranchId: {
            type: Number,
            default: null
        },
        filterOperatorIdsOn: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            filterOperatorIds: []
        }
    },
    computed: {
        headList() {
            let list = [
                ['Имя', 'name'],
                ['', ''],
                ['Отдел', null],
                ['Получено<br>диалогов', 'dialogues_requests'],
                ['Принято/<br>пропущено диалогов', 'dialogues_accepted'],
                ['Оценки', 'excellent_ratings']
            ]

            if (this.btnDetailHide) list.splice(1, 1)

            if (this.order === 'first_answer_average_speed') {
                list = []
            }

            if (this.order === 'dialogues_requests' || this.order === 'dialogues_accepted') {
                list.length = 3
            }

            return list
        },

        bodyListFormat() {
            return this.sortFieldsListGet
        },
        itemListWidthOperators() {
            return this.bodyList.map(item => {
                item.operator = this.$store.getters['operators/all'].find(
                    itemSub => itemSub.id === item.user_id
                )
                if (item.operator) item.name = item.operator.fullName
                return item
            })
        },

        sortFieldsListSet() {
            console.log(
                'else return this.itemListWidthOperators',
                this.filterBranchId,
                this.filterOperatorIdsOn
            )
            if (this.filterBranchId) {
                return this.itemListWidthOperators.filter(item =>
                    item.operator.branches_ids.includes(this.filterBranchId)
                )
            }

            if (this.filterOperatorIdsOn) {
                return this.itemListWidthOperators.filter(item => {
                    if (!this.filterOperatorIds.length) return true
                    return this.filterOperatorIds.includes(item.operator.id)
                })
            } else {
                return this.itemListWidthOperators
            }
        }
    }
}
</script>

<style lang="scss">
.stats-operators {
    &__caption {
        @extend %row-flex;
        &-item {
            @extend %row-flex-col;

            &.filter-drop-menu {
                font-weight: 400;
            }
        }
    }
    td:nth-child(1),
    td:nth-child(2) {
        width: 253px;
    }
}
</style>
