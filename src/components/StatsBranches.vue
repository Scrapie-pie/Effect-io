<template lang="pug">
    base-table.stats-branches
        caption(v-if="caption" v-text="caption")
        thead: tr: th(v-for="(item, index) in headList" :key="index" v-html="item" )
        tbody
            tr(v-for="(item, index) in itemList" :key="item.id")
                td
                    span.h4 {{item.name}}
                    div(v-if="item.operators") сотрудников в отделе: {{item.operators.length}}
                td(v-if="!btnDetailHide")
                    base-btn.base-table__show-hover(
                        padding="xslr"
                        :router="{name:'statsBranchesDetail',params:{id:item.branch_id}}"
                    ) Детальная статистика
                td(v-text="item.dialogues_requests")
                template(v-if="order!=='dialogues_percents'")

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

import {stats} from '@/mixins/mixins'

export default {
    mixins:[stats],


    data() {
        return {
        }
    },
    computed:{
            headList(){
                let list = [
                    'Название отдела',
                    '',
                    'Получено<br>диалогов',
                    'Принято/<br>пропущено диалогов',
                    'Средняя скорость<br>ответа оператора',
                    'Средняе время<br>ожидания в очереди',
                    'Оценки',
                ]

                if(this.btnDetailHide) list.splice(1, 1)


                if(this.order==="dialogues_percents") {
                    list = [
                        'Название отдела',
                        'Получено диалогов',
                    ]
                    list.push('Процент от общего количества диалогов (всех отделов)')
                }
                return list
            },
        bodyListFormat(){
            return this.bodyList.map(item=>{
                item.branchName=''
                let branch = this.$store.state.user.branchListAll.find(itemSub=>itemSub.id===item.branch_id)
                if(branch) {
                    item.branchName = branch.title
                    item.name = branch.title //base-filter-search сейчас ищет по name
                }
                item.operators = this.$store.state.operators.all.filter(itemSub=>itemSub.branches_ids.includes(item.branch_id))

                return item
            })
        },
    },
}
</script>

<style lang="scss">
    .stats-branches{
        th:nth-child(1) {
            width:253px;
        }
        th:nth-child(2) {
            width:202px;
        }
    }
</style>
