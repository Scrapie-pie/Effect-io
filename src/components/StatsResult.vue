<template lang="pug">
    section.stats-result(:class="'stats-result_'+type")
        .stats-result__dialogs
            table.stats-result__list
                tr.stats-result__item(v-for="(item, index) in dialogsListLeft" :key="index")
                    th(v-text="item.name+':'").stats-result__td
                    td.stats-result__td
                        |{{bodyListFormat[item.val] | format(item.type)}}
            table.stats-result__list
                tr.stats-result__item(v-for="(item, index) in dialogsListRight" :key="index")
                    th(v-text="item.name+':'").stats-result__td
                    td.stats-result__td
                        |{{bodyListFormat[item.val] | format(item.type)}}
        .stats-result__other
            table.stats-result__list
                tr.stats-result__item(v-for="(item, index) in ratingsList" :key="index")
                    th(v-text="item.name+':'").stats-result__td
                    td.stats-result__td
                        |{{bodyListFormat[item.val] | format(item.type)}}
            table.stats-result__list
                tr.stats-result__item(v-for="(item, index) in timeList" :key="index")
                    th(v-text="item.name+':'").stats-result__td
                    td.stats-result__td
                        |{{bodyListFormat[item.val] | format(item.type)}}

</template>

<script>

import {stats} from '@/mixins/mixins'

export default {
    mixins:[stats],
    data() {
        return {

            ratingsList:[
                {name:'Получено оценок "Отлично"',val:'excellent_ratings'},
                {name:'Получено оценок "Средне"',val:'middling_ratings'},
                {name:'Получено оценок "Плохо"',val:'badly_ratings'},
            ],
            timeList:[
                {name:'Время в статусе "Онлайн"',val:'operators_time_in_online',type:'time'},
                {name:'Время в статусе "Перерыв"',val:'operators_time_in_break',type:'time'},
                {name:'Время в статусе "Обед"',val:'operators_time_in_lunch',type:'time'},
                {name:'Время в статусе "Оффлайн',val:'operators_time_in_offline',type:'time'},
            ],
        }
    },
    computed:{
        dialogsListLeft(){
            let list = [
                {name:'Получено диалогов',val:'dialogues_requests'},
                {name:'Приянто диалогов',val:'dialogues_accepted'},
                {name:'Отклонено диалогов',val:'dialogues_declined'},
                {name:'Пропущено диалогов',val:'dialogues_missed'},
            ]
            if(this.type==="branch"){
                list.push({
                    name:'Процент от общего количества обращений',val:'dialogues_percents',type:'percent'
                })
            }

            return list
        },
        dialogsListRight(){
            let list = [
                {name:'Передано диалогов в отделы',val:'dialogues_transferred_to_branches'},
                {name:'Передано диалогов сотрудникам',val:'dialogues_transferred_to_employees'},
                {name:'Средняя скорость первого ответа на диалог',val:'first_answer_average_speed',type:'time'},

            ]

            if(this.type==="branch"){
                list.push(
                    {name:'Среднее время нахождения клиента в очереди',val:'average_guest_time_in_queue',type:'time'},
                    {name:'Максимальное время нахождения клиента в очереди',val:'maximum_guest_time_in_queue',type:'time'},
                )
            }

            if(this.type==="company"){
                list = [
                    {name:'Среднее время нахождения клиента в очереди',val:'average_guest_time_in_queue',type:'time'},
                    {name:'Максимальное время нахождения клиента в очереди',val:'maximum_guest_time_in_queue',type:'time'},
                    {name:'Средняя скорость первого ответа на диалог',val:'first_answer_average_speed',type:'time'},
                ]
            }
            return list
        },
        bodyListFormat(){
            return this.bodyList
        },
    },
    created(){

    }
}
</script>

<style lang="scss">
    .stats-result {
        $bg_color:glob-color('info-lighten');
        $el:'.stats-result';
        $border-radius:$glob-border-radius;
        margin-bottom:calc-em(70);
        &__list {
            margin-bottom:calc-em(60);
            display:block;
        }
        &__item {
            display:block;
            &+& {
                margin-top:calc-em(25);
            }
        }
        &__td {
            @extend %h4;
            margin-bottom:0;
            display:inline-block;
            vertical-align:middle;
        }
        #{$el}__dialogs {
            display:flex;
        }
        &_company {
            #{$el}__list {
                margin-bottom:0;
                width:50%;
                &+& {
                    margin-left:calc-em(50);
                }
            }
            #{$el}__dialogs,#{$el}__other {
                background-color:$bg_color;
                display:flex;
                padding:calc-em(40);
                border-radius: $border-radius;
                margin-top:calc-em(50);
            }
        }



    }
</style>

