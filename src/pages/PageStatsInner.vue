<template lang="pug">
    the-layout-table.page-stats-inner(@scrolldown="scrollDown")
        filter-drop-menu(
        is-save-result-page
        v-if="showLastDays"
        name="last_days",
        key="last_days",
        @get="filterLast_days"
        slot="control"
        type="radio"
        )
        filter-drop-menu(
        is-save-result-page
        v-show="showCalendar"
        name="calendar",
        :calendarOptions="calendarOptions"
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

        filter-drop-menu(
        v-if="routerName==='statsLogStatusOperatorList'"
        name="operator",
        @get="filterOperator"
        slot="control"
        key="operator"
        )

        ul.page-stats-inner__count(v-if="routerName==='statsService'" slot="head")
            li Отделов в команде: {{$store.state.user.branchListAll.length}}
            li Сотрудников в команде: {{$store.state.operators.all.length}}

        section.page-stats-inner__main.no-mw(v-show="last_days || date_from")
            component(
            @byDates="val=>by_dates=val",
            :is="activeComponent",
            v-bind="payload"
            v-on="listeners",
            :key="activeComponent"
            )

</template>

<script>
import config from '@/config/index'
const TheLayoutTable = () => import('@/components/TheLayoutTable')
const StatsOperators = () => import('@/components/StatsOperators')
const StatsBranches = () => import('@/components/StatsBranches')
const StatsPages = () => import('@/components/StatsPages')
const StatsLogStatusOperatorList = () => import('@/components/StatsLogStatusOperatorList')
const StatsLogStatusOperatorDetail = () => import('@/components/StatsLogStatusOperatorDetail')
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
        StatsLogStatusOperatorList,
        StatsLogStatusOperatorDetail,
        StatsService,
        StatsOnceChat,
        FilterDropMenu,
        StatsAll,
        StatsTags
    },
    mixins: [filterLastDaysAndCalendar],
    beforeRouteLeave(to, from, next) {
        this.$root.$emit('statsBeforeRouteLeave', { to, from })
        return next()
        // вызывается перед переходом от пути, соответствующего текущему компоненту;
        // имеет доступ к контексту экземпляра компонента `this`.
    },
    data() {
        return {
            filterSearchResult: [],
            itemList: [],
            branch: {
                title: 'Все отделы',
                id: null
            },
            by_dates: 0,
            users_ids: []
        }
    },
    computed: {
        showLastDays() {
            if (
                this.routerName === 'statsAllByHours' ||
                this.routerName === 'statsAllBranchByHours'
            )
                return false

            return true
        },
        calendarOptions() {
            let obj = {}
            if (
                this.routerName === 'statsAllByHours' ||
                this.routerName === 'statsAllBranchByHours'
            )
                obj.mode = 'single'

            return obj
        },
        activeComponent() {
            if (this.routerName === 'statsAllBranch') return 'statsAll'
            if (this.routerName === 'statsAllOperator') return 'statsAll'

            if (this.routerName === 'statsAllByHours') return 'statsAll'
            if (this.routerName === 'statsAllBranchByHours') return 'statsAll'

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
            if (this.routerName === 'statsAllOperator') {
                obj.user_id = this.user_id
                obj.branch_id = this.branch_id
            }

            if (this.routerName === 'statsAllByHours') obj.byHours = 1
            if (this.routerName === 'statsAllBranchByHours') {
                obj.branch_id = this.branch_id
            }

            if (this.routerName === 'statsLogStatusOperatorList') obj.users_ids = this.users_ids
            if (this.routerName === 'statsLogStatusOperatorDetail') obj.users_ids = [this.user_id]

            if (this.routerName === 'statsOperatorsDetail') obj.user_id = this.user_id

            if (this.routerName === 'statsBranchesDetail') obj.branch_id = this.branch_id

            if (this.routerName === 'statsOperators') obj.filterBranchId = this.branch.id
            if (this.routerName === 'statsPages') obj.search = this.search
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
            if (this.routerName === 'statsAllOperator') return +this.$route.params.branch_id
            return +this.$route.params.id
        },
        user_id() {
            return +this.$route.params.id
        },
        type() {
            if (this.routerName === 'statsTags') return 'tags'
            if (this.routerName === 'statsPages') return 'pages'
            if (
                this.routerName === 'statsLogStatusOperatorList' ||
                this.routerName === 'statsLogStatusOperatorDetail'
            )
                return 'online'

            if (this.routerName === 'statsAll') return 'branches'
            if (this.routerName === 'statsAllBranch') return 'branch'
            if (this.routerName === 'statsAllOperator') return 'employee'

            if (this.routerName === 'statsAllByHours') return 'branches'
            if (this.routerName === 'statsAllBranchByHours') return 'employees'
            if (this.routerName === 'statsAllOperatorByHours') return 'employee'

            if (this.routerName === 'statsService') return 'top'
            if (this.routerName === 'statsBranches') return 'branches'

            if (this.routerName === 'statsBranchesDetail') return 'branch'
            if (this.routerName === 'statsOperators') return 'employees'
            if (this.routerName === 'statsOperatorsDetail') return 'employee'

            return ''
        },
        downloadLink() {
            let href = {
                csv: 1,
                jwt: this.$http.defaults.headers.common.jwt
            }

            let newParams = {
                type: this.type,
                by_dates: this.by_dates
            }

            if (this.routerName === 'statsAllBranch') {
                if (this.by_dates) {
                    newParams.type = 'branch'
                } else {
                    newParams.type = 'employees'
                }
            }
            if (this.$route.name === 'statsAllOperator' && this.by_dates === 0) {
                newParams.by_dates = 1
            }
            if (this.$route.name === 'statsOnceChat') {
                newParams.type = 'top'
                newParams.is_one_time_chat = 1
            }

            href = Object.assign(href, this.payload, newParams)

            href = Object.keys(href)
                .map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(href[k])
                })
                .join('&')

            return `${config.api_server}statistic/get-by-params?${href}`
        },
        placeholder() {
            if (this.routerName === 'statsBranches') return 'Поиск по названию'
            if (this.routerName === 'statsOperators') return 'Поиск по имени'
            if (this.routerName === 'statsPages') return 'Поиск по url'
            return 'Поиск'
        },
        btnDownloadShow() {
            if (
                this.routerName === 'statsLogStatusOperatorList' ||
                this.routerName === 'statsLogStatusOperatorDetail'
            )
                return
            return this.last_days !== '' || (this.date_from !== '' && this.date_to !== '')
        },
        filterSearchShow() {
            return (
                this.routerName !== 'statsOnceChat' &&
                this.routerName !== 'statsLogStatusOperatorList' &&
                this.routerName !== 'statsLogStatusOperatorDetail' &&
                this.routerName !== 'statsService' &&
                this.routerName !== 'statsBranchesDetail' &&
                this.routerName !== 'statsAll' &&
                this.routerName !== 'statsAllBranch' &&
                this.routerName !== 'statsAllOperator' &&
                this.routerName !== 'statsAllByHours' &&
                this.routerName !== 'statsAllBranchByHours' &&
                this.routerName !== 'statsAllOperatorByHours' &&
                this.routerName !== 'statsOperatorsDetail' &&
                this.routerName !== 'statsTags'
            )
        },
        routerName() {
            return this.$route.name
        },
        branchListAll() {
            let list = this.$store.getters['user/branchListAll'].slice()
            list.push({ title: 'Все отделы' })
            return list
        }
    },

    watch: {
        routerName: {
            handler(val) {
                this.by_dates = 0 //Поставили галку, перешли на другой макет, нужно обнулить
                if (this.showCalendar) return //Иначе бага, если уже календарь был показан, то при переходе не было запроса
                if (val === 'statsAllByHours' || val === 'statsAllBranchByHours') {
                    this.filterLast_days('-1')
                    this.$store.commit('setFilter', { last_days: ['-1'] })
                }
            },

            immediate: true
        },

        last_days(val) {
            if (!val) this.showCalendar = true
            else this.showCalendar = false
        }
    },
    beforeCreate() {
        this.$root.$off(`statsBeforeRouteLeave`)
    },

    methods: {
        scrollDown(e) {
            this.$root.$emit(`statsScrollDown${this.routerName}`, e)
        },
        filterOperator(val) {
            console.log('filterOperator', val)
            this.users_ids = val
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
