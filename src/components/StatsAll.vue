<template lang="pug">
    .stats-table-line
        base-table.stats-table-line__table(ref="scrollPushEl", :style="'transform:translateX('+translateX+'px)'")
            thead.stats-table-line__thead
                tr
                    th

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
                            |Среднее время <br>  для пропущенных
                            btn-sort(:toggle="sortFieldsComp['missed_average_time']", @result="val=>sortFieldsSetSortField(val,'missed_average_time')")
                    th
                        .stats-table-line__th-wrap
                            |Среднее <br>  время ответа
                            btn-sort(:toggle="sortFieldsComp['first_answer_average_speed']", @result="val=>sortFieldsSetSortField(val,'first_answer_average_speed')")
                    th
                        .stats-table-line__th-wrap
                            |20 сек <br> % от общего
                            btn-sort(:toggle="sortFieldsComp['first_answers_in_20_40_seconds']", @result="val=>sortFieldsSetSortField(val,'first_answers_in_20_40_seconds')")
                    th
                        .stats-table-line__th-wrap
                            |40 сек <br> % от общего
                            btn-sort(:toggle="sortFieldsComp['first_answers_in_40_60_seconds']", @result="val=>sortFieldsSetSortField(val,'first_answers_in_40_60_seconds')")
                    th
                        .stats-table-line__th-wrap
                            |Более 60 сек <br> % от общего
                            btn-sort(:toggle="sortFieldsComp['first_answers_in_60_more_seconds']", @result="val=>sortFieldsSetSortField(val,'first_answers_in_60_more_seconds')")
                    th
                        .stats-table-line__th-wrap
                            |Передано <br>  в отдел
                            btn-sort(:toggle="sortFieldsComp['dialogues_transferred_to_branches']", @result="val=>sortFieldsSetSortField(val,'dialogues_transferred_to_branches')")
                    th
                        .stats-table-line__th-wrap
                            |Обратились <br>  впервые
                            btn-sort(:toggle="sortFieldsComp['chats_with_new_guests']", @result="val=>sortFieldsSetSortField(val,'chats_with_new_guests')")
                    th
                        .stats-table-line__th-wrap
                            |Время <br>  онлайн
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_online']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_online')")
                    th
                        .stats-table-line__th-wrap
                            |Время <br>  в диалоге
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_chats']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_chats')")
                    th
                        .stats-table-line__th-wrap
                            |1 чат
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_1_chat']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_1_chat')")
                    th
                        .stats-table-line__th-wrap
                            |2 чат
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_2_chat']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_2_chat')")
                    th
                        .stats-table-line__th-wrap
                            |3 чата
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_3_chat']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_3_chat')")
                    th
                        .stats-table-line__th-wrap
                            |4 чата <br> и более
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_4_and_more_chats']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_4_and_more_chats')")
                    th
                        .stats-table-line__th-wrap
                            |Среднее <br>  время <br>  в диалоге
                            btn-sort(:toggle="sortFieldsComp['average_time_in_chats']", @result="val=>sortFieldsSetSortField(val,'average_time_in_chats')")
                    th
                        .stats-table-line__th-wrap
                            |Время <br>  в перерыве
                            btn-sort(:toggle="sortFieldsComp['operators_time_in_break']", @result="val=>sortFieldsSetSortField(val,'operators_time_in_break')")
                    th
                        .stats-table-line__th-wrap
                            |Сообщений  <br> операторов
                            btn-sort(:toggle="sortFieldsComp['operator_messages']", @result="val=>sortFieldsSetSortField(val,'operator_messages')")
                    th
                        .stats-table-line__th-wrap
                            |Сообщений <br>  посетителей
                            btn-sort(:toggle="sortFieldsComp['guest_messages']", @result="val=>sortFieldsSetSortField(val,'guest_messages')")
                    th
                        .stats-table-line__th-wrap
                            base-icon(name="ball3")
                            btn-sort(:toggle="sortFieldsComp['excellent_ratings']", @result="val=>sortFieldsSetSortField(val,'excellent_ratings')")
                    th
                        .stats-table-line__th-wrap
                            base-icon(name="ball2")
                            btn-sort(:toggle="sortFieldsComp['badly_ratings']", @result="val=>sortFieldsSetSortField(val,'badly_ratings')")
                    th
                        .stats-table-line__th-wrap
                            base-icon(name="ball1")
                            btn-sort(:toggle="sortFieldsComp['middling_ratings']", @result="val=>sortFieldsSetSortField(val,'middling_ratings')")

            tbody
                tr(v-for="(item, index) in commonRow", :key="item.id")
                    td
                        router-link(
                        v-if="item.id"
                            :to="{name:link,params:{id:item.id}}"
                        ) {{item.name}}
                        span(v-else) {{item.name}}


                    td {{item.dialogues_requests}}
                    td {{item.dialogues_accepted}}
                    td {{item.dialogues_missed}}
                    td {{item.missed_average_time | datetimeStoHMS(true)}}
                    td {{item.first_answer_average_speed | datetimeStoHMS(true)}}
                    td {{item.first_answers_in_20_40_seconds }} #[br] {{item.first_answers_in_20_40_seconds_percents}}%
                    td {{item.first_answers_in_40_60_seconds }} #[br] {{item.first_answers_in_40_60_seconds_percents}}%
                    td {{item.first_answers_in_60_more_seconds }} #[br]{{item.first_answers_in_60_more_seconds_percents}}%

                    td {{item.dialogues_transferred_to_branches}}
                    td {{item.chats_with_new_guests}}
                    td {{item.operators_time_in_online  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_chats  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_1_chat  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_2_chats  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_3_chats  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_4_and_more_chats  | datetimeStoHMS(true)}}
                    td {{item.average_time_in_chats | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_break  | datetimeStoHMS(true)}}
                    td {{item.operator_messages}}
                    td {{item.guest_messages}}
                    td {{item.excellent_ratings}}
                    td {{item.badly_ratings}}
                    td {{item.middling_ratings}}

                tr(v-for="(item, index) in itemList", :key="item.id")
                    td
                        router-link(
                            v-if="item.id"
                            :to="{name:link,params:{id:item.id}}"
                        ) {{item.name}}
                        span(v-else) {{item.name}}


                    td {{item.dialogues_requests}}
                    td {{item.dialogues_accepted}}
                    td {{item.dialogues_missed}}
                    td {{item.missed_average_time | datetimeStoHMS(true)}}
                    td {{item.first_answer_average_speed | datetimeStoHMS(true)}}
                    td {{item.first_answers_in_20_40_seconds }} #[br] {{item.first_answers_in_20_40_seconds_percents}}%
                    td {{item.first_answers_in_40_60_seconds }} #[br] {{item.first_answers_in_40_60_seconds_percents}}%
                    td {{item.first_answers_in_60_more_seconds }} #[br]{{item.first_answers_in_60_more_seconds_percents}}%

                    td {{item.dialogues_transferred_to_branches}}
                    td {{item.chats_with_new_guests}}
                    td {{item.operators_time_in_online  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_chats  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_1_chat  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_2_chats  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_3_chats  | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_4_and_more_chats  | datetimeStoHMS(true)}}
                    td {{item.average_time_in_chats | datetimeStoHMS(true)}}
                    td {{item.operators_time_in_break  | datetimeStoHMS(true)}}
                    td {{item.operator_messages}}
                    td {{item.guest_messages}}
                    td {{item.excellent_ratings}}
                    td {{item.badly_ratings}}
                    td {{item.middling_ratings}}
        nav.stats-table-line__nav
            ul.stats-table-line__nav-list
                li.stats-table-line__nav-item
                    base-btn.stats-table-line__nav-link.stats-table-line__nav-link_left(
                        color="info-lighten", @click="scrollPush('left')",
                        :class="{'active':showLeft}"
                    ) &#9001
                li.stats-table-line__nav-item
                    base-btn.stats-table-line__nav-link.stats-table-line__nav-link_right(
                        color="info-lighten", @click="scrollPush('right')",
                        :class="{'active':showRight}"
                    ) &#9002;



