<template lang="pug">
    .stats-table-line
        base-table.stats-table-line__table(ref="scrollPushEl", :style="'transform:translateX('+translateX+'px)'")
            thead.stats-table-line__thead
                tr
                    th

                        base-radio-check(
                        v-if="$route.name==='statsAllBranch'"
                        v-model="by_dates" name="by_dates"
                        ) По датам

                    th
                        .stats-table-line__th-wrap
                            |Поступило <br> всего
                            btn-sort(:toggle="sortFieldsComp['dialogues_requests']", @result="val=>sortFieldsSetSortField(val,'dialogues_requests')")
                    th
                        .stats-table-line__th-wrap
                            |Принято
                            btn-sort(:toggle="sortFieldsComp['dialogues_accepted']", @result="val=>sortFieldsSetSortField(val,'dialogues_accepted')")
                    th
                        .stats-table-line__th-wrap
                            |Пропущено
                            btn-sort(:toggle="sortFieldsComp['dialogues_missed']", @result="val=>sortFieldsSetSortField(val,'dialogues_missed')")

                    th
                        .stats-table-line__th-wrap
                            base-icon(name="ball3")
                            btn-sort(:toggle="sortFieldsComp['excellent_ratings']", @result="val=>sortFieldsSetSortField(val,'excellent_ratings')")

                    th
                        .stats-table-line__th-wrap
                            base-icon(name="ball2")
                            btn-sort(:toggle="sortFieldsComp['middling_ratings']", @result="val=>sortFieldsSetSortField(val,'middling_ratings')")
                    th
                        .stats-table-line__th-wrap
                            base-icon(name="ball1")
                            btn-sort(:toggle="sortFieldsComp['badly_ratings']", @result="val=>sortFieldsSetSortField(val,'badly_ratings')")

                    th(v-if="hideStatsAllBranchAndByDates")
                        .stats-table-line__th-wrap
                            |Время <br>  в диалоге
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_chats']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_chats')")
                    th
                        .stats-table-line__th-wrap
                            | Время в диалоге <br> 1-2
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_1_2_chat']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_1_2_chat')")
                    th
                        .stats-table-line__th-wrap
                            | Время в диалоге <br> 3-5 (включительно)
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_3_5_chats']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_3_5_chats')")
                    th
                        .stats-table-line__th-wrap
                            | Время в диалоге <br> 6-10 (включительно)
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_6_10_chats']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_6_10_chats')")
                    th
                        .stats-table-line__th-wrap
                            |Время в диалоге <br>  11+
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_11_and_more_chats']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_11_and_more_chats')")
                    th
                        .stats-table-line__th-wrap
                            |Среднее время <br>  в диалоге
                            btn-sort(:toggle="sortFieldsComp['average_time_in_chats']", @result="val=>sortFieldsSetSortField(val,'average_time_in_chats')")
                    th
                        .stats-table-line__th-wrap
                            |Среднее время <br>  для пропущенных
                            btn-sort(:toggle="sortFieldsComp['missed_average_time']", @result="val=>sortFieldsSetSortField(val,'missed_average_time')")
                    th
                        .stats-table-line__th-wrap
                            |Среднее <br>  время ответа
                            btn-sort(:toggle="sortFieldsComp['first_answer_average_speed']", @result="val=>sortFieldsSetSortField(val,'first_answer_average_speed')")
                    th
                        .stats-table-line__th-wrap
                            |до 30 сек <br> % от общего
                            btn-sort(:toggle="sortFieldsComp['first_answers_in_30_seconds_percents']", @result="val=>sortFieldsSetSortField(val,'first_answers_in_30_seconds_percents')")
                    th
                        .stats-table-line__th-wrap
                            |31-60 сек <br> % от общего
                            btn-sort(:toggle="sortFieldsComp['first_answers_in_31_60_seconds_percents']", @result="val=>sortFieldsSetSortField(val,'first_answers_in_31_60_seconds_percents')")
                    th
                        .stats-table-line__th-wrap
                            |61-90 сек <br> % от общего
                            btn-sort(:toggle="sortFieldsComp['first_answers_in_61_90_seconds_percents']", @result="val=>sortFieldsSetSortField(val,'first_answers_in_61_90_seconds_percents')")
                    th
                        .stats-table-line__th-wrap
                            |Свыше 91 сек <br> % от общего
                            btn-sort(:toggle="sortFieldsComp['first_answers_in_91_more_seconds_percents']", @result="val=>sortFieldsSetSortField(val,'first_answers_in_91_more_seconds_percents')")
                    th
                        .stats-table-line__th-wrap
                            |Передано <br>  в отдел
                            btn-sort(:toggle="sortFieldsComp['dialogues_transferred_to_branches']", @result="val=>sortFieldsSetSortField(val,'dialogues_transferred_to_branches')")
                    th
                        .stats-table-line__th-wrap
                            |Обратились <br>  впервые
                            btn-sort(:toggle="sortFieldsComp['chats_with_new_guests']", @result="val=>sortFieldsSetSortField(val,'chats_with_new_guests')")

                    th(v-if="hideStatsAllBranchAndByDates")
                        .stats-table-line__th-wrap
                            |Время <br>  онлайн
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_online']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_online')")


                    th(v-if="hideStatsAllBranchAndByDates")
                        .stats-table-line__th-wrap
                            |Среднее <br>  время <br> оператора
                            btn-sort(:toggle="sortFieldsComp['average_time_in_chats_2']", @result="val=>sortFieldsSetSortField(val,'average_time_in_chats_2')")
                    th(v-if="hideStatsAllBranchAndByDates")
                        .stats-table-line__th-wrap
                            |Время <br>  в обеде
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_lunch']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_lunch')")
                    th
                        .stats-table-line__th-wrap
                            |Сообщений  <br> операторов
                            btn-sort(:toggle="sortFieldsComp['operator_messages']", @result="val=>sortFieldsSetSortField(val,'operator_messages')")
                    th
                        .stats-table-line__th-wrap
                            |Сообщений <br>  посетителей
                            btn-sort(:toggle="sortFieldsComp['guest_messages']", @result="val=>sortFieldsSetSortField(val,'guest_messages')")



            tbody(v-if="$route.name=='statsAllByHours' || $route.name=='statsAll' || $route.name=='statsAllBranch' || $route.name=='statsAllOperator'").commn
                tr(v-for="(item, index) in commonRow", :key="index")
                    td

                        | {{item.name}}


                    td {{item.dialogues_requests}}
                    td {{item.dialogues_accepted}}
                    td {{item.dialogues_missed}}
                    td {{item.excellent_ratings}}
                    td {{item.middling_ratings}}
                    td {{item.badly_ratings}}
                    td {{item.operators_time_in_chats  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_1_2_chat   | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_3_5_chats   | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_6_10_chats   | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_11_and_more_chats   | datetimeStoHMS(true)}}
                    td(v-if="hideStatsAllBranchAndByDates") {{item.average_time_in_chats | datetimeStoHMS(true)}}
                    td {{item.missed_average_time | datetimeStoHMS(true)}}
                    td {{item.first_answer_average_speed | datetimeStoHMS(true)}}



                    td {{item.first_answers_in_30_seconds }} #[br] {{item.first_answers_in_30_seconds_percents}}%
                    td {{item.first_answers_in_31_60_seconds }} #[br] {{item.first_answers_in_31_60_seconds_percents}}%
                    td {{item.first_answers_in_61_90_seconds }} #[br]{{item.first_answers_in_61_90_seconds_percents}}%
                    td {{item.first_answers_in_91_more_seconds }} #[br]{{item.first_answers_in_91_more_seconds_percents}}%


                    td {{item.dialogues_transferred_to_branches}}
                    td {{item.chats_with_new_guests}}

                    td(v-if="hideStatsAllBranchAndByDates") {{item.operators_time_in_online  | datetimeStoHMS(true)}}
                    td(v-if="hideStatsAllBranchAndByDates") {{item.average_time_in_chats_2  | datetimeStoHMS(true)}}


                    td(v-if="hideStatsAllBranchAndByDates") {{item.operators_time_in_lunch  | datetimeStoHMS(true)}}
                    td {{item.operator_messages}}
                    td {{item.guest_messages}}



            tbody(v-for="(item, index) in itemList", :key="item.id")
                tr
                    td(:colspan="30" style="padding:0")
                tr
                    td

                        template(v-if="$route.name=='statsAllByHours' || $route.name=='statsAllBranchByHours'")
                            btn-toggle-plus(:toggle="item.byHoursListToggle", @result="val=>byHoursGetList(item,val)")
                            |&nbsp

                        router-link(
                            v-if="item.id && $route.name!='statsAllBranchByHours'",
                            :to="link(item)"
                        ) {{item.name}}
                        span(v-else) {{item.name}}


                    td {{item.dialogues_requests}}
                    td {{item.dialogues_accepted}}
                    td {{item.dialogues_missed}}
                    td {{item.excellent_ratings}}
                    td {{item.middling_ratings}}
                    td {{item.badly_ratings}}
                    td {{item.operators_time_in_chats  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_1_2_chat   | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_3_5_chats   | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_6_10_chats   | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_11_and_more_chats   | datetimeStoHMS(true)}}
                    td(v-if="hideStatsAllBranchAndByDates") {{item.average_time_in_chats | datetimeStoHMS(true)}}
                    td {{item.missed_average_time | datetimeStoHMS(true)}}
                    td {{item.first_answer_average_speed | datetimeStoHMS(true)}}



                    td {{item.first_answers_in_30_seconds }} #[br] {{item.first_answers_in_30_seconds_percents}}%
                    td {{item.first_answers_in_31_60_seconds }} #[br] {{item.first_answers_in_31_60_seconds_percents}}%
                    td {{item.first_answers_in_61_90_seconds }} #[br]{{item.first_answers_in_61_90_seconds_percents}}%
                    td {{item.first_answers_in_91_more_seconds }} #[br]{{item.first_answers_in_91_more_seconds_percents}}%


                    td {{item.dialogues_transferred_to_branches}}
                    td {{item.chats_with_new_guests}}

                    td(v-if="hideStatsAllBranchAndByDates") {{item.operators_time_in_online  | datetimeStoHMS(true)}}
                    td(v-if="hideStatsAllBranchAndByDates") {{item.average_time_in_chats_2  | datetimeStoHMS(true)}}


                    td(v-if="hideStatsAllBranchAndByDates") {{item.operators_time_in_lunch  | datetimeStoHMS(true)}}
                    td {{item.operator_messages}}
                    td {{item.guest_messages}}



                template( v-if="item.byHoursListToggle")
                    tr(v-for="(item, index) in item.byHoursList")
                        td {{item.name}}


                        td {{item.dialogues_requests}}
                        td {{item.dialogues_accepted}}
                        td {{item.dialogues_missed}}
                        td {{item.excellent_ratings}}
                        td {{item.middling_ratings}}
                        td {{item.badly_ratings}}
                        td {{item.operators_time_in_chats  | datetimeStoHMS(true)}}
                        td {{item.operators_time_in_1_2_chat   | datetimeStoHMS(true)}}
                        td {{item.operators_time_in_3_5_chats   | datetimeStoHMS(true)}}
                        td {{item.operators_time_in_6_10_chats   | datetimeStoHMS(true)}}
                        td {{item.operators_time_in_11_and_more_chats   | datetimeStoHMS(true)}}
                        td(v-if="hideStatsAllBranchAndByDates") {{item.average_time_in_chats | datetimeStoHMS(true)}}
                        td {{item.missed_average_time | datetimeStoHMS(true)}}
                        td {{item.first_answer_average_speed | datetimeStoHMS(true)}}



                        td {{item.first_answers_in_30_seconds }} #[br] {{item.first_answers_in_30_seconds_percents}}%
                        td {{item.first_answers_in_31_60_seconds }} #[br] {{item.first_answers_in_31_60_seconds_percents}}%
                        td {{item.first_answers_in_61_90_seconds }} #[br]{{item.first_answers_in_61_90_seconds_percents}}%
                        td {{item.first_answers_in_91_more_seconds }} #[br]{{item.first_answers_in_91_more_seconds_percents}}%


                        td {{item.dialogues_transferred_to_branches}}
                        td {{item.chats_with_new_guests}}

                        td(v-if="hideStatsAllBranchAndByDates") {{item.operators_time_in_online  | datetimeStoHMS(true)}}
                        td(v-if="hideStatsAllBranchAndByDates") {{item.average_time_in_chats_2  | datetimeStoHMS(true)}}


                        td(v-if="hideStatsAllBranchAndByDates") {{item.operators_time_in_lunch  | datetimeStoHMS(true)}}
                        td {{item.operator_messages}}
                        td {{item.guest_messages}}


        nav.stats-table-line__nav
            ul.stats-table-line__nav-list
                li.stats-table-line__nav-item
                    base-btn.stats-table-line__nav-link.stats-table-line__nav-link_left(
                        color="info-lighten", @click="scrollPush('left')",
                        :class="{'active':showLeft}"
                    ) &#9001;
                li.stats-table-line__nav-item
                    base-btn.stats-table-line__nav-link.stats-table-line__nav-link_right(
                        color="info-lighten", @click="scrollPush('right')",
                        :class="{'active':showRight}"
                    ) &#9002;



