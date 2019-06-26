<template lang="pug">
    the-layout-table.page-stats-inner
        filter-drop-menu(
            name="last_days",
            key="last_days",
            @get="filterLast_days"
            slot="control"
            type="radio"
        )
        filter-drop-menu(
            v-show="showCalendar"
            name="calendar",
            key="calendar",
            @get="filterCalendar"
            slot="control"
        )
        base-filter-search(
            v-if="filterSearchShow"
            slot="control",
            :placeholder="placeholder",
            :item-list="itemList",
            @result="(val)=>filterSearchResult=val",
            @text="(val)=>search=val",
        )
        base-btn(
            v-if="!filterSearchShow && btnDownloadShow"
            slot="control",
            type="a",
            :href="downloadLink"
            download
        ) Выгрузить в Csv
        base-field(
            v-if="routerName==='statsOperators'"
            slot="control"
            type="select"
            name="branch",
            :selectOptions="{label:'title',options:branchListAll,value:branch}"
            v-model="branch"
        )

        ul.page-stats-inner__count(v-if="routerName==='statsService'" slot="head")
            li Отделов в команде: {{$store.state.user.branchListAll.length}}
            li Сотрудников в команде: {{$store.state.operators.all.length}}

        section.page-stats-inner__main.no-mw(v-show="last_days || date_from")
            component(
                :is="activeComponent",
                v-bind="payload"
                v-on="listeners"
                )

</template>

<script>
import config from '@/config/index'
const TheLayoutTable = () => import('@/components/TheLayoutTable')
const StatsOperators = () => import('@/components/StatsOperators')
const StatsBranches = () => import('@/components/StatsBranches')
const StatsPages = () => import('@/components/StatsPages')
const StatsResult = () => import('@/components/StatsResult')
const StatsService = () => import('@/components/StatsService')
const StatsOnceChat = () => import('@/components/StatsOnceChat')
const StatsAll = () => import('@/components/StatsAll')
const StatsTags = () => import('@/components/StatsTags')

import FilterDropMenu from '@/components/FilterDropMenu'

import { filterLastDaysAndCalendar } from '@/mixins/mixins'

export default {
    components: {
        TheLayoutTable,
        StatsOperators,
        StatsBranches,
        StatsResult,
        StatsPages,
        StatsService,
        StatsOnceChat,
        FilterDropMenu,
        StatsAll,
        StatsTags
    },
    mixins: [filterLastDaysAndCalendar],
    data() {
        return {
            filterSearchResult: [],
            itemList: [],
            branch: {
                title: 'Все отделы',
                id: null
            }
        }
    },
    computed: {
        activeComponent() {
            if (this.routerName === 'statsAllBranch') return 'statsAll'
            if (this.routerName === 'statsAllOperator') return 'statsAll'
            if (this.routerName === 'statsOperatorsDetail') return 'statsResult'
            if (this.routerName === 'statsBranchesDetail') return 'statsResult'
            return this.routerName
        },
        listeners: function() {
            let obj = {}

            if (
                this.routerName === 'statsPages' ||
                this.routerName === 'statsBranches' ||
                this.routerName === 'statsOperators'
            ) {
                obj.itemList = val => {
					this.itemList = val // eslint-disable-line
                }
            }

            return Object.assign({}, this.$listeners, obj)
        },
        payload() {
            let obj = {
                type: this.type,
                filterListOn: false,
                filterList: this.filterSearchResult
            }

            if (this.routerName === 'statsAllBranch') obj.branch_id = this.branch_id
            if (this.routerName === 'statsAllOperator') obj.user_id = this.user_id

            if (this.routerName === 'statsOperatorsDetail') obj.user_id = this.user_id
            if (this.routerName === 'statsBranchesDetail') obj.branch_id = this.branch_id

            if (this.routerName === 'statsOperators') obj.filterBranchId = this.branch.id
            if (
                this.routerName === 'statsBranches' ||
                this.routerName === 'statsPages' ||
                this.routerName === 'statsOperators'
            )
                obj.filterListOn = true

            let main = {
                date_from: this.date_from,
                date_to: this.date_to,
                time_from: this.time_from,
                time_to: this.time_to,
                last_days: this.last_days
            }
            return Object.assign(main, this.$attrs, obj)
        },
        branch_id() {
            return +this.$route.params.id
        },
        user_id() {
            return +this.$route.params.id
        },
        type() {
            if (this.routerName === 'statsTags') return 'tags'
            if (this.routerName === 'statsPages') return 'pages'

            if (this.routerName === 'statsAll') return 'branches'
            if (this.routerName === 'statsAllBranch') return 'branch'
            if (this.routerName === 'statsAllOperator') return 'employee'

            if (this.routerName === 'statsService') return 'top'
            if (this.routerName === 'statsBranches') return 'branches'
            if (this.routerName === 'statsAll') return 'branches'
            if (this.routerName === 'statsBranchesDetail') return 'branch'
            if (this.routerName === 'statsOperators') return 'employees'
            if (this.routerName === 'statsOperatorsDetail') return 'employee'

            return ''
        },
        downloadLink() {
            let dates = `&date_from=${this.date_from}&date_to=${this.date_to}&time_from=${
                this.time_from
            }&time_to=${this.time_to}`
            return `${config.api_server}statistic/get-by-params?user_id=${this.user_id}&branch_id=${
                this.branch_id
            }${dates}&last_days=${this.last_days}&type=${this.type}&csv=1&jwt=${
                this.$http.defaults.headers.common.jwt
            }`
        },
        placeholder() {
            if (this.routerName === 'statsBranches') return 'Поиск по названию'
            if (this.routerName === 'statsOperators') return 'Поиск по имени'
            if (this.routerName === 'statsPages') return 'Поиск по url'
            return 'Поиск'
        },
        btnDownloadShow() {
            return (
                (this.routerName !== 'statsOnceChat' && this.last_days !== '') ||
                (this.date_from !== '' && this.date_to !== '')
            )
        },
        filterSearchShow() {
            return (
                this.routerName !== 'statsOnceChat' &&
                this.routerName !== 'statsService' &&
                this.routerName !== 'statsBranchesDetail' &&
                this.routerName !== 'statsAll' &&
                this.routerName !== 'statsAllBranch' &&
                this.routerName !== 'statsAllOperator' &&
                this.routerName !== 'statsOperatorsDetail' &&
                this.routerName !== 'statsTags'
            )
        },
        routerName() {
            return this.$route.name
        },
        branchListAll() {
            let list = this.$store.state.user.branchListAll.slice()
            list.push({ title: 'Все отделы' })
            return list
        }
    },
    watch: {
        last_days(val) {
            if (!val) this.showCalendar = true
            else this.showCalendar = false
        }
    }
}
</script>

<style lang="scss">
.page-stats-inner {
    &__count {
        margin-bottom: calc-em(20);
        @extend %row-flex;

        li {
            @extend %h4;
        }
    }

    &__main {
        //padding-right:calc-em(15);
        //padding-bottom:calc-em(45);
        // min-width:1100px;
    }
    &__main.no-mw {
        max-width: 100%;
    }
}
</style>