</template>

<script>
    import {sortFields} from '@/mixins/mixins'
    import BtnSort  from '@/components/BtnSort'
    import {stats} from '@/mixins/mixins'
    import {datetimeStoHMS} from '@/modules/datetime'
    export default {
        components:{
            BtnSort
        },
        mixins:[stats,sortFields],
        filters:{
            datetimeStoHMS
        },
        props:{

        },

        data() {
            return {

                filterBranchIds:[],
                translateX:0,
                maxStep : 2,
                countStep:0,
                operatorList:[],
                commonRow:[]
            }
        },
        computed:{
            employeesParams(){
                return Object.assign({},this.params,{type:'employees'})
            },

            link(){
                if(this.$route.name==='statsAll') return 'statsAllBranch'
                if(this.$route.name==='statsAllBranch') return 'statsAllOperator'
            },
            showRight(){
                return this.countStep < this.maxStep
            },
            showLeft(){
                return this.countStep !== 0
            },
            bodyListFormat(){
                return  this.sortFieldsListGet
            },
            sortFieldsListSet(){
                this.commonRow = [this.bodyList[0]];

                let list = this.bodyList.slice(1)
                return list
            },

        },
        created(){




        },
        watch:{
            employeesParams:{
                handler(val){
                    if(this.$route.name==='statsAllBranch' && val) {



                        setTimeout(()=>{
                            this.getOperators()
                        },250)
                    }

                },
                immediate: true
            },

        },
        methods:{
            getOperators(){
                    if(this.last_days || (this.date_from && this.date_to)) {
                        this.$http.get('statistic-get-by-params',{
                            params:this.employeesParams
                        }).then((response)=>{
                            this.bodyList = [...this.bodyList,...response.data.data]

                        })
                    }
            },
            scrollPush(direction) {
                let el = this.$refs.scrollPushEl.$el;
                let step = Math.abs(window.innerWidth-el.offsetWidth-20)  / this.maxStep *-1


                console.log(direction,this.countStep);
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