</template>

<script>
import { sortFields, stats } from '@/mixins/mixins'
import BtnSort from '@/components/BtnSort'
import BtnTogglePlus from '@/components/BtnTogglePlus'

import { datetimeStoHMS } from '@/modules/datetime'
export default {
    components: {
        BtnSort,
        BtnTogglePlus
    },
    filters: {
        datetimeStoHMS
    },
    mixins: [stats, sortFields],
    props: {},

    data() {
        return {
            filterBranchIds: [],
            translateX: 0,
            maxStep: 2,
            countStep: 0,
            operatorList: [],
            commonRow: [],
            byHoursList: {}
        }
    },
    computed: {
        hideStatsAllBranchAndByDates() {
            return !(this.$route.name == 'statsAllBranch' && this.by_dates)
        },

        showRight() {
            return this.countStep < this.maxStep
        },
        showLeft() {
            return this.countStep !== 0
        },
        bodyListFormat() {
            return this.sortFieldsListGet
        },
        sortFieldsListSet() {
            if (this.$route.name === 'statsAllBranchByHours') return this.bodyList
            /*eslint-disable */
            console.log('sortFieldsListSet',this.bodyList.length);
            if(!this.bodyList.length) return []
                if(this.bodyList.length) this.commonRow = [this.bodyList[0]];

                let list = this.bodyList.slice(1)
                return list
				/*eslint-enabled */
            },

        },
        watch:{

            '$route'(){
                this.by_dates=0
            },
            by_dates:{
                handler(val){
                   this.$emit('byDates',val)

                },
                immediate: true
            },
        /*    employeesParams:{
                handler(val){
                    console.log('employeesParams',val , this.$route.name);
                    if((this.$route.name==='statsAllBranch' || this.$route.name==='statsAllBranchByHours') && val
                        && this.by_dates===0 && ( this.last_days || (this.date_from && this.date_to))) { //Иначе запрос 2 раза иногда вызывался и создавал дубликат



                        setTimeout(()=>{
                            this.getOperators()
                        },250)
                    }

                },
                immediate: true
            },*/

        },
        created(){

            //this.$emit('byDates',this.by_dates)


        },
        methods:{
            link(item) {
                let  params = {id:item.id}
                let name = ''
                if (this.$route.name === 'statsAll') name = 'statsAllBranch'
                if (this.$route.name === 'statsAllBranch') {
                    name =  'statsAllOperator'
                    params.branch_id = this.$route.params.id;
                }

                if (this.$route.name === 'statsAllByHours') name = 'statsAllBranchByHours'

                let obj = {
                    name,
                    params
                }

                return obj
            },
            byHoursGetList(row,toggle) {

                let findIndex = this.bodyList.findIndex(findItem=>findItem.id===row.id)
                this.$set(this.bodyList[findIndex], 'byHoursListToggle', toggle)


                if(this.bodyList[findIndex].byHoursRequestFlag) return

                this.$http.get('statistic/get-by-params',{
                    params:this.byHoursBranchParams(row.id)
                }).then((response)=>{
                    this.$set(this.bodyList[findIndex], 'byHoursList', response.data.data)
                    this.$set(this.bodyList[findIndex], 'byHoursRequestFlag', 1)
                })
            },
            byHoursBranchParams(branchIdOrUserId) {
                let type,fieldNameId

                if(this.$route.name==='statsAllByHours') {
                    fieldNameId = 'branch_id'
                    type = 'branch'
                }
                if(this.$route.name==='statsAllBranchByHours') {
                    fieldNameId = 'user_id'
                    type = 'employee'
                }



                return Object.assign({}, this.params, {
                    [fieldNameId]:branchIdOrUserId,
                    type:type,
                    byHours:1
                })
            },

            scrollPush(direction) {
                let el = this.$refs.scrollPushEl.$el;
                let step = Math.abs(window.innerWidth-el.offsetWidth-20)  / this.maxStep *-1



                if (direction === 'left' && this.countStep > 0) {
                    this.countStep-=1
                    this.translateX=step *this.countStep;
                }
                if(direction === 'right' && this.countStep < this.maxStep) {
                    this.countStep+=1
                    this.translateX=step *this.countStep;
                }
            }
        }
    }
</script>

<style lang="scss">
    .stats-table-line{

        &__table {
            table-layout: auto;
            transition:$glob-trans;

            td {
                white-space:nowrap;
            }
        }

        &__thead {
            vertical-align:top;

        }
        &__th-wrap {
            display:flex;
            align-items:flex-start;
            font-weight:normal;
            white-space:nowrap;
        }

        &__nav-link {
            position:fixed;

            top:0;
            bottom:0;
            color:glob-color('info');
            opacity:.5;


            font-size: 73px;
            padding-left:20px;
            padding-right:20px;

            &_right {
                right:0;
                &:not(.active) {
                    transform:translateX(100%);
                }

            }
            &_left {
                left:0;

                &:not(.active) {
                    transform:translateX(-100%);
                }
            }
        }
    }
</style>

