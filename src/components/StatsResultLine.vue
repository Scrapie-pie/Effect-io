<template lang="pug">
    base-table.stats-table-line(ref="scrollPushEl", :style="'transform:translateX('+translateX+'px)'")
        thead.stats-table-line__thead
            tr
                th
                    .stats-table-line__th-wrap
                        |Общие по отделу
                        base-btn(@click="scrollPush('right')") вправо
                        base-btn(@click="scrollPush('left')") влево
                th
                    .stats-table-line__th-wrap
                        |Поступило <br> всего
                        btn-sort(:toggle="compSort['dialogues_requests']", @result="val=>setSortField(val,'dialogues_requests')")
                th
                    .stats-table-line__th-wrap
                        |Принято
                        btn-sort(:toggle="compSort['dialogues_accepted']", @result="val=>setSortField(val,'dialogues_accepted')")
                th
                    .stats-table-line__th-wrap
                        |Пропущено
                        btn-sort(:toggle="compSort['dialogues_missed']", @result="val=>setSortField(val,'dialogues_missed')")
                th
                    .stats-table-line__th-wrap
                        |Среднее время <br>  для пропущенных
                        btn-sort(:toggle="compSort['missed_average_time']", @result="val=>setSortField(val,'missed_average_time')")
                th
                    .stats-table-line__th-wrap
                        |Среднее <br>  время ответа
                        btn-sort(:toggle="compSort['first_answer_average_speed']", @result="val=>setSortField(val,'first_answer_average_speed')")
                th
                    .stats-table-line__th-wrap
                        |20 сек <br> % от общего
                        btn-sort(:toggle="compSort['first_answers_in_20_40_seconds']", @result="val=>setSortField(val,'first_answers_in_20_40_seconds')")
                th
                    .stats-table-line__th-wrap
                        |40 сек <br> % от общего
                        btn-sort(:toggle="compSort['first_answers_in_40_60_seconds']", @result="val=>setSortField(val,'first_answers_in_40_60_seconds')")
                th
                    .stats-table-line__th-wrap
                        |Более 60 сек <br> % от общего
                        btn-sort(:toggle="compSort['first_answers_in_60_more_seconds']", @result="val=>setSortField(val,'first_answers_in_60_more_seconds')")
                th
                    .stats-table-line__th-wrap
                        |Передано <br>  в отдел
                        btn-sort(:toggle="compSort['dialogues_transferred_to_branches']", @result="val=>setSortField(val,'dialogues_transferred_to_branches')")
                th
                    .stats-table-line__th-wrap
                        |Обратились <br>  впервые
                        btn-sort(:toggle="compSort['chats_with_new_guests']", @result="val=>setSortField(val,'chats_with_new_guests')")
                th
                    .stats-table-line__th-wrap
                        |Время <br>  онлайн
                        btn-sort(:toggle="compSort['operators_time_in_online']", @result="val=>setSortField(val,'operators_time_in_online')")
                th
                    .stats-table-line__th-wrap
                        |Время <br>  в диалоге
                        btn-sort(:toggle="compSort['operators_time_in_chats']", @result="val=>setSortField(val,'operators_time_in_chats')")
                th
                    .stats-table-line__th-wrap
                        |1 чат
                        btn-sort(:toggle="compSort['operators_time_in_1_chat']", @result="val=>setSortField(val,'operators_time_in_1_chat')")
                th
                    .stats-table-line__th-wrap
                        |2 чат
                        btn-sort(:toggle="compSort['operators_time_in_2_chat']", @result="val=>setSortField(val,'operators_time_in_2_chat')")
                th
                    .stats-table-line__th-wrap
                        |3 чата
                        btn-sort(:toggle="compSort['operators_time_in_3_chat']", @result="val=>setSortField(val,'operators_time_in_3_chat')")
                th
                    .stats-table-line__th-wrap
                        |4 чата <br> и более
                        btn-sort(:toggle="compSort['operators_time_in_4_and_more_chats']", @result="val=>setSortField(val,'operators_time_in_4_and_more_chats')")
                th
                    .stats-table-line__th-wrap
                        |Среднее <br>  время <br>  в диалоге
                        btn-sort(:toggle="compSort['average_time_in_chats']", @result="val=>setSortField(val,'average_time_in_chats')")
                th
                    .stats-table-line__th-wrap
                        |Время <br>  в перерыве
                        btn-sort(:toggle="compSort['operators_time_in_break']", @result="val=>setSortField(val,'operators_time_in_break')")
                th
                    .stats-table-line__th-wrap
                        |Сообщений  <br> операторов
                        btn-sort(:toggle="compSort['operator_messages']", @result="val=>setSortField(val,'operator_messages')")
                th
                    .stats-table-line__th-wrap
                        |Сообщений <br>  посетителей
                        btn-sort(:toggle="compSort['guest_messages']", @result="val=>setSortField(val,'guest_messages')")
                th
                    .stats-table-line__th-wrap
                        base-icon(name="ball3")
                        btn-sort(:toggle="compSort['excellent_ratings']", @result="val=>setSortField(val,'excellent_ratings')")
                th
                    .stats-table-line__th-wrap
                        base-icon(name="ball2")
                        btn-sort(:toggle="compSort['badly_ratings']", @result="val=>setSortField(val,'badly_ratings')")
                th
                    .stats-table-line__th-wrap
                        base-icon(name="ball1")
                        btn-sort(:toggle="compSort['middling_ratings']", @result="val=>setSortField(val,'middling_ratings')")

        tbody
            tr
                td


</template>

<script>

    const sortDefault = ()=> {return {
        val:[true],
        field:[
            'dialogues_requests',
            'dialogues_accepted',
            'dialogues_missed',
            'missed_average_time',
            'first_answer_average_speed',

        ],
        text:[
            'Поступило всего',
            'Принято'
        ],
    }}

    import BtnSort  from '@/components/BtnSort'
    import {stats} from '@/mixins/mixins'
    import lodash_sortBy from 'lodash/sortBy'

    export default {
        components:{
            BtnSort
        },
        mixins:[stats],
        props:{

        },

        data() {
            return {
                sort:sortDefault(),
                currentSort:{
                    val:sortDefault().val[0],
                    field:sortDefault().field[0]
                },
                filterBranchIds:[],
                translateX:0,
                maxStep : 3,
                countStep:0,
            }
        },
        computed:{
            compSort(){
                return this.sort.val
            },
            bodyListFormat(){
                return this.bodyList
                return  lodash_sortBy(
                    this.setFilterList.map(item=>{
                        return item
                    }),
                    [
                        (item)=>item[this.currentSort.field]*(this.currentSort.val?-1:1)
                    ]
                );
            },
            setFilterList(){
                console.log(this.bodyList);
                return  this.bodyList
            }
        },

        methods:{
            setSortField(val,index){
                this.$set(this.sort,'val',sortDefault().val)
                this.$set(this.sort.val,index,val);
                this.currentSort = {
                    'val':val,
                    'field':this.sort.field[index],

                }
            },
            setCurrentFieldSort(index){

            },
            scrollPush(direction) {
                let el = this.$refs.scrollPushEl.$el;



                let step = Math.abs(window.innerWidth-el.offsetWidth)  / this.maxStep


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
        table-layout: auto;
        transition:$glob-trans;
        &__thead {
            vertical-align:top;
            min-width: 2120px;

        }
        &__th-wrap {
            display:flex;
            align-items:flex-start;
            font-weight:normal;
            white-space:nowrap;
        }
    }
</style>

